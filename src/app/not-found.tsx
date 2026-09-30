import React from "react";
import Link from "next/link";
import { ChefHat, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xs p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-2xs">
          <ChefHat className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            Erro 404 • Não Encontrado
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Receita ou Caderno Não Encontrado
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Parece que esta página saiu do cardápio, mudou de endereço ou ainda não foi criada.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Voltar para a Página Inicial</span>
          </Link>

          <Link
            href="/descobrir"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-sm transition-colors"
          >
            <Compass className="w-4 h-4 text-orange-600" />
            <span>Explorar Receitas e Cadernos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
