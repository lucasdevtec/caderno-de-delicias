import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { CadernoCard } from '@/components/CadernoCard';
import { RecipeCard } from '@/components/RecipeCard';
import { BookMarked, UtensilsCrossed, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Descobrir Receitas e Cadernos',
  description:
    'Explore centenas de receitas culinárias deliciosas e coleções criadas com carinho pela comunidade do Caderno de Delícias.',
  alternates: {
    canonical: '/descobrir',
  },
  openGraph: {
    title: 'Descobrir Receitas e Cadernos | Caderno de Delícias',
    description:
      'Explore centenas de receitas culinárias deliciosas e coleções criadas com carinho pela comunidade do Caderno de Delícias.',
    url: '/descobrir',
  },
};

interface DescobrirPageProps {
  searchParams: Promise<{
    q?: string;
    tab?: string;
    categoria?: string;
    sort?: string;
  }>;
}

export default async function DescobrirPage({
  searchParams,
}: DescobrirPageProps) {
  const { q, tab, categoria, sort } = await searchParams;
  const user = await getCurrentUser();
  const currentTab = tab === 'cadernos' ? 'cadernos' : 'receitas';
  const currentSort = sort === 'recentes' ? 'recentes' : 'acessadas';

  const cadernos = await prisma.caderno.findMany({
    where: {
      isPublic: true,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
      originalCaderno: {
        select: {
          id: true,
          title: true,
          slug: true,
          user: { select: { name: true, username: true } },
        },
      },
      recipes: {
        include: {
          recipe: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              difficulty: true,
            },
          },
        },
        orderBy: { position: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const receitasOrderBy =
    currentSort === 'recentes'
      ? [{ createdAt: 'desc' as const }]
      : [
          { viewsCount: 'desc' as const },
          { cadernos: { _count: 'desc' as const } },
          { createdAt: 'desc' as const },
        ];

  const receitas = await prisma.recipe.findMany({
    where: {
      isPublic: true,
      ...(categoria ? { category: categoria } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      user: { select: { id: true, name: true, username: true } },
    },
    orderBy: receitasOrderBy,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Coleções Abertas</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Descobrir Cadernos e Receitas
        </h1>
        <p className="text-stone-600 text-sm sm:text-base">
          Explore cadernos públicos criados por chefs amadores, cozinheiros de
          família e amantes da gastronomia. Copie para a sua conta qualquer
          caderno com um clique!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 sm:gap-3 border-b border-stone-200 pb-2 overflow-x-auto whitespace-nowrap">
        <Link
          href={`/descobrir?tab=receitas${q ? `&q=${encodeURIComponent(q)}` : ''}${sort ? `&sort=${sort}` : ''}`}
          className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-colors ${
            currentTab === 'receitas'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Receitas da Comunidade ({receitas.length})</span>
        </Link>
        <Link
          href={`/descobrir?tab=cadernos${q ? `&q=${encodeURIComponent(q)}` : ''}`}
          className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-colors ${
            currentTab === 'cadernos'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>Cadernos Públicos ({cadernos.length})</span>
        </Link>
      </div>

      {/* Search Input & Sorting Controls */}
      <div className="space-y-4">
        <form method="GET" action="/descobrir" className="max-w-md">
          <input type="hidden" name="tab" value={currentTab} />
          {currentTab === 'receitas' && (
            <input type="hidden" name="sort" value={currentSort} />
          )}
          <div className="relative">
            <input
              type="text"
              name="q"
              defaultValue={q || ''}
              placeholder={
                currentTab === 'cadernos'
                  ? 'Buscar cadernos pelo título...'
                  : 'Buscar receitas...'
              }
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>

        {currentTab === 'receitas' && (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
            <div className="flex items-center gap-2 text-stone-500">
              <span className="font-semibold text-stone-700">Classificação:</span>
              <div className="inline-flex rounded-xl bg-stone-100 p-0.5 border border-stone-200">
                <Link
                  href={`/descobrir?tab=receitas${q ? `&q=${encodeURIComponent(q)}` : ''}&sort=acessadas`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                    currentSort === 'acessadas'
                      ? 'bg-white text-orange-700 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>🔥 Mais Acessadas</span>
                </Link>
                <Link
                  href={`/descobrir?tab=receitas${q ? `&q=${encodeURIComponent(q)}` : ''}&sort=recentes`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                    currentSort === 'recentes'
                      ? 'bg-white text-orange-700 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>⏱️ Mais Recentes</span>
                </Link>
              </div>
            </div>

            <span className="text-stone-400 text-[11px]">
              {currentSort === 'acessadas'
                ? 'Exibindo receitas por número de acessos e popularidade'
                : 'Exibindo receitas pela data de publicação'}
            </span>
          </div>
        )}
      </div>

      {/* Grid Content */}
      {currentTab === 'cadernos' ? (
        cadernos.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
            <BookMarked className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-stone-600 font-medium">
              Nenhum caderno público encontrado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cadernos.map((caderno) => (
              <CadernoCard
                key={caderno.id}
                caderno={caderno}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )
      ) : receitas.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
          <UtensilsCrossed className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-stone-600 font-medium">
            Nenhuma receita encontrada.
          </p>
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
