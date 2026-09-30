"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle, X } from "lucide-react";

interface RemoveRecipeFromCadernoButtonProps {
  cadernoId: string;
  recipeId: string;
  recipeTitle: string;
  onRemoved?: () => void;
  className?: string;
}

export function RemoveRecipeFromCadernoButton({
  cadernoId,
  recipeId,
  recipeTitle,
  onRemoved,
  className = "",
}: RemoveRecipeFromCadernoButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/cadernos/${cadernoId}/receitas`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao remover receita do caderno.");
      }

      setIsOpen(false);
      if (onRemoved) {
        onRemoved();
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao remover receita.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setErrorMsg("");
    setIsOpen(true);
  }

  function handleCloseModal(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!loading) {
      setIsOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModal}
        className={`w-8 h-8 rounded-full bg-white/90 hover:bg-rose-600 text-stone-600 hover:text-white flex items-center justify-center shadow-md backdrop-blur-xs transition-all cursor-pointer ${className}`}
        title="Remover receita deste caderno"
        aria-label={`Remover ${recipeTitle} deste caderno`}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={loading}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">Remover do Caderno?</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tem certeza de que deseja remover a receita <strong>"{recipeTitle}"</strong>{" "}
                deste caderno?
              </p>
              <p className="text-[11px] text-stone-400 pt-1">
                A receita original continuará salva no sistema; apenas deixará de constar nesta coleção.
              </p>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Removendo...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remover</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
