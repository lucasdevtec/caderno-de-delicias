"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookMarked, Globe, Lock, ArrowLeft, Loader2, Sparkles } from "lucide-react";

const COLOR_PRESETS = [
  { name: "Laranja Culinário", hex: "#EA580C" },
  { name: "Âmbar Quente", hex: "#D97706" },
  { name: "Rosa Morango", hex: "#E11D48" },
  { name: "Verde Oliva", hex: "#15803D" },
  { name: "Azul Petróleo", hex: "#0369A1" },
  { name: "Chocolate Rústico", hex: "#78350F" },
];

export default function NovoCadernoPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverColor, setCoverColor] = useState("#EA580C");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/cadernos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          coverColor,
          isPublic,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar caderno.");
      }

      router.push(`/cadernos/${data.caderno.slug || data.caderno.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao criar caderno.";
      setErrorMsg(message);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link
        href="/cadernos"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Meus Cadernos</span>
      </Link>

      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Criar Novo Caderno de Receitas
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Escolha o nome, a cor de capa e se o caderno será público para a comunidade ou privado só para você.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Nome do Caderno *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Doces de Domingo, Massas Caseiras, Almoço Rápido..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-stone-50/50"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Descrição (Opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Conte um pouco sobre as delícias que você vai guardar aqui..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-stone-50/50 resize-none"
            />
          </div>

          {/* Seletor de Cores */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Cor da Capa
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setCoverColor(color.hex)}
                  className={`w-9 h-9 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                    coverColor === color.hex ? "scale-110 ring-3 ring-orange-400 ring-offset-2" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Visibilidade (Público vs Privado) */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Privacidade do Caderno
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  isPublic
                    ? "bg-orange-50/60 border-orange-300 ring-1 ring-orange-400"
                    : "bg-white border-stone-200 hover:bg-stone-50"
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="mt-1 text-orange-600"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <span>Público</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 leading-normal">
                    Visível na aba Descobrir. Outros usuários podem ver e copiar o caderno com atribuição ao seu nome.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  !isPublic
                    ? "bg-stone-100/90 border-stone-400 ring-1 ring-stone-400"
                    : "bg-white border-stone-200 hover:bg-stone-50"
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="mt-1 text-stone-600"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
                    <Lock className="w-4 h-4 text-stone-600" />
                    <span>Privado</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 leading-normal">
                    Apenas você pode visualizar este caderno. Ninguém mais poderá acessá-lo ou copiá-lo.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <Link
              href="/cadernos"
              className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Criando Caderno...</span>
                </>
              ) : (
                <span>Criar Caderno</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
