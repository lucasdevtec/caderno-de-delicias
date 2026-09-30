"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Check, QrCode, Sparkles, CheckCircle2 } from "lucide-react";

interface PixDonationCardProps {
  pixKey?: string;
  pixPayload?: string;
}

export const DEFAULT_PIX_KEY = "782b5623-0afa-4035-bbb6-7452045fddf3";
export const DEFAULT_PIX_PAYLOAD =
  "00020126580014br.gov.bcb.pix0136782b5623-0afa-4035-bbb6-7452045fddf35204000053039865802BR5919Caderno de Delicias6009SAO PAULO62070503***63042616";

export function PixDonationCard({
  pixKey = DEFAULT_PIX_KEY,
  pixPayload = DEFAULT_PIX_PAYLOAD,
}: PixDonationCardProps) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  async function handleCopyKey() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    } catch {
      // Fallback
    }
  }

  async function handleCopyPayload() {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2500);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden space-y-6">
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
        {/* Informações e Botões de Cópia */}
        <div className="space-y-4 max-w-xl text-center lg:text-left flex-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" /> Doação Direta via Pix
          </span>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Contribua com qualquer valor no Pix
          </h2>

          <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
            Toda contribuição — seja R$ 2, R$ 5, R$ 20 ou o valor que você puder — ajuda diretamente a custear a hospedagem, o banco de dados e a manter o <strong>Caderno de Delícias</strong> 100% aberto e sem anúncios invasivos.
          </p>

          <div className="pt-2 space-y-3">
            {/* Chave Pix */}
            <div className="bg-black/25 p-3.5 rounded-2xl backdrop-blur-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-orange-200">
                <span>Chave Pix Aleatória:</span>
                <span className="text-[10px] text-amber-200 font-sans font-semibold">Chave Oficial</span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 font-mono text-xs sm:text-sm bg-white text-stone-900 px-3 py-2 rounded-xl select-all truncate">
                  {pixKey}
                </div>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-700 hover:bg-orange-800 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
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

            {/* Código Pix Copia e Cola */}
            <div className="bg-black/25 p-3.5 rounded-2xl backdrop-blur-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-orange-200">
                <span>Pix Copia e Cola:</span>
                <span className="text-[10px] text-amber-200 font-sans font-semibold">Padrão BR Code</span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 font-mono text-xs bg-white/90 text-stone-700 px-3 py-2 rounded-xl select-all truncate">
                  {pixPayload}
                </div>
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-stone-900 hover:bg-stone-100 active:scale-98 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  {copiedPayload ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span className="text-emerald-700">Código Copiado!</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-3.5 h-3.5 text-orange-600" />
                      <span>Copiar Código Pix</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl text-stone-900 text-center shadow-xl shrink-0 space-y-3 w-full max-w-[260px] flex flex-col items-center">
          <div className="p-2 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-center">
            <Image
              src="/images/pix-qrcode.svg"
              alt="QR Code Pix - Caderno de Delícias"
              width={180}
              height={180}
              unoptimized
              priority
              className="rounded-lg w-[180px] h-[180px] object-contain"
            />
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-bold text-stone-900 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Escaneie com seu banco</span>
            </p>
            <p className="text-[11px] text-stone-500">
              Pix estático • Valor voluntário livre
            </p>
          </div>
        </div>
      </div>

      {/* Círculo decorativo */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
    </div>
  );
}
