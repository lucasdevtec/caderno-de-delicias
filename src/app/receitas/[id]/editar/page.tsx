import React, { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { buildEntityLookupOr, getEntityUrlParam } from "@/lib/slug";
import {
  NovaReceitaForm,
  type CadernoOption,
  type InitialRecipeData,
} from "@/app/receitas/nova/NovaReceitaForm";
import { DEFAULT_RECIPE_CATEGORIES } from "@/app/api/categorias/route";

export const dynamic = "force-dynamic";

interface EditReceitaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReceitaPage({ params }: EditReceitaPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?returnUrl=/receitas/${id}/editar`);
  }

  const recipe = await prisma.recipe.findFirst({
    where: {
      OR: buildEntityLookupOr(id),
    },
  });

  if (!recipe) {
    notFound();
  }

  if (recipe.userId !== user.id || !recipe.isDraft) {
    redirect(`/receitas/${getEntityUrlParam(recipe)}`);
  }

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

  const initialRecipe: InitialRecipeData = {
    id: recipe.id,
    title: recipe.title,
    slug: recipe.slug,
    description: recipe.description,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    category: recipe.category,
    coverImage: recipe.coverImage,
    tips: recipe.tips,
    isPublic: recipe.isPublic,
    isDraft: recipe.isDraft,
    ingredients: (recipe.ingredients as InitialRecipeData["ingredients"]) || [],
    instructions: (recipe.instructions as InitialRecipeData["instructions"]) || [],
  };

  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-orange-600 border-t-transparent animate-spin" />
          <p className="text-xs text-stone-500 font-medium">Carregando rascunho...</p>
        </div>
      }
    >
      <NovaReceitaForm
        initialCadernos={cadernos as CadernoOption[]}
        initialCategories={sortedCategories}
        initialRecipe={initialRecipe}
      />
    </Suspense>
  );
}

