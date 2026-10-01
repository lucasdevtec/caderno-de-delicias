import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ForkBadge } from "@/components/ForkBadge";
import { CopyCadernoButton } from "@/components/CopyCadernoButton";
import { RecipeCard } from "@/components/RecipeCard";
import { RemoveRecipeFromCadernoButton } from "@/components/RemoveRecipeFromCadernoButton";
import {
  Globe,
  Lock,
  ArrowUpDown,
  Edit,
  Plus,
  ArrowLeft,
  UtensilsCrossed,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface CadernoPageProps {
  params: Promise<{ id: string }>;
}

export default async function CadernoDetailPage({ params }: CadernoPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const caderno = await prisma.caderno.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
      originalCaderno: {
        select: {
          id: true,
          title: true,
          slug: true,
          isPublic: true,
          user: { select: { id: true, name: true, username: true } },
        },
      },
      recipes: {
        include: {
          recipe: {
            include: {
              user: { select: { id: true, name: true, username: true } },
            },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!caderno) {
    notFound();
  }

  // Se o caderno for privado e o usuário logado não for o dono
  const isOwner = user?.id === caderno.userId;
  if (!caderno.isPublic && !isOwner) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4">
        <Lock className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">Caderno Privado</h2>
        <p className="text-stone-500 text-sm">
          Este caderno é privado e só pode ser visualizado pelo seu criador.
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

  return (
    <div className="space-y-8 pb-16">
      {/* Top Hero Banner */}
      <div
        className="w-full relative text-white py-12 px-4 sm:px-6 lg:px-8 shadow-inner"
        style={{ backgroundColor: caderno.coverColor || "#EA580C" }}
      >
        <div className="max-w-7xl mx-auto space-y-4">
          <Link
            href="/cadernos"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white transition-colors bg-black/20 px-3 py-1 rounded-full backdrop-blur-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar aos cadernos</span>
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-black/30 backdrop-blur-xs">
              {caderno.isPublic ? (
                <>
                  <Globe className="w-3.5 h-3.5" /> Público
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" /> Privado
                </>
              )}
            </span>

            {/* Atribuição de Caderno Copiado */}
            {(caderno.originalCadernoId || caderno.originalAuthorName) && (
              <ForkBadge
                originalCadernoId={caderno.originalCadernoId}
                originalCadernoSlug={caderno.originalCaderno?.slug}
                originalCadernoTitle={caderno.originalCaderno?.title}
                originalAuthorName={
                  caderno.originalAuthorName ||
                  caderno.originalCaderno?.user?.name
                }
              />
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-xs">
            {caderno.title}
          </h1>

          {caderno.description && (
            <p className="max-w-2xl text-white/90 text-sm sm:text-base leading-relaxed drop-shadow-xs">
              {caderno.description}
            </p>
          )}

          {/* Autor e Ações */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/20">
            <div className="flex items-center gap-2.5">
              {caderno.user.image ? (
                <img
                  src={caderno.user.image}
                  alt={caderno.user.name || "Autor"}
                  className="w-8 h-8 rounded-full object-cover border border-white/30 shadow-2xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-xs text-white">
                  {caderno.user.name?.[0]?.toUpperCase() || "C"}
                </div>
              )}
              <span className="text-xs sm:text-sm font-medium text-white/95">
                Organizado por{" "}
                <strong className="font-bold">
                  {caderno.user.name || `@${caderno.user.username}`}
                </strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Botão de Copiar se público e não for o dono */}
              {caderno.isPublic && (
                <CopyCadernoButton
                  cadernoId={caderno.id}
                  cadernoTitle={caderno.title}
                  isOwner={isOwner}
                  variant="primary"
                  className="bg-white text-orange-900 hover:bg-orange-50"
                />
              )}

              {/* Botões do Proprietário */}
              {isOwner && (
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/cadernos/${caderno.id}/editar`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-colors"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Reordenar / Editar</span>
                  </Link>
                  <Link
                    href={`/receitas/nova?cadernoId=${caderno.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-orange-900 hover:bg-orange-50 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Receita</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Recipes List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-stone-900">
              Receitas no Caderno ({caderno.recipes.length})
            </h2>
          </div>

          {isOwner && caderno.recipes.length > 1 && (
            <Link
              href={`/cadernos/${caderno.id}/editar`}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Alterar Ordem das Receitas</span>
            </Link>
          )}
        </div>

        {caderno.recipes.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-300 space-y-3">
            <UtensilsCrossed className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">
              Este caderno ainda não possui receitas
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Adicione receitas que você já criou ou crie um prato novo para estrear este caderno.
            </p>
            {isOwner && (
              <Link
                href={`/receitas/nova?cadernoId=${caderno.id}`}
                className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" /> Adicionar Receita Agora
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {caderno.recipes.map((cr, idx) => (
              <div key={cr.id} className="relative group">
                <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-stone-900/80 text-white text-xs font-bold flex items-center justify-center backdrop-blur-xs shadow-xs">
                  #{idx + 1}
                </div>
                {isOwner && (
                  <div className="absolute top-2 right-2 z-10">
                    <RemoveRecipeFromCadernoButton
                      cadernoId={caderno.id}
                      recipeId={cr.recipe.id}
                      recipeTitle={cr.recipe.title}
                    />
                  </div>
                )}
                <RecipeCard recipe={cr.recipe} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
