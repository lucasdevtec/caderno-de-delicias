import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { RecipeCard } from "@/components/RecipeCard";
import { UtensilsCrossed, Plus, Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface ReceitasPageProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function ReceitasPage({ searchParams }: ReceitasPageProps) {
  const { q, status } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?returnUrl=/receitas");
  }

  const whereClause: Record<string, unknown> = {
    userId: user.id,
  };

  if (status === "rascunhos") {
    whereClause.isDraft = true;
  } else if (status === "publicadas") {
    whereClause.isDraft = false;
  }

  if (q) {
    whereClause.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const [receitas, totalCount, draftCount] = await Promise.all([
    prisma.recipe.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.recipe.count({ where: { userId: user.id } }),
    prisma.recipe.count({ where: { userId: user.id, isDraft: true } }),
  ]);

  const publishedCount = totalCount - draftCount;
  const currentStatus = status || "todas";

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

      {/* Tabs & Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Link
            href={q ? `/receitas?q=${encodeURIComponent(q)}` : "/receitas"}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              currentStatus === "todas"
                ? "bg-orange-600 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
            }`}
          >
            Todas ({totalCount})
          </Link>
          <Link
            href={`/receitas?status=publicadas${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              currentStatus === "publicadas"
                ? "bg-orange-600 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
            }`}
          >
            Publicadas ({publishedCount})
          </Link>
          <Link
            href={`/receitas?status=rascunhos${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              currentStatus === "rascunhos"
                ? "bg-amber-600 text-white shadow-2xs"
                : "bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100"
            }`}
          >
            Rascunhos ({draftCount})
          </Link>
        </div>

        {/* Barra de Busca */}
        <form method="GET" action="/receitas" className="w-full md:w-72">
          {status && <input type="hidden" name="status" value={status} />}
          <div className="relative">
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder="Buscar nas minhas receitas..."
              className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-xs sm:text-sm bg-white"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-[11px] font-semibold text-stone-700 cursor-pointer"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Grid de Receitas */}
      {receitas.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-300 space-y-3">
          <UtensilsCrossed className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">
            {currentStatus === "rascunhos"
              ? "Você não tem nenhum rascunho salvo"
              : currentStatus === "publicadas"
              ? "Você não tem nenhuma receita publicada"
              : "Você ainda não cadastrou nenhuma receita"}
          </h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            {currentStatus === "rascunhos"
              ? "Ao cadastrar uma receita, você pode clicar em 'Salvar como Rascunho' para continuar editando mais tarde."
              : "Comece salvando aquela receita especial de família ou o prato favorito do seu final de semana."}
          </p>
          <Link
            href="/receitas/nova"
            className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" /> Cadastrar Nova Receita
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
