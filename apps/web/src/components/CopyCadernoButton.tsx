"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Loader2, GitFork } from "lucide-react";

interface CopyCadernoButtonProps {
  cadernoId: string;
  cadernoTitle: string;
  isOwner?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "minimal";
}

export function CopyCadernoButton({
  cadernoId,
  cadernoTitle,
  isOwner = false,
  className = "",
  variant = "primary",
}: CopyCadernoButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleCopy() {
    if (loading) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/cadernos/${cadernoId}/copiar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (res.status === 401) {
        // Redireciona para o login guardando o destino
        router.push(`/login?returnUrl=/cadernos/${cadernoId}`);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Não foi possível copiar o caderno.");
      }

      setCopied(true);
      setTimeout(() => {
        if (data.caderno?.id) {
          router.push(`/cadernos/${data.caderno.id}`);
        } else {
          router.push("/cadernos");
        }
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao copiar caderno.";
      setErrorMsg(message);
      setLoading(false);
    }
  }

  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium transition-all rounded-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm";

  const variants = {
    primary:
      "bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 shadow-sm hover:shadow-md active:scale-98",
    secondary:
      "bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 px-3.5 py-2",
    minimal: "text-stone-600 hover:text-orange-600 hover:bg-orange-50/60 p-2",
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleCopy}
        disabled={loading || copied}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        title={isOwner ? "Duplicar este caderno" : "Copiar para meus cadernos"}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>Copiando receitas...</span>
          </>
        ) : copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Adicionado aos seus cadernos!</span>
          </>
        ) : (
          <>
            <GitFork className="w-4 h-4 rotate-180" />
            <span>{isOwner ? "Duplicar Caderno" : "Copiar para Meus Cadernos"}</span>
          </>
        )}
      </button>

      {errorMsg && (
        <span className="text-xs text-rose-600 font-medium mt-1">
          {errorMsg}
        </span>
      )}
    </div>
  );
}
