import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, Difficulty } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";

const createRecipeSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  description: z.string().optional().default(""),
  prepTimeMinutes: z.number().int().nonnegative().optional().nullable(),
  cookTimeMinutes: z.number().int().nonnegative().optional().nullable(),
  servings: z.number().int().positive().optional().default(4),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.FACIL),
  category: z.string().optional(),
  coverImage: z.string().optional().nullable().or(z.literal("")),
  tips: z.string().optional(),
  ingredients: z.array(
    z.object({
      item: z.string().min(1, "Nome do ingrediente é obrigatório"),
      quantity: z.string().optional().default(""),
      unit: z.string().optional().default(""),
    })
  ).default([]),
  instructions: z.array(
    z.object({
      stepNumber: z.number().int(),
      title: z.string().optional().default(""),
      description: z.string().optional().default(""),
    })
  ).default([]),
  isPublic: z.boolean().default(true),
  isDraft: z.boolean().default(false),
  cadernoId: z.string().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("q");
  const category = url.searchParams.get("categoria");
  const isPublicOnly = url.searchParams.get("public") === "true";
  const status = url.searchParams.get("status");
  const user = await getCurrentUser();

  try {
    const whereClause: Record<string, unknown> = {};

    if (isPublicOnly) {
      whereClause.isPublic = true;
      whereClause.isDraft = false;
    } else if (user) {
      whereClause.userId = user.id;
      if (status === "rascunhos") {
        whereClause.isDraft = true;
      } else if (status === "publicadas") {
        whereClause.isDraft = false;
      }
    } else {
      whereClause.isPublic = true;
      whereClause.isDraft = false;
    }

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const sort = url.searchParams.get("sort");
    const orderBy =
      sort === "recentes"
        ? [{ createdAt: "desc" as const }]
        : [{ viewsCount: "desc" as const }, { createdAt: "desc" as const }];

    const recipes = await prisma.recipe.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
        cadernos: {
          where: {
            caderno: user
              ? { OR: [{ isPublic: true }, { userId: user.id }] }
              : { isPublic: true },
          },
          include: {
            caderno: { select: { id: true, title: true, slug: true, coverColor: true, isPublic: true } },
          },
        },
      },
      orderBy,
    });

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    return NextResponse.json({ error: "Erro ao buscar receitas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Faça login para criar receitas" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createRecipeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Dados da receita inválidos" },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      difficulty,
      category,
      coverImage,
      tips,
      ingredients,
      instructions,
      isPublic,
      isDraft,
      cadernoId,
    } = parsed.data;

    // Regras de publicação vs rascunho:
    // Se for publicação final, exige pelo menos 1 ingrediente e 1 passo
    if (!isDraft) {
      if (ingredients.length === 0) {
        return NextResponse.json(
          { error: "Adicione pelo menos um ingrediente para publicar a receita." },
          { status: 400 }
        );
      }

      const validSteps = instructions.filter(
        (step) => (step.title && step.title.trim() !== "") || (step.description && step.description.trim() !== "")
      );

      if (validSteps.length === 0) {
        return NextResponse.json(
          { error: "Adicione pelo menos um passo de preparo (com título ou instruções) para publicar a receita." },
          { status: 400 }
        );
      }
    }

    // Gerar slug único
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (
      await prisma.recipe.findUnique({
        where: { userId_slug: { userId: user.id, slug } },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const recipe = await prisma.$transaction(async (tx) => {
      const created = await tx.recipe.create({
        data: {
          title,
          slug,
          description,
          prepTimeMinutes,
          cookTimeMinutes,
          servings,
          difficulty,
          category,
          coverImage: coverImage || null,
          tips,
          ingredients,
          instructions,
          isPublic: isDraft ? false : isPublic,
          isDraft,
          userId: user.id,
        },
      });

      // Se um caderno foi indicado, vincula a receita a ele
      if (cadernoId) {
        // Encontrar maior posição atual no caderno
        const lastItem = await tx.cadernoRecipe.findFirst({
          where: { cadernoId },
          orderBy: { position: "desc" },
        });

        const nextPosition = lastItem ? lastItem.position + 1 : 0;

        await tx.cadernoRecipe.create({
          data: {
            cadernoId,
            recipeId: created.id,
            position: nextPosition,
          },
        });
      }

      return created;
    });

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar receita:", error);
    return NextResponse.json({ error: "Erro ao criar receita" }, { status: 500 });
  }
}
