import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Users, UtensilsCrossed } from "lucide-react";
import { formatMinutes, formatDifficulty } from "@/lib/utils";

export interface RecipeCardData {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  prepTimeMinutes?: number | null;
  cookTimeMinutes?: number | null;
  servings?: number | null;
  difficulty?: string | null;
  category?: string | null;
  coverImage?: string | null;
  user?: {
    id?: string;
    name?: string | null;
    username?: string | null;
  };
}

interface RecipeCardProps {
  recipe: RecipeCardData;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalMinutes = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  const difficultyColors = {
    FACIL: "bg-emerald-50 text-emerald-700 border-emerald-200",
    MEDIO: "bg-amber-50 text-amber-700 border-amber-200",
    DIFICIL: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const badgeColor =
    recipe.difficulty && recipe.difficulty in difficultyColors
      ? difficultyColors[recipe.difficulty as keyof typeof difficultyColors]
      : difficultyColors.FACIL;

  return (
    <Link
      href={`/receitas/${recipe.slug || recipe.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-stone-200/90 hover:border-orange-300 shadow-xs hover:shadow-md transition-all overflow-hidden"
    >
      {/* Cover Image */}
      <div className="h-44 w-full relative bg-stone-100 overflow-hidden">
        {recipe.coverImage ? (
          <Image
            src={recipe.coverImage}
            alt={recipe.title}
            fill
            unoptimized={recipe.coverImage.startsWith("data:")}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-orange-50/50">
            <UtensilsCrossed className="w-8 h-8 text-orange-300 mb-1" />
            <span className="text-xs text-stone-500 font-medium">Caderno de Delícias</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {recipe.category ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-orange-800 shadow-xs backdrop-blur-xs">
              {recipe.category}
            </span>
          ) : (
            <span />
          )}

          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeColor}`}
          >
            {formatDifficulty(recipe.difficulty)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-stone-900 text-base group-hover:text-orange-600 transition-colors line-clamp-2">
            {recipe.title}
          </h3>

          {recipe.description && (
            <p className="text-xs text-stone-600 line-clamp-2 mt-1">
              {recipe.description}
            </p>
          )}
        </div>

        {/* Info Badges & Author */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-3">
            {totalMinutes > 0 && (
              <span className="inline-flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {formatMinutes(totalMinutes)}
              </span>
            )}
            {recipe.servings && (
              <span className="inline-flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                {recipe.servings} porções
              </span>
            )}
          </div>

          {recipe.user?.name && (
            <span className="text-[11px] text-stone-600 font-medium truncate max-w-[100px]">
              por {recipe.user.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
