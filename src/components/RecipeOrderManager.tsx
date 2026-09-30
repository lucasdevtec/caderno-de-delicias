"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowDown, Check, Loader2, GripVertical, UtensilsCrossed, Trash2 } from "lucide-react";

export interface RecipeOrderItem {
  id: string;
  title: string;
  slug: string;
  coverImage?: string | null;
  category?: string | null;
  position: number;
}

interface RecipeOrderManagerProps {
  cadernoId: string;
  initialRecipes: RecipeOrderItem[];
  onOrderSaved?: () => void;
}

export function RecipeOrderManager({
  cadernoId,
  initialRecipes,
  onOrderSaved,
}: RecipeOrderManagerProps) {
  const [recipes, setRecipes] = useState<RecipeOrderItem[]>(
    [...initialRecipes].sort((a, b) => a.position - b.position)
  );
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleRemoveRecipe(recipeId: string, recipeTitle: string) {
    const confirmed = window.confirm(
      `Deseja remover "${recipeTitle}" deste caderno?\n\nA receita original continuará salva no sistema.`
    );
    if (!confirmed) return;

    setRemovingId(recipeId);
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

      setRecipes((prev) =>
        prev
          .filter((r) => r.id !== recipeId)
          .map((item, idx) => ({ ...item, position: idx }))
      );
      setSuccess(true);
      if (onOrderSaved) {
        onOrderSaved();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao remover receita.";
      setErrorMsg(msg);
    } finally {
      setRemovingId(null);
    }
  }

  function moveItem(index: number, direction: "up" | "down") {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === recipes.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newItems = [...recipes];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    // Atualiza positions baseado na nova ordem
    const reindexed = newItems.map((item, idx) => ({
      ...item,
      position: idx,
    }));

    setRecipes(reindexed);
    setHasChanges(true);
    setSuccess(false);
  }

  async function handleSaveOrder() {
    setSaving(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      const payload = {
        recipeOrders: recipes.map((r, idx) => ({
          recipeId: r.id,
          position: idx,
        })),
      };

      const res = await fetch(`/api/cadernos/${cadernoId}/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar a ordem das receitas.");
      }

      setSuccess(true);
      setHasChanges(false);
      if (onOrderSaved) {
        onOrderSaved();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao salvar ordem.";
      setErrorMsg(message);
    } finally {
      setSaving(false);
    }
  }

  if (recipes.length === 0) {
    return (
      <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
        <UtensilsCrossed className="w-10 h-10 text-stone-400 mx-auto mb-3" />
        <p className="text-stone-600 font-medium">Nenhuma receita neste caderno ainda.</p>
        <Link
          href="/receitas/nova"
          className="inline-block mt-3 text-sm text-orange-600 hover:text-orange-700 font-semibold"
        >
          + Adicionar primeira receita
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-stone-200">
        <div>
          <h3 className="font-semibold text-stone-800 text-base">
            Organizar Ordem das Receitas
          </h3>
          <p className="text-xs text-stone-500">
            Use as setas para definir a sequência exata em que as receitas aparecem no caderno.
          </p>
        </div>

        <button
          onClick={handleSaveOrder}
          disabled={!hasChanges || saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : success ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Ordem Salva!</span>
            </>
          ) : (
            <span>Salvar Nova Ordem</span>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
          {errorMsg}
        </div>
      )}

      {success && !hasChanges && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>A nova sequência foi atualizada com sucesso no seu caderno!</span>
        </div>
      )}

      <div className="divide-y divide-stone-100 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            className="flex items-center gap-3 p-3 sm:p-4 hover:bg-orange-50/40 transition-colors"
          >
            {/* Grip & Posição */}
            <div className="flex items-center gap-1.5 text-stone-400">
              <GripVertical className="w-4 h-4 opacity-50" />
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-stone-100 text-stone-700 text-xs font-bold">
                {index + 1}
              </span>
            </div>

            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-xl bg-orange-100 overflow-hidden relative shrink-0">
              {recipe.coverImage ? (
                <Image
                  src={recipe.coverImage}
                  alt={recipe.title}
                  fill
                  unoptimized={recipe.coverImage.startsWith("data:")}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-orange-400">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Título & Categoria */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-stone-900 truncate">
                {recipe.title}
              </h4>
              {recipe.category && (
                <span className="inline-block text-[11px] font-medium text-orange-600">
                  {recipe.category}
                </span>
              )}
            </div>

            {/* Controles de movimentação e remoção */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveItem(index, "up")}
                disabled={index === 0}
                className="p-2.5 sm:p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl hover:bg-stone-100 disabled:opacity-20 disabled:hover:bg-transparent text-stone-700 transition-colors cursor-pointer"
                title="Mover para cima"
                aria-label="Mover para cima"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, "down")}
                disabled={index === recipes.length - 1}
                className="p-2.5 sm:p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl hover:bg-stone-100 disabled:opacity-20 disabled:hover:bg-transparent text-stone-700 transition-colors cursor-pointer"
                title="Mover para baixo"
                aria-label="Mover para baixo"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleRemoveRecipe(recipe.id, recipe.title)}
                disabled={removingId === recipe.id}
                className="p-2.5 sm:p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-600 disabled:opacity-50 transition-colors cursor-pointer ml-1"
                title="Remover receita deste caderno"
                aria-label={`Remover ${recipe.title} deste caderno`}
              >
                {removingId === recipe.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
