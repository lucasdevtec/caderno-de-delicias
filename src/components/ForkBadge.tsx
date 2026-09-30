import React from "react";
import Link from "next/link";
import { GitFork, ExternalLink, Sparkles } from "lucide-react";

interface ForkBadgeProps {
  originalCadernoId?: string | null;
  originalCadernoSlug?: string | null;
  originalCadernoTitle?: string | null;
  originalAuthorName?: string | null;
  className?: string;
}

export function ForkBadge({
  originalCadernoId,
  originalCadernoSlug,
  originalCadernoTitle,
  originalAuthorName,
  className = "",
}: ForkBadgeProps) {
  if (!originalCadernoId && !originalAuthorName) {
    return null;
  }

  const destinationHref = originalCadernoSlug
    ? `/cadernos/${originalCadernoSlug}`
    : originalCadernoId
    ? `/cadernos/${originalCadernoId}`
    : "#";

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs sm:text-sm shadow-xs ${className}`}
    >
      <div className="flex items-center gap-1.5 font-medium text-amber-700">
        <GitFork className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 rotate-180" />
        <span>Copiado com amor de:</span>
      </div>

      <Link
        href={destinationHref}
        className="inline-flex items-center gap-1 font-semibold text-orange-700 hover:text-orange-900 hover:underline transition-colors"
      >
        <span>{originalCadernoTitle || "Caderno Original"}</span>
        <ExternalLink className="w-3 h-3 opacity-70" />
      </Link>

      {originalAuthorName && (
        <span className="text-amber-800/80">
          por <strong className="font-medium text-amber-900">{originalAuthorName}</strong>
        </span>
      )}

      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-200/60 text-amber-800 ml-auto">
        <Sparkles className="w-2.5 h-2.5 text-amber-600" />
        Origem Pública
      </span>
    </div>
  );
}
