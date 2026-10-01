"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Check, Sparkles, CheckCircle2 } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

interface PixDonationCardProps {
  pixKey?: string;
}

export const DEFAULT_PIX_KEY =
  process.env.NEXT_PUBLIC_PIX_KEY || "782b5623-0afa-4035-bbb6-7452045fddf3";

export function PixDonationCard({
  pixKey = DEFAULT_PIX_KEY,
}: PixDonationCardProps) {
  const [copiedKey, setCopiedKey] = useState(false);

  async function handleCopyKey() {
    const success = await copyToClipboard(pixKey);
    if (success) {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    }
  }

  return (
    <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md relative overflow-hidden">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Informações e Botão de Cópia da Chave */}
        <div className="space-y-4 text-center lg:text-left lg:col-span-7 xl:col-span-8 min-w-0 w-full">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" /> Doação Direta via Pix
          </span>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Contribua com qualquer valor no Pix
          </h2>

          <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
            Toda contribuição — seja R$ 2, R$ 5, R$ 20 ou o valor que você puder — ajuda diretamente a custear a hospedagem, o banco de dados e a manter o <strong>Caderno de Delícias</strong> 100% aberto e sem anúncios invasivos.
          </p>

          <div className="pt-2 w-full min-w-0">
            {/* Chave Pix */}
            <div className="bg-black/25 p-3.5 sm:p-4 rounded-2xl backdrop-blur-xs space-y-1.5 min-w-0">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-orange-200">
                <span>Chave Pix Aleatória:</span>
                <span className="text-[10px] text-amber-200 font-sans font-semibold">Chave Oficial</span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0">
                <div className="flex-1 min-w-0 font-mono text-xs sm:text-sm bg-white text-stone-900 px-3.5 py-2.5 rounded-xl select-all truncate text-left shadow-2xs font-semibold">
                  {pixKey}
                </div>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-orange-700 hover:bg-orange-800 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[3]" />
                      <span>Chave Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Chave</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end w-full min-w-0">
          <div className="bg-white p-5 sm:p-6 rounded-3xl text-stone-900 text-center shadow-xl space-y-3 w-full max-w-[260px] flex flex-col items-center">
            <div className="p-2 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-center">
              <Image
                src="/images/pix-qrcode.svg"
                alt="QR Code Pix - Caderno de Delícias"
                width={170}
                height={170}
                unoptimized
                priority
                className="rounded-lg w-[170px] h-[170px] object-contain"
              />
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-bold text-stone-900 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Escaneie com seu banco</span>
              </p>
              <p className="text-[11px] text-stone-500 whitespace-nowrap">
                Pix estático • Valor voluntário livre
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Círculo decorativo */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
    </div>
  );
}
