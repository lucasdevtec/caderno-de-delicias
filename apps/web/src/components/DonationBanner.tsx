import React from "react";
import Link from "next/link";
import { Heart, Sparkles, Coffee } from "lucide-react";

export function DonationBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-y border-orange-200/80 py-3 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-600 shadow-xs">
            <Heart className="w-5 h-5 fill-orange-500 text-orange-600 animate-pulse" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-stone-900">
              Caderno de Delícias é 100% Livre, Aberto e Mantido pela Comunidade
            </p>
            <p className="text-xs text-stone-600">
              Sem anúncios invasivos ou pop-ups na hora de cozinhar. Apoie nosso servidor com qualquer valor no Pix!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/doar"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Pagar um Cafézinho (Pix)</span>
          </Link>
          <Link
            href="/doar#transparencia"
            className="text-xs text-orange-800 hover:text-orange-950 font-medium px-2 py-1.5"
          >
            Ver Metas
          </Link>
        </div>
      </div>
    </div>
  );
}
