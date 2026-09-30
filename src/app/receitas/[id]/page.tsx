import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatMinutes, formatDifficulty } from "@/lib/utils";
import {
  Clock,
  Users,
  ChefHat,
  ArrowLeft,
  Sparkles,
  BookMarked,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { RecipeIngredientsList } from "./RecipeIngredientsList";
import { AddRecipeToCadernoButton } from "@/components/AddRecipeToCadernoButton";

export const dynamic = "force-dynamic";

interface ReceitaPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReceitaDetailPage({ params }: ReceitaPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const recipe = await prisma.recipe.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: {
      user: { select: { id: true, name: true, username: true, image: true, bio: true } },
    },
  });

  if (!recipe) {
    notFound();
  }

  const isAuthor = user?.id === recipe.userId;
  if (!recipe.isPublic && !isAuthor) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4">
        <Lock className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">Receita Privada</h2>
        <p className="text-stone-500 text-sm">
          Esta receita é privada e só pode ser visualizada pelo autor.
        </p>
        <Link
          href="/descobrir"
          className="inline-block text-orange-600 font-semibold text-sm hover:underline"
        >
          Voltar para Descobrir
        </Link>
      </div>
    );
  }

  // Busca até os 2 cadernos públicos mais acessados/populares, contagens de privados e cadernos do usuário logado
  const [
    publicCadernoRecipes,
    totalPublicCount,
    privateCount,
    userPrivateCadernoRecipe,
    userCadernos,
  ] = await Promise.all([
    prisma.cadernoRecipe.findMany({
      where: {
        recipeId: recipe.id,
        caderno: { isPublic: true },
      },
      include: {
        caderno: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverColor: true,
            isPublic: true,
          },
        },
      },
      orderBy: [
        { caderno: { forks: { _count: "desc" } } },
        { addedAt: "asc" },
      ],
      take: 2,
    }),
    prisma.cadernoRecipe.count({
      where: {
        recipeId: recipe.id,
        caderno: { isPublic: true },
      },
    }),
    prisma.cadernoRecipe.count({
      where: {
        recipeId: recipe.id,
        caderno: { isPublic: false },
      },
    }),
    user
      ? prisma.cadernoRecipe.findFirst({
          where: {
            recipeId: recipe.id,
            caderno: { userId: user.id, isPublic: false },
          },
          include: {
            caderno: { select: { id: true, slug: true, title: true } },
          },
        })
      : Promise.resolve(null),
    user
      ? prisma.caderno.findMany({
          where: { userId: user.id },
          select: {
            id: true,
            title: true,
            slug: true,
            coverColor: true,
            isPublic: true,
            recipes: {
              where: { recipeId: recipe.id },
              select: { id: true },
            },
          },
          orderBy: { updatedAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  const initialUserCadernos = userCadernos.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    coverColor: c.coverColor,
    isPublic: c.isPublic,
    hasRecipe: c.recipes.length > 0,
  }));

  const totalMinutes = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  // Typecast ingredients & instructions do JSON do Prisma
  const ingredients = (recipe.ingredients as Array<{
    item: string;
    quantity: string;
    unit?: string;
  }>) || [];

  const instructions = (recipe.instructions as Array<{
    stepNumber: number;
    title?: string;
    description: string;
  }>) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Navigation & Quick Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/descobrir?tab=receitas"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Receitas</span>
        </Link>

        <AddRecipeToCadernoButton
          recipeId={recipe.id}
          recipeTitle={recipe.title}
          recipeSlug={recipe.slug}
          isLoggedIn={Boolean(user)}
          initialUserCadernos={initialUserCadernos}
        />
      </div>

      {/* Header & Cover Banner */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {recipe.category && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                {recipe.category}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
              Dificuldade: {formatDifficulty(recipe.difficulty)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            {recipe.title}
          </h1>

          {recipe.description && (
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-3xl">
              {recipe.description}
            </p>
          )}

          {/* Quick Metrics & Author */}
          <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-stone-200">
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-600">
              {recipe.prepTimeMinutes ? (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Preparo: <strong>{formatMinutes(recipe.prepTimeMinutes)}</strong></span>
                </div>
              ) : null}

              {recipe.cookTimeMinutes ? (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Cozimento: <strong>{formatMinutes(recipe.cookTimeMinutes)}</strong></span>
                </div>
              ) : null}

              {recipe.servings ? (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span>Rende: <strong>{recipe.servings} porções</strong></span>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600">
              <span>Receita por:</span>
              <strong className="text-stone-900 font-bold">
                {recipe.user.name || `@${recipe.user.username}`}
              </strong>
            </div>
          </div>
        </div>

        {/* Cover Image if present */}
        {recipe.coverImage && (
          <div className="h-72 sm:h-96 w-full relative rounded-3xl overflow-hidden shadow-xs border border-stone-200">
            <Image
              src={recipe.coverImage}
              alt={recipe.title}
              fill
              unoptimized={recipe.coverImage.startsWith("data:")}
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* Cadernos que contêm esta receita: até 2 públicos mais acessados + contagem de privados */}
      {(publicCadernoRecipes.length > 0 || privateCount > 0) && (
        <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-orange-950 flex items-center gap-1.5 shrink-0">
              <BookMarked className="w-4 h-4 text-orange-600" />
              Esta receita está nos cadernos:
            </span>

            {/* Até 1 ou 2 cadernos públicos mais acessados/populares */}
            {publicCadernoRecipes.map((cr) => (
              <Link
                key={cr.caderno.id}
                href={`/cadernos/${cr.caderno.slug || cr.caderno.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-2xs"
                style={{ backgroundColor: cr.caderno.coverColor || "#EA580C" }}
                title={`Ver caderno público: ${cr.caderno.title}`}
              >
                <span>{cr.caderno.title}</span>
              </Link>
            ))}

            {/* Indicador de outros cadernos públicos além dos 2 principais */}
            {totalPublicCount > 2 && (
              <span className="text-xs text-stone-500 font-medium">
                + {totalPublicCount - 2} outros
              </span>
            )}
          </div>

          {/* Quantidade de cadernos privados em que esta receita foi guardada */}
          {privateCount > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-stone-200/90 text-stone-600 text-xs font-medium shadow-2xs self-start sm:self-auto">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>
                Salvo em <strong>{privateCount}</strong> {privateCount === 1 ? "caderno pessoal privado" : "cadernos pessoais privados"}
              </span>
              {userPrivateCadernoRecipe && (
                <Link
                  href={`/cadernos/${userPrivateCadernoRecipe.caderno.slug || userPrivateCadernoRecipe.caderno.id}`}
                  className="text-orange-600 font-bold hover:underline ml-1"
                  title="Abrir o seu caderno privado onde esta receita está guardada"
                >
                  (incluindo o seu)
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ingredients & Steps Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Coluna 1: Ingredientes Interativos com Checklist */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
          <RecipeIngredientsList ingredients={ingredients} />
        </div>

        {/* Coluna 2: Modo de Preparo Passo a Passo */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-stone-900 border-b border-stone-200 pb-3">
            Modo de Preparo
          </h2>

          <div className="space-y-4">
            {instructions.map((step) => (
              <div
                key={step.stepNumber}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:border-orange-200 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-orange-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {step.stepNumber}
                </span>
                <div className="space-y-1">
                  {step.title && (
                    <h3 className="font-bold text-stone-900 text-base">
                      {step.title}
                    </h3>
                  )}
                  <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dicas do Chef */}
          {recipe.tips && (
            <div className="p-6 bg-amber-50/80 rounded-3xl border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Segredo do Chef / Dica Especial</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed italic">
                "{recipe.tips}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
