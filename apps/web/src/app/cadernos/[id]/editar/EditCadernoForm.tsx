"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Globe, Lock, Trash2 } from "lucide-react";

interface EditCadernoFormProps {
  cadernoId: string;
  initialTitle: string;
  initialDescription: string;
  initialColor: string;
  initialIsPublic: boolean;
}

const COLOR_PRESETS = [
  { name: "Laranja Culinário", hex: "#EA580C" },
  { name: "Âmbar Quente", hex: "#D97706" },
  { name: "Rosa Morango", hex: "#E11D48" },
  { name: "Verde Oliva", hex: "#15803D" },
  { name: "Azul Petróleo", hex: "#0369A1" },
  { name: "Chocolate Rústico", hex: "#78350F" },
];

export function EditCadernoForm({
  cadernoId,
  initialTitle,
  initialDescription,
  initialColor,
  initialIsPublic,
}: EditCadernoFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [coverColor, setCoverColor] = useState(initialColor);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/cadernos/${cadernoId}`, {
        method: "PUT",
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
        throw new Error(data.error || "Erro ao salvar alterações.");
      }

      setSuccessMsg("Dados atualizados com sucesso!");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao salvar.";
      setErrorMsg(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este caderno? As receitas vinculadas não serão apagadas da sua conta.")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/cadernos/${cadernoId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao excluir.");
      }

      router.push("/cadernos");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao excluir.";
      alert(message);
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 text-xs">
      {errorMsg && (
        <div className="p-2.5 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
          {successMsg}
        </div>
      )}

      <div className="space-y-1">
        <label className="font-bold uppercase tracking-wider text-stone-700">
          Título do Caderno
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-xs bg-stone-50"
        />
      </div>

      <div className="space-y-1">
        <label className="font-bold uppercase tracking-wider text-stone-700">
          Descrição
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-xs bg-stone-50 resize-none"
        />
      </div>

      <div className="space-y-1">
        <label className="font-bold uppercase tracking-wider text-stone-700">
          Cor da Capa
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color.hex}
              type="button"
              onClick={() => setCoverColor(color.hex)}
              className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                coverColor === color.hex ? "scale-110 ring-2 ring-orange-500" : ""
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <label className="font-bold uppercase tracking-wider text-stone-700">
          Privacidade
        </label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="isPublic"
              checked={isPublic}
              onChange={() => setIsPublic(true)}
              className="text-orange-600"
            />
            <span className="flex items-center gap-1 font-semibold text-stone-800">
              <Globe className="w-3.5 h-3.5 text-orange-600" /> Público
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="isPublic"
              checked={!isPublic}
              onChange={() => setIsPublic(false)}
              className="text-stone-600"
            />
            <span className="flex items-center gap-1 font-semibold text-stone-800">
              <Lock className="w-3.5 h-3.5 text-stone-600" /> Privado
            </span>
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          <span>Salvar Informações</span>
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="w-full flex items-center justify-center gap-1 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Excluir Caderno</span>
        </button>
      </div>
    </form>
  );
}
