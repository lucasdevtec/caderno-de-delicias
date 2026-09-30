import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { RecipeOrderManager } from "@/components/RecipeOrderManager";
import { ArrowLeft, ArrowUpDown, Trash2, Globe, Lock } from "lucide-react";
import { EditCadernoForm } from "./EditCadernoForm";

export const dynamic = "force-dynamic";

interface EditCadernoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCadernoPage({ params }: EditCadernoPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?returnUrl=/cadernos/${id}/editar`);
  }

  const caderno = await prisma.caderno.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: {
      recipes: {
        include: {
          recipe: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverImage: true,
              category: true,
            },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!caderno) {
    notFound();
  }

  if (caderno.userId !== user.id) {
    redirect(`/cadernos/${caderno.id}`);
  }

  const initialRecipesForOrdering = caderno.recipes.map((cr) => ({
    id: cr.recipe.id,
    title: cr.recipe.title,
    slug: cr.recipe.slug,
    coverImage: cr.recipe.coverImage,
    category: cr.recipe.category,
    position: cr.position,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <Link
        href={`/cadernos/${caderno.slug || caderno.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para o Caderno</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">
          Editar Caderno & Ordem das Receitas
        </h1>
        <p className="text-stone-500 text-sm">
          Ajuste as informações básicas e reorganize a sequência exata em que suas receitas aparecem.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Formulário de Configuração Básica */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Configurações</h2>
          <EditCadernoForm
            cadernoId={caderno.id}
            initialTitle={caderno.title}
            initialDescription={caderno.description || ""}
            initialColor={caderno.coverColor || "#EA580C"}
            initialIsPublic={caderno.isPublic}
          />
        </div>

        {/* Gerenciador de Ordem das Receitas */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs">
          <RecipeOrderManager
            cadernoId={caderno.id}
            initialRecipes={initialRecipesForOrdering}
          />
        </div>
      </div>
    </div>
  );
}
