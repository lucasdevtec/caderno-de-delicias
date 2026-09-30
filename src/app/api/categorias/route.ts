import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const DEFAULT_RECIPE_CATEGORIES = [
  "Doces & Sobremesas",
  "Bolos & Tortas",
  "Massas & Risotos",
  "Pães & Salgados",
  "Carnes & Aves",
  "Peixes & Frutos do Mar",
  "Pratos Vegetarianos & Veganos",
  "Sopas & Caldos",
  "Saladas & Molhos",
  "Lanches & Petiscos",
  "Café da Manhã & Brunch",
  "Bebidas & Drinks",
  "Molhos & Temperos",
  "Fitness & Saudável",
];

export async function GET() {
  try {
    const dbCategories = await prisma.recipe.findMany({
      where: {
        category: {
          not: null,
        },
      },
      select: { category: true },
      distinct: ["category"],
    });

    const set = new Set<string>(DEFAULT_RECIPE_CATEGORIES);
    for (const item of dbCategories) {
      if (item.category && item.category.trim()) {
        set.add(item.category.trim());
      }
    }

    const categories = Array.from(set).sort((a, b) =>
      a.localeCompare(b, "pt-BR", { sensitivity: "base" })
    );

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json({ categories: DEFAULT_RECIPE_CATEGORIES });
  }
}
