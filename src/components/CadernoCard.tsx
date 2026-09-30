import React from "react";
import Link from "next/link";
import { BookMarked, Globe, Lock, UtensilsCrossed, GitFork } from "lucide-react";
import { ForkBadge } from "./ForkBadge";
import { CopyCadernoButton } from "./CopyCadernoButton";

export interface CadernoCardData {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverColor?: string | null;
  coverImage?: string | null;
  icon?: string | null;
  isPublic: boolean;
  userId: string;
  user: {
    id?: string;
    name?: string | null;
    username?: string | null;
    image?: string | null;
  };
  originalCadernoId?: string | null;
  originalAuthorName?: string | null;
  originalCaderno?: {
    id: string;
    title: string;
    slug: string;
    user?: { name?: string | null; username?: string | null };
  } | null;
  recipes?: Array<{
    recipe?: { id: string; title: string; coverImage?: string | null };
  }>;
}

interface CadernoCardProps {
  caderno: CadernoCardData;
  currentUserId?: string | null;
}

export function CadernoCard({ caderno, currentUserId }: CadernoCardProps) {
  const isOwner = Boolean(currentUserId && currentUserId === caderno.userId);
  const recipeCount = caderno.recipes ? caderno.recipes.length : 0;
  const isForked = Boolean(caderno.originalCadernoId || caderno.originalAuthorName);

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200/90 hover:border-orange-300 shadow-xs hover:shadow-md transition-all overflow-hidden">
      {/* Top Banner with Color & Badges */}
      <div
        className="h-28 relative p-4 flex flex-col justify-between"
        style={{
          backgroundColor: caderno.coverColor || "#EA580C",
        }}
      >
        <div className="flex items-center justify-between z-10">
          {/* Public / Private Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/30 text-white backdrop-blur-xs">
            {caderno.isPublic ? (
              <>
                <Globe className="w-3 h-3" /> Público
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" /> Privado
              </>
            )}
          </span>

          {/* Quick Copy Button if public and not owner */}
          {caderno.isPublic && (
            <div>
              <CopyCadernoButton
                cadernoId={caderno.id}
                cadernoTitle={caderno.title}
                isOwner={isOwner}
                variant="secondary"
                className="bg-white/90 hover:bg-white text-stone-900 border-none text-xs py-1 px-2.5 h-auto shadow-xs"
              />
            </div>
          )}
        </div>

        {/* Icon & Recipe Count */}
        <div className="flex items-center justify-between text-white/95 z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
            <BookMarked className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium bg-black/20 px-2 py-0.5 rounded-lg">
            {recipeCount} {recipeCount === 1 ? "receita" : "receitas"}
          </span>
        </div>

        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Fork Attribution if copied */}
          {isForked && (
            <div className="mb-2">
              <ForkBadge
                originalCadernoId={caderno.originalCadernoId}
                originalCadernoSlug={caderno.originalCaderno?.slug}
                originalCadernoTitle={caderno.originalCaderno?.title}
                originalAuthorName={
                  caderno.originalAuthorName ||
                  caderno.originalCaderno?.user?.name
                }
              />
            </div>
          )}

          <Link
            href={`/cadernos/${caderno.slug || caderno.id}`}
            className="block group-hover:text-orange-600 transition-colors"
          >
            <h3 className="font-bold text-stone-900 text-lg line-clamp-1">
              {caderno.title}
            </h3>
          </Link>

          {caderno.description && (
            <p className="text-xs text-stone-600 line-clamp-2 mt-1">
              {caderno.description}
            </p>
          )}
        </div>

        {/* Footer / Author info */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-700">
              {caderno.user.name?.[0]?.toUpperCase() || "C"}
            </div>
            <span className="font-medium text-stone-700 truncate max-w-[120px]">
              {caderno.user.name || `@${caderno.user.username}`}
            </span>
          </div>

          <Link
            href={`/cadernos/${caderno.slug || caderno.id}`}
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            Abrir caderno →
          </Link>
        </div>
      </div>
    </div>
  );
}
