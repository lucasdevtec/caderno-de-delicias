"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getEntityUrlParam } from "@/lib/slug";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Globe,
  Lock,
  Upload,
  X,
  Link2,
  BookmarkCheck,
  FileEdit,
} from "lucide-react";

export interface CadernoOption {
  id: string;
  title: string;
}

export interface InitialRecipeData {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  prepTimeMinutes?: number | null;
  cookTimeMinutes?: number | null;
  servings?: number | null;
  difficulty?: string | null;
  category?: string | null;
  coverImage?: string | null;
  tips?: string | null;
  isPublic: boolean;
  isDraft: boolean;
  ingredients?: Array<{ item: string; quantity: string; unit?: string }>;
  instructions?: Array<{ stepNumber: number; title?: string; description: string }>;
}

interface NovaReceitaFormProps {
  initialCadernos: CadernoOption[];
  initialCategories: string[];
  initialRecipe?: InitialRecipeData;
}

// Comprime imagem do lado do cliente para gerar Data URL leve e rápida (max 1200x900, JPEG 82%)
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 900;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight ? (height = maxHeight) : null;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function adjustTextareaHeight(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

export function NovaReceitaForm({
  initialCadernos,
  initialCategories,
  initialRecipe,
}: NovaReceitaFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCadernoId = searchParams.get("cadernoId") || "";
  const isEditing = Boolean(initialRecipe);

  const [cadernos] = useState<CadernoOption[]>(initialCadernos);
  const [selectedCadernoId, setSelectedCadernoId] = useState(defaultCadernoId);

  // Categorias (apenas seleção, sem criar nova categoria)
  const [categories] = useState<string[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState(
    initialRecipe?.category || initialCategories[0] || "Doces & Sobremesas"
  );

  const [title, setTitle] = useState(initialRecipe?.title || "");
  const [description, setDescription] = useState(initialRecipe?.description || "");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<string>(
    initialRecipe?.prepTimeMinutes !== undefined && initialRecipe?.prepTimeMinutes !== null
      ? String(initialRecipe.prepTimeMinutes)
      : "20"
  );
  const [cookTimeMinutes, setCookTimeMinutes] = useState<string>(
    initialRecipe?.cookTimeMinutes !== undefined && initialRecipe?.cookTimeMinutes !== null
      ? String(initialRecipe.cookTimeMinutes)
      : "30"
  );
  const [servings, setServings] = useState<string>(
    initialRecipe?.servings !== undefined && initialRecipe?.servings !== null
      ? String(initialRecipe.servings)
      : "4"
  );
  const [difficulty, setDifficulty] = useState(initialRecipe?.difficulty || "FACIL");
  const [tips, setTips] = useState(initialRecipe?.tips || "");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">(
    initialRecipe && !initialRecipe.isDraft && !initialRecipe.isPublic
      ? "PRIVATE"
      : "PUBLIC"
  );

  // Foto de capa com upload e preview
  const [coverImage, setCoverImage] = useState(initialRecipe?.coverImage || "");
  const [imageFileName, setImageFileName] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [fallbackUrlInput, setFallbackUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tipsTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Lista dinâmica de ingredientes
  const [ingredients, setIngredients] = useState<
    Array<{ item: string; quantity: string; unit: string }>
  >(
    initialRecipe?.ingredients && initialRecipe.ingredients.length > 0
      ? initialRecipe.ingredients.map((i) => ({
          item: i.item || "",
          quantity: i.quantity || "",
          unit: i.unit || "",
        }))
      : [
          { item: "", quantity: "", unit: "" },
          { item: "", quantity: "", unit: "" },
        ]
  );

  // Lista dinâmica de instruções
  const [instructions, setInstructions] = useState<
    Array<{ stepNumber: number; title: string; description: string }>
  >(
    initialRecipe?.instructions && initialRecipe.instructions.length > 0
      ? initialRecipe.instructions.map((s, idx) => ({
          stepNumber: s.stepNumber || idx + 1,
          title: s.title || "",
          description: s.description || "",
        }))
      : [{ stepNumber: 1, title: "", description: "" }]
  );

  const [loading, setLoading] = useState(false);
  const [savingAsDraft, setSavingAsDraft] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const topErrorRef = useRef<HTMLDivElement>(null);
  const bottomErrorRef = useRef<HTMLDivElement>(null);

  function showError(msg: string) {
    setErrorMsg(msg);
    setTimeout(() => {
      bottomErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  useEffect(() => {
    adjustTextareaHeight(tipsTextareaRef.current);
  }, [tips]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Selecione um arquivo de imagem válido (JPG, PNG, WebP).");
      return;
    }

    try {
      setIsCompressing(true);
      setErrorMsg("");
      const compressedDataUrl = await compressImage(file);

      // Envia para /api/upload para salvar no volume de disco do container
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64: compressedDataUrl,
          filename: file.name,
        }),
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Não foi possível salvar a imagem no servidor.");
      }

      setCoverImage(uploadData.url);
      setImageFileName(file.name);
    } catch (err: unknown) {
      console.error("Erro ao processar imagem:", err);
      const msg = err instanceof Error ? err.message : "Não foi possível processar a imagem. Tente outra foto.";
      setErrorMsg(msg);
    } finally {
      setIsCompressing(false);
    }
  }

  function handleRemoveCover() {
    setCoverImage("");
    setImageFileName("");
    setFallbackUrlInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleApplyUrlFallback() {
    if (!fallbackUrlInput.trim()) return;
    setCoverImage(fallbackUrlInput.trim());
    setImageFileName("Imagem da Web");
  }

  function addIngredient() {
    setIngredients([...ingredients, { item: "", quantity: "", unit: "" }]);
  }

  function removeIngredient(index: number) {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function updateIngredient(index: number, field: "item" | "quantity" | "unit", value: string) {
    let sanitized = value;
    if (field === "quantity") {
      // Unidade/Quantidade numérica: apenas dígitos, vírgula, ponto e barra
      sanitized = value.replace(/[^0-9.,/]/g, "");
    } else if (field === "unit") {
      // Medida: apenas letras e espaços
      sanitized = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    }
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: sanitized };
    setIngredients(updated);
  }

  function addInstruction() {
    setInstructions([
      ...instructions,
      { stepNumber: instructions.length + 1, title: "", description: "" },
    ]);
  }

  function removeInstruction(index: number) {
    if (instructions.length === 1) return;
    const filtered = instructions.filter((_, i) => i !== index);
    const reindexed = filtered.map((item, i) => ({
      ...item,
      stepNumber: i + 1,
    }));
    setInstructions(reindexed);
  }

  function updateInstruction(index: number, field: string, value: string) {
    const updated = [...instructions];
    updated[index] = { ...updated[index], [field]: value };
    setInstructions(updated);
  }

  async function handleSave(asDraft: boolean, e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (!title.trim()) {
      showError("Por favor, preencha o título da receita.");
      return;
    }

    setLoading(true);
    setSavingAsDraft(asDraft);
    setErrorMsg("");

    const isDraft = asDraft;
    const isPublic = visibility === "PUBLIC";

    const validIngredients = ingredients
      .filter((i) => i.item.trim() !== "")
      .map((i) => ({
        item: i.item.trim(),
        quantity: i.quantity.trim(),
        unit: i.unit.trim(),
      }));

    const validInstructions = instructions
      .filter((i) => (i.title && i.title.trim() !== "") || (i.description && i.description.trim() !== ""))
      .map((i, idx) => ({
        stepNumber: idx + 1,
        title: i.title.trim(),
        description: i.description.trim(),
      }));

    if (!isDraft) {
      if (validIngredients.length === 0) {
        showError("Adicione pelo menos um ingrediente para publicar a sua receita.");
        setLoading(false);
        return;
      }

      if (validInstructions.length === 0) {
        showError("Adicione pelo menos um passo no modo de preparo (com título ou instruções) para publicar a receita.");
        setLoading(false);
        return;
      }
    }

    try {
      const parsedPrep = prepTimeMinutes.trim() === "" ? 0 : Math.max(0, parseInt(prepTimeMinutes, 10) || 0);
      const parsedCook = cookTimeMinutes.trim() === "" ? 0 : Math.max(0, parseInt(cookTimeMinutes, 10) || 0);
      const parsedServings = servings.trim() === "" ? 1 : Math.max(1, parseInt(servings, 10) || 1);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        prepTimeMinutes: parsedPrep,
        cookTimeMinutes: parsedCook,
        servings: parsedServings,
        difficulty,
        category: selectedCategory,
        coverImage: coverImage.trim() || null,
        tips: tips.trim(),
        ingredients: validIngredients,
        instructions: validInstructions,
        isPublic: isDraft ? false : isPublic,
        isDraft,
        cadernoId: !isEditing && selectedCadernoId ? selectedCadernoId : undefined,
      };

      const endpoint = isEditing ? `/api/receitas/${initialRecipe!.id}` : "/api/receitas";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar receita.");
      }

      router.push(`/receitas/${getEntityUrlParam(data.recipe)}`);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao salvar receita.";
      showError(message);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Link
        href={
          isEditing && initialRecipe
            ? `/receitas/${getEntityUrlParam(initialRecipe)}`
            : "/receitas"
        }
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isEditing ? "Voltar para a Receita" : "Voltar para Minhas Receitas"}</span>
      </Link>

      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-6 sm:p-10 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            {isEditing ? "Editar Rascunho de Receita" : "Nova Receita"}
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {isEditing
              ? "Continue editando seu rascunho ou altere o status para publicar sua receita."
              : "Cadastre os detalhes, tempo, porções, foto, ingredientes e o passo a passo com carinho."}
          </p>
        </div>

        {errorMsg && (
          <div
            ref={topErrorRef}
            className="p-4 bg-red-50 text-red-700 text-xs sm:text-sm rounded-2xl border border-red-200 flex items-start gap-2.5"
          >
            <span className="font-bold shrink-0">⚠️ Atenção:</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={(e) => handleSave(false, e)} className="space-y-8">
          {/* Seção 1: Dados Básicos */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-800 border-b border-stone-100 pb-2">
              1. Informações Principais
            </h2>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Título da Receita *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Bolo de Cenoura com Calda Crocante, Pão de Queijo Mineiro..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Breve Descrição / Memória Afetiva
              </label>
              <textarea
                rows={2}
                placeholder="Uma historinha rápida sobre essa receita ou o que a torna especial..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Preparo (min)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 20"
                  value={prepTimeMinutes}
                  onChange={(e) => setPrepTimeMinutes(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Cozimento / Forno (min)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 30"
                  value={cookTimeMinutes}
                  onChange={(e) => setCookTimeMinutes(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Rendimento (porções)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 4"
                  value={servings}
                  onChange={(e) => setServings(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Dificuldade
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                >
                  <option value="FACIL">Fácil</option>
                  <option value="MEDIO">Médio</option>
                  <option value="DIFICIL">Difícil</option>
                </select>
              </div>

              {/* Seletor de Categoria */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Categoria da Receita
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Foto de Capa: Carregar Imagem com Preview (Opcional) */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Foto de Capa do Prato (Opcional)
              </label>

              {coverImage ? (
                <div className="space-y-3">
                  <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImage}
                      alt="Prévia da foto de capa"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="absolute top-3 right-3 p-2 bg-stone-900/80 hover:bg-stone-900 text-white rounded-full backdrop-blur-xs transition-colors shadow-xs cursor-pointer"
                      title="Remover foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {imageFileName && (
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium truncate max-w-[80%]">
                        {imageFileName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Trocar Imagem</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-xs font-semibold text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover Foto</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-dashed border-stone-300 hover:border-orange-400 bg-stone-50/60 hover:bg-orange-50/30 transition-all cursor-pointer text-center group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 group-hover:border-orange-200 flex items-center justify-center text-stone-400 group-hover:text-orange-600 transition-colors shadow-2xs mb-3">
                      {isCompressing ? (
                        <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-stone-800 group-hover:text-orange-600 transition-colors">
                      {isCompressing ? "Processando imagem..." : "Carregar foto da receita"}
                    </span>
                    <p className="text-xs text-stone-500 mt-1">
                      Clique para escolher da galeria ou arraste uma foto (JPG, PNG, WebP)
                    </p>
                  </div>

                  {/* Fallback opcional por link da web */}
                  <div className="pt-1">
                    {!showUrlFallback ? (
                      <button
                        type="button"
                        onClick={() => setShowUrlFallback(true)}
                        className="text-[11px] font-semibold text-stone-500 hover:text-orange-600 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Link2 className="w-3 h-3" />
                        <span>Ou prefere colar o link de uma imagem da internet?</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-150">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={fallbackUrlInput}
                          onChange={(e) => setFallbackUrlInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-stone-300 text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleApplyUrlFallback}
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Aplicar Link
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowUrlFallback(false)}
                          className="p-1.5 text-stone-400 hover:text-stone-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Adicionar a um Caderno */}
            {!isEditing && cadernos.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Adicionar diretamente a um Caderno
                </label>
                <select
                  value={selectedCadernoId}
                  onChange={(e) => setSelectedCadernoId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                >
                  <option value="">Nenhum caderno por enquanto</option>
                  {cadernos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Seção 2: Ingredientes Dinâmicos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h2 className="text-base font-bold text-stone-800">
                2. Ingredientes
              </h2>
              <button
                type="button"
                onClick={addIngredient}
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Ingrediente
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 sm:p-0 bg-stone-50 sm:bg-transparent rounded-2xl sm:rounded-none border sm:border-0 border-stone-200"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Unid (ex: 2)"
                      value={ing.quantity}
                      onChange={(e) => updateIngredient(idx, "quantity", e.target.value)}
                      className="w-24 sm:w-24 px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Medida (ex: xícara)"
                      value={ing.unit}
                      onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
                      className="flex-1 sm:w-32 px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(idx)}
                      disabled={ingredients.length === 1}
                      className="sm:hidden p-2 text-stone-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                      title="Remover ingrediente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      placeholder="Nome do ingrediente (ex: farinha de trigo peneirada)"
                      value={ing.item}
                      onChange={(e) => updateIngredient(idx, "item", e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(idx)}
                      disabled={ingredients.length === 1}
                      className="hidden sm:block p-2 text-stone-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                      title="Remover ingrediente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seção 3: Modo de Preparo Dinâmico */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-100 pb-2">
              <div>
                <h2 className="text-base font-bold text-stone-800">
                  3. Modo de Preparo (Passo a Passo)
                </h2>
                <p className="text-xs text-stone-500">
                  A descrição detalhada é opcional. Preencha o título, a descrição ou ambos.
                </p>
              </div>
              <button
                type="button"
                onClick={addInstruction}
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer self-start sm:self-auto mt-1 sm:mt-0"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Passo
              </button>
            </div>

            <div className="space-y-3">
              {instructions.map((inst, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-stone-50/70 rounded-2xl border border-stone-200"
                >
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-2">
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Título do passo (ex: Bater a massa, Pré-aquecer forno - opcional)"
                      value={inst.title}
                      onChange={(e) => updateInstruction(idx, "title", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-white font-semibold"
                    />
                    <textarea
                      rows={2}
                      ref={(el) => adjustTextareaHeight(el)}
                      placeholder="Instruções detalhadas deste passo (opcional se preencher o título)..."
                      value={inst.description}
                      onChange={(e) => {
                        updateInstruction(idx, "description", e.target.value);
                        adjustTextareaHeight(e.currentTarget);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-white resize-none overflow-hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInstruction(idx)}
                    disabled={instructions.length === 1}
                    className="p-1 text-stone-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer mt-2"
                    title="Remover passo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dicas do Chef */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Dicas e Truques do Chef (Opcional)
            </label>
            <textarea
              ref={tipsTextareaRef}
              rows={2}
              placeholder="Ex: Não bata demais para não solar, use queijo curado ralado na hora..."
              value={tips}
              onChange={(e) => {
                setTips(e.target.value);
                adjustTextareaHeight(e.currentTarget);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm resize-none overflow-hidden"
            />
          </div>

          {/* Visibilidade / Status */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Privacidade ao Publicar
            </label>
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="recipeVis"
                  checked={visibility === "PUBLIC"}
                  onChange={() => setVisibility("PUBLIC")}
                  className="text-orange-600"
                />
                <span className="font-semibold text-stone-800 flex items-center gap-1">
                  <Globe className="w-4 h-4 text-orange-600" /> Pública (Visível na comunidade)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="recipeVis"
                  checked={visibility === "PRIVATE"}
                  onChange={() => setVisibility("PRIVATE")}
                  className="text-stone-600"
                />
                <span className="font-semibold text-stone-800 flex items-center gap-1">
                  <Lock className="w-4 h-4 text-stone-500" /> Privada (Só você vê)
                </span>
              </label>
            </div>
            <p className="text-[11px] text-stone-500">
              Atenção: apenas receitas salvas como <strong>Rascunho</strong> podem ser editadas posteriormente.
            </p>
          </div>

          {/* Feedback de Erro Visível no Rodapé */}
          {errorMsg && (
            <div
              ref={bottomErrorRef}
              className="p-4 bg-red-50 text-red-700 text-xs sm:text-sm rounded-2xl border border-red-200 flex items-start gap-2.5"
            >
              <span className="font-bold shrink-0">⚠️ Não foi possível salvar:</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Ações de Envio */}
          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Link
              href={
                isEditing && initialRecipe
                  ? `/receitas/${getEntityUrlParam(initialRecipe)}`
                  : "/receitas"
              }
              className="px-4 py-2.5 text-center text-sm font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
            >
              Cancelar
            </Link>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-sm font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading && savingAsDraft ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-500" />
                    <span>Salvando Rascunho...</span>
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-stone-500" />
                    <span>Salvar como Rascunho</span>
                  </>
                )}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                {loading && !savingAsDraft ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publicando Receita...</span>
                  </>
                ) : (
                  <span>Publicar Receita</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
