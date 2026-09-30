"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookmarkPlus,
  Check,
  Loader2,
  X,
  BookMarked,
  Plus,
  Lock,
  Globe,
  Sparkles,
} from "lucide-react";

export interface UserCadernoOption {
  id: string;
  title: string;
  slug: string;
  coverColor?: string | null;
  isPublic: boolean;
  hasRecipe?: boolean;
}

interface AddRecipeToCadernoButtonProps {
  recipeId: string;
  recipeTitle: string;
  recipeSlug?: string;
  isLoggedIn: boolean;
  initialUserCadernos?: UserCadernoOption[];
  className?: string;
}

export function AddRecipeToCadernoButton({
  recipeId,
  recipeTitle,
  recipeSlug,
  isLoggedIn,
  initialUserCadernos = [],
  className = "",
}: AddRecipeToCadernoButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cadernos, setCadernos] = useState<UserCadernoOption[]>(initialUserCadernos);
  const [loadingList, setLoadingList] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  async function handleOpen() {
    if (!isLoggedIn) {
      const destination = recipeSlug ? `/receitas/${recipeSlug}` : `/receitas/${recipeId}`;
      router.push(`/login?returnUrl=${encodeURIComponent(destination)}`);
      return;
    }

    setIsOpen(true);
    setFeedbackMsg(null);

    // Se já tiver os cadernos passados por prop, usa direto; senão, carrega da API
    if (cadernos.length === 0) {
      setLoadingList(true);
      try {
        const res = await fetch("/api/cadernos");
        const data = await res.json();
        if (res.ok && Array.isArray(data.cadernos)) {
          const mapped: UserCadernoOption[] = data.cadernos.map(
            (c: {
              id: string;
              title: string;
              slug: string;
              coverColor?: string | null;
              isPublic: boolean;
              recipes?: Array<{ recipeId?: string; recipe?: { id: string } }>;
            }) => ({
              id: c.id,
              title: c.title,
              slug: c.slug,
              coverColor: c.coverColor,
              isPublic: c.isPublic,
              hasRecipe: c.recipes?.some(
                (r) => r.recipeId === recipeId || r.recipe?.id === recipeId
              ),
            })
          );
          setCadernos(mapped);
        }
      } catch (err) {
        console.error("Erro ao carregar cadernos:", err);
      } finally {
        setLoadingList(false);
      }
    }
  }

  async function handleAddToCaderno(cadernoId: string, cadernoTitle: string) {
    if (addingId) return;
    setAddingId(cadernoId);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/cadernos/${cadernoId}/receitas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Não foi possível adicionar ao caderno.");
      }

      // Atualiza o estado local para marcar este caderno como já possuindo a receita
      setCadernos((prev) =>
        prev.map((c) => (c.id === cadernoId ? { ...c, hasRecipe: true } : c))
      );

      setFeedbackMsg({
        text: `Adicionada com sucesso ao caderno "${cadernoTitle}"!`,
        type: "success",
      });

      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao adicionar receita.";
      setFeedbackMsg({ text: msg, type: "error" });
    } finally {
      setAddingId(null);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer ${className}`}
        title="Salvar esta receita em um dos seus cadernos"
      >
        <BookmarkPlus className="w-4 h-4" />
        <span>Salvar no Meu Caderno</span>
      </button>

      {/* Modal de Seleção de Caderno */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-left relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fechar */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabeçalho */}
            <div className="space-y-1.5 pr-8">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold">
                <BookmarkPlus className="w-3 h-3 text-orange-600" />
                Organizar Receita
              </span>
              <h3 className="text-xl font-black text-stone-900 tracking-tight leading-snug">
                Salvar nos Seus Cadernos
              </h3>
              <p className="text-xs text-stone-500 line-clamp-1">
                Receita: <strong>{recipeTitle}</strong>
              </p>
            </div>

            {/* Feedback Message */}
            {feedbackMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  feedbackMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {feedbackMsg.type === "success" && (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            {/* Lista de Cadernos */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {loadingList ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-stone-400">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                  <span className="text-xs">Carregando seus cadernos...</span>
                </div>
              ) : cadernos.length === 0 ? (
                <div className="p-6 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
                  <BookMarked className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-xs text-stone-600 font-medium">
                    Você ainda não possui nenhum caderno criado.
                  </p>
                  <Link
                    href="/cadernos/novo"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Criar Primeiro Caderno</span>
                  </Link>
                </div>
              ) : (
                cadernos.map((caderno) => {
                  const isAdding = addingId === caderno.id;
                  const alreadyIn = Boolean(caderno.hasRecipe);

                  return (
                    <div
                      key={caderno.id}
                      className="p-3 rounded-2xl border border-stone-200 hover:border-orange-200 bg-stone-50/50 hover:bg-orange-50/20 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs font-bold text-xs"
                          style={{ backgroundColor: caderno.coverColor || "#EA580C" }}
                        >
                          <BookMarked className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {caderno.title}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-stone-500">
                            {caderno.isPublic ? (
                              <>
                                <Globe className="w-3 h-3 text-stone-400" />
                                <span>Público</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 text-stone-400" />
                                <span>Privado</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {alreadyIn ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>No Caderno</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddToCaderno(caderno.id, caderno.title)}
                            disabled={isAdding}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                          >
                            {isAdding ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                            <span>Adicionar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Rodapé com link para criar novo caderno */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <Link
                href="/cadernos/novo"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1 font-semibold text-orange-600 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Criar outro caderno temático</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-stone-500 hover:text-stone-800 font-medium cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
