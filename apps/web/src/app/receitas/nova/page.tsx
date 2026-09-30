"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  Users,
  ChefHat,
  Loader2,
  Globe,
  Lock,
} from "lucide-react";

interface CadernoOption {
  id: string;
  title: string;
}

export default function NovaReceitaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCadernoId = searchParams.get("cadernoId") || "";

  const [cadernos, setCadernos] = useState<CadernoOption[]>([]);
  const [selectedCadernoId, setSelectedCadernoId] = useState(defaultCadernoId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(20);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(30);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState("FACIL");
  const [category, setCategory] = useState("Doces & Sobremesas");
  const [coverImage, setCoverImage] = useState("");
  const [tips, setTips] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // Lista dinâmica de ingredientes
  const [ingredients, setIngredients] = useState([
    { item: "", quantity: "", unit: "" },
    { item: "", quantity: "", unit: "" },
  ]);

  // Lista dinâmica de instruções
  const [instructions, setInstructions] = useState([
    { stepNumber: 1, title: "", description: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadCadernos() {
      try {
        const res = await fetch("/api/cadernos");
        if (res.ok) {
          const data = await res.json();
          setCadernos(data.cadernos || []);
        }
      } catch (err) {
        console.error("Erro ao buscar cadernos:", err);
      }
    }
    loadCadernos();
  }, []);

  function addIngredient() {
    setIngredients([...ingredients, { item: "", quantity: "", unit: "" }]);
  }

  function removeIngredient(index: number) {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function updateIngredient(index: number, field: string, value: string) {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setErrorMsg("");

    const validIngredients = ingredients.filter((i) => i.item.trim() !== "");
    const validInstructions = instructions.filter((i) => i.description.trim() !== "");

    if (validIngredients.length === 0) {
      setErrorMsg("Adicione pelo menos um ingrediente.");
      setLoading(false);
      return;
    }

    if (validInstructions.length === 0) {
      setErrorMsg("Adicione pelo menos um passo de preparo.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title,
        description,
        prepTimeMinutes: Number(prepTimeMinutes) || 0,
        cookTimeMinutes: Number(cookTimeMinutes) || 0,
        servings: Number(servings) || 4,
        difficulty,
        category,
        coverImage: coverImage.trim() || null,
        tips,
        ingredients: validIngredients,
        instructions: validInstructions,
        isPublic,
        cadernoId: selectedCadernoId || undefined,
      };

      const res = await fetch("/api/receitas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar receita.");
      }

      router.push(`/receitas/${data.recipe.slug || data.recipe.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao cadastrar receita.";
      setErrorMsg(message);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Link
        href="/receitas"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Minhas Receitas</span>
      </Link>

      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-6 sm:p-10 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Nova Receita
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Cadastre os detalhes, tempo, porções, ingredientes e o passo a passo com carinho.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs sm:text-sm rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
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
                  type="number"
                  min="0"
                  value={prepTimeMinutes}
                  onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Cozimento / Forno (min)
                </label>
                <input
                  type="number"
                  min="0"
                  value={cookTimeMinutes}
                  onChange={(e) => setCookTimeMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Rendimento (porções)
                </label>
                <input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
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

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Categoria
                </label>
                <input
                  type="text"
                  placeholder="Ex: Doces & Sobremesas, Massas, Lanches..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                URL da Foto de Capa (Opcional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm"
              />
            </div>

            {/* Adicionar a um Caderno */}
            {cadernos.length > 0 && (
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
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Qtd (ex: 2)"
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(idx, "quantity", e.target.value)}
                    className="w-20 px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Unid (ex: xícaras, g, colheres)"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
                    className="w-28 px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Nome do ingrediente (ex: farinha de trigo peneirada)"
                    value={ing.item}
                    onChange={(e) => updateIngredient(idx, "item", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    disabled={ingredients.length === 1}
                    className="p-2 text-stone-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Seção 3: Modo de Preparo Dinâmico */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h2 className="text-base font-bold text-stone-800">
                3. Modo de Preparo (Passo a Passo)
              </h2>
              <button
                type="button"
                onClick={addInstruction}
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Passo
              </button>
            </div>

            <div className="space-y-3">
              {instructions.map((inst, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-stone-50/70 rounded-2xl border border-stone-200">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-2">
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Título do passo (ex: Bater a massa, Pré-aquecer o forno...)"
                      value={inst.title}
                      onChange={(e) => updateInstruction(idx, "title", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-white font-semibold"
                    />
                    <textarea
                      rows={2}
                      placeholder="Instruções detalhadas deste passo..."
                      value={inst.description}
                      onChange={(e) => updateInstruction(idx, "description", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-white resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInstruction(idx)}
                    disabled={instructions.length === 1}
                    className="p-1 text-stone-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer mt-2"
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
              rows={2}
              placeholder="Ex: Não bata demais para não solar, use queijo curado ralado na hora..."
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm resize-none"
            />
          </div>

          {/* Visibilidade */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Privacidade da Receita
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="recipeVis"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="text-orange-600"
                />
                <span className="flex items-center gap-1 font-semibold text-stone-800">
                  <Globe className="w-4 h-4 text-orange-600" /> Pública (qualquer um pode ver)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="recipeVis"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="text-stone-600"
                />
                <span className="flex items-center gap-1 font-semibold text-stone-800">
                  <Lock className="w-4 h-4 text-stone-600" /> Privada (só você)
                </span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-end gap-3">
            <Link
              href="/receitas"
              className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando Receita...</span>
                </>
              ) : (
                <span>Publicar Receita</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
