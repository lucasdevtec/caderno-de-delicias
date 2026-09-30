"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Erro capturado pela página error.tsx:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xs p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
          <AlertCircle className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            Algo deu errado
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Ops! A panela ferveu demais...
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Ocorreu um erro inesperado ao carregar as informações. Nossa cozinha já foi notificada para verificar os ingredientes.
          </p>
        </div>

        {error.digest && (
          <p className="text-[11px] text-stone-400 font-mono bg-stone-50 py-1 px-2.5 rounded-lg border border-stone-200 inline-block max-w-full truncate">
            Código: {error.digest}
          </p>
        )}

        <div className="pt-2 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tentar Novamente</span>
          </button>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-sm transition-colors"
          >
            <Home className="w-4 h-4 text-stone-500" />
            <span>Ir para o Início</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
