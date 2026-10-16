"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, Loader2 } from "lucide-react";

interface RecipeOwnerActionsProps {
  recipeId: string;
  recipeUrlParam: string;
  recipeTitle: string;
  isDraft: boolean;
}

export function RecipeOwnerActions({
  recipeId,
  recipeUrlParam,
  recipeTitle,
  isDraft,
}: RecipeOwnerActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a receita "${recipeTitle}"?\n\nEsta ação não poderá ser desfeita.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/receitas/${recipeId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao excluir receita.");
      }

      router.push("/receitas");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir receita.";
      alert(msg);
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isDraft && (
        <Link
          href={`/receitas/${recipeUrlParam}/editar`}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm transition-colors shadow-2xs"
          title="Continuar editando este rascunho"
        >
          <Edit className="w-4 h-4 text-amber-700" />
          <span>Editar Rascunho</span>
        </Link>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50"
        title="Excluir esta receita permanentemente"
      >
        {deleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
        <span>{deleting ? "Excluindo..." : "Excluir Receita"}</span>
      </button>
    </div>
  );
}

