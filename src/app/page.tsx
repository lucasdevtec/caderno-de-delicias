import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { CadernoCard } from '@/components/CadernoCard';
import { RecipeCard } from '@/components/RecipeCard';
import { DonationBanner } from '@/components/DonationBanner';
import {
  ChefHat,
  BookMarked,
  ArrowRight,
  GitFork,
  ArrowUpDown,
  Sparkles,
  Heart,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await getCurrentUser();

  // Buscar cadernos públicos em destaque
  let cadernosPublicos: any[] = [];
  let receitasPublicas: any[] = [];

  try {
    cadernosPublicos = await prisma.caderno.findMany({
      where: { isPublic: true },
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
      take: 6,
      orderBy: { createdAt: 'desc' },
    });

    receitasPublicas = await prisma.recipe.findMany({
      where: { isPublic: true },
      include: {
        user: { select: { id: true, name: true, username: true } },
      },
      take: 6,
      orderBy: [{ viewsCount: 'desc' }, { createdAt: 'desc' }],
    });
  } catch (err) {
    console.error('Erro ao carregar dados da home:', err);
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-amber-50/40 to-transparent pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-orange-100">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-orange-900 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Projeto Open Source • cadernodedelicias.com.br</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight sm:leading-none">
            Seu Caderno de Receitas,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              sem distrações.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-stone-600 leading-relaxed px-2">
            Crie suas receitas de família, organize em cadernos temáticos
            públicos ou privados, defina a ordem exata de cada prato e copie
            cadernos inspiradores com atribuição transparente.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 max-w-sm sm:max-w-none mx-auto">
            <Link
              href={user ? '/cadernos' : '/registro'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-98"
            >
              <span>
                {user ? 'Acessar Meus Cadernos' : 'Começar Meu Caderno Grátis'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/descobrir"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-3 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-sm sm:text-base shadow-2xs transition-colors"
            >
              <BookMarked className="w-4 h-4 text-orange-600" />
              <span>Explorar</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Donation Banner */}
      <DonationBanner />

      {/* Features Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-3">
              <BookMarked className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              Cadernos Temáticos
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Agrupe suas receitas por momento: sobremesas de domingo, almoços
              rápidos, massas caseiras ou ceias de Natal.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-3">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              Controle de Ordem
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Defina a sequência lógica dos pratos no caderno: entradas
              primeiro, pratos principais e depois as sobremesas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-3">
              <GitFork className="w-5 h-5 rotate-180" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              Cópia com Atribuição
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Gostou do caderno de alguém? Copie para a sua conta em um clique,
              com link e crédito permanente ao autor público original.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              Zero Anúncios Invasivos
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Sem vídeos saltando na tela nem pop-ups travando seu celular
              enquanto você cozinha. Mantido por doações.
            </p>
          </div>
        </div>
      </section>

      {/* Public Cadernos Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Comunidade Aberta
            </span>
            <h2 className="text-2xl font-black text-stone-900">
              Cadernos em Destaque
            </h2>
          </div>
          <Link
            href="/descobrir"
            className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
          >
            <span>Ver todos os cadernos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {cadernosPublicos.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-300">
            <ChefHat className="w-12 h-12 text-orange-300 mx-auto mb-3" />
            <h3 className="font-bold text-stone-800 text-lg">
              Nenhum caderno compartilhado por enquanto
            </h3>
            <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
              Seja o primeiro a compartilhar suas receitas favoritas com a comunidade!
            </p>
            <Link
              href="/cadernos/novo"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" /> Criar Caderno
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cadernosPublicos.map((caderno) => (
              <CadernoCard
                key={caderno.id}
                caderno={caderno}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent Recipes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Pratos e Segredos
            </span>
            <h2 className="text-2xl font-black text-stone-900">
              Receitas Mais Acessadas da Comunidade
            </h2>
          </div>
          <Link
            href="/descobrir?tab=receitas"
            className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
          >
            <span>Ver mais receitas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {receitasPublicas.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
            <p className="text-sm text-stone-500">
              Nenhuma receita cadastrada ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {receitasPublicas.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
