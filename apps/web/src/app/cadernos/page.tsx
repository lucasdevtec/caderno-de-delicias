import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@caderno/database";
import { getCurrentUser } from "@/lib/auth";
import { CadernoCard } from "@/components/CadernoCard";
import { BookMarked, Plus, GitFork, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MeusCadernosPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?returnUrl=/cadernos");
  }

  const cadernos = await prisma.caderno.findMany({
    where: { userId: user.id },
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
      originalCaderno: {
        select: {
          id: true,
          title: true,
          slug: true,
          user: { select: { name: true, username: true } },
        },
      },
      recipes: {
        include: {
          recipe: {
            select: { id: true, title: true, coverImage: true, difficulty: true },
          },
        },
        orderBy: { position: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const cadernosProprios = cadernos.filter((c) => !c.originalCadernoId);
  const cadernosCopiados = cadernos.filter((c) => Boolean(c.originalCadernoId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Meus Cadernos de Receitas
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Organize seus pratos por ocasião, tema ou preferência.
          </p>
        </div>

        <Link
          href="/cadernos/novo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Caderno</span>
        </Link>
      </div>

      {/* Cadernos Originais */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-bold text-stone-900">
            Cadernos Criados por Você ({cadernosProprios.length})
          </h2>
        </div>

        {cadernosProprios.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-stone-300">
            <p className="text-stone-600 text-sm">
              Você ainda não criou nenhum caderno original.
            </p>
            <Link
              href="/cadernos/novo"
              className="inline-block mt-3 text-sm text-orange-600 hover:text-orange-700 font-semibold"
            >
              + Criar meu primeiro caderno
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cadernosProprios.map((caderno) => (
              <CadernoCard
                key={caderno.id}
                caderno={caderno}
                currentUserId={user.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Cadernos Copiados / Inspirados (Fork Attribution) */}
      <section className="space-y-4 pt-6 border-t border-stone-200">
        <div className="flex items-center gap-2">
          <GitFork className="w-5 h-5 text-amber-600 rotate-180" />
          <h2 className="text-xl font-bold text-stone-900">
            Cadernos Copiados e Inspirados ({cadernosCopiados.length})
          </h2>
        </div>

        {cadernosCopiados.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-600 text-sm">
              Você ainda não copiou nenhum caderno público de outros usuários.
            </p>
            <Link
              href="/descobrir"
              className="inline-block mt-3 text-sm text-orange-600 hover:text-orange-700 font-semibold"
            >
              Explorar cadernos públicos para copiar →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cadernosCopiados.map((caderno) => (
              <CadernoCard
                key={caderno.id}
                caderno={caderno}
                currentUserId={user.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
