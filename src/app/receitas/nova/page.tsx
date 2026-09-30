import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NovaReceitaForm, type CadernoOption } from "./NovaReceitaForm";
import { DEFAULT_RECIPE_CATEGORIES } from "@/app/api/categorias/route";

export const dynamic = "force-dynamic";

export default async function NovaReceitaPage() {
  const user = await getCurrentUser();

  // Proteção da rota: exige login para acessar /receitas/nova
  if (!user) {
    redirect("/login?returnUrl=/receitas/nova");
  }

  // Busca cadernos do usuário e categorias já cadastradas no sistema
  const [cadernos, dbCategories] = await Promise.all([
    prisma.caderno.findMany({
      where: { userId: user.id },
      select: { id: true, title: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.recipe.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const categoriesSet = new Set<string>(DEFAULT_RECIPE_CATEGORIES);
  for (const item of dbCategories) {
    if (item.category && item.category.trim()) {
      categoriesSet.add(item.category.trim());
    }
  }

  const sortedCategories = Array.from(categoriesSet).sort((a, b) =>
    a.localeCompare(b, "pt-BR", { sensitivity: "base" })
  );

  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-orange-600 border-t-transparent animate-spin" />
          <p className="text-xs text-stone-500 font-medium">Carregando formulário...</p>
        </div>
      }
    >
      <NovaReceitaForm
        initialCadernos={cadernos as CadernoOption[]}
        initialCategories={sortedCategories}
      />
    </Suspense>
  );
}
