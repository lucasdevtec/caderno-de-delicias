"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Coffee, Copy, Check, QrCode, X } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { DEFAULT_PIX_KEY, DEFAULT_PIX_PAYLOAD } from "@/components/PixDonationCard";

export function DonationBanner() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  async function handleCopyKey() {
    const success = await copyToClipboard(DEFAULT_PIX_KEY);
    if (success) {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    }
  }

  async function handleCopyPayload() {
    const success = await copyToClipboard(DEFAULT_PIX_PAYLOAD);
    if (success) {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2500);
    }
  }

  return (
    <>
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

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyKey}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 text-stone-800 border border-stone-200 hover:border-orange-300 text-xs font-semibold shadow-2xs transition-all active:scale-98 cursor-pointer"
              title="Copiar Chave Pix Aleatória"
            >
              {copiedKey ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700 font-bold">Chave Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-orange-600" />
                  <span>Copiar Chave Pix</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Exibir QR Code Pix"
            >
              <QrCode className="w-3.5 h-3.5 text-orange-700" />
              <span>Ver QR Code</span>
            </button>

            <Link
              href="/doar"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Pagar um Cafézinho</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Rápido de QR Code Pix */}
      {showQrModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pt-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold">
                <Heart className="w-3 h-3 fill-orange-500" /> Doação Voluntária
              </div>
              <h3 className="text-lg font-black text-stone-900">
                Pague um Cafézinho no Pix
              </h3>
              <p className="text-xs text-stone-500">
                Escaneie o QR Code com o aplicativo do seu banco ou copie a chave abaixo.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 inline-block mx-auto">
              <Image
                src="/images/pix-qrcode.svg"
                alt="QR Code Pix"
                width={180}
                height={180}
                unoptimized
                priority
                className="w-[180px] h-[180px] object-contain rounded-lg"
              />
            </div>

            {/* Ações de cópia dentro do modal */}
            <div className="space-y-2 pt-1 text-left">
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-stone-700 truncate select-all">
                  {DEFAULT_PIX_KEY}
                </span>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                >
                  {copiedKey ? "Copiada!" : "Copiar Chave"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyPayload}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5 text-stone-600" />
                <span>{copiedPayload ? "Código Pix Copiado!" : "Copiar Pix Copia e Cola"}</span>
              </button>
            </div>

            <div className="pt-1">
              <Link
                href="/doar"
                onClick={() => setShowQrModal(false)}
                className="text-xs text-orange-600 hover:underline font-semibold"
              >
                Ver metas do servidor e outras formas de apoio →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

