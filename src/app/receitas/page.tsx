import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { RecipeCard } from "@/components/RecipeCard";
import { UtensilsCrossed, Plus, Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface ReceitasPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ReceitasPage({ searchParams }: ReceitasPageProps) {
  const { q } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?returnUrl=/receitas");
  }

  const receitas = await prisma.recipe.findMany({
    where: {
      userId: user.id,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      user: { select: { id: true, name: true, username: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Minhas Receitas
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Todas as delícias criadas e salvas no seu acervo pessoal.
          </p>
        </div>

        <Link
          href="/receitas/nova"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Receita</span>
        </Link>
      </div>

      {/* Barra de Busca */}
      <form method="GET" action="/receitas" className="max-w-md">
        <div className="relative">
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Buscar nas minhas receitas..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-white"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Grid de Receitas */}
      {receitas.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-300 space-y-3">
          <UtensilsCrossed className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">
            Você ainda não cadastrou nenhuma receita
          </h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            Comece salvando aquela receita especial de família ou o prato favorito do seu final de semana.
          </p>
          <Link
            href="/receitas/nova"
            className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" /> Cadastrar Primeira Receita
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {receitas.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
