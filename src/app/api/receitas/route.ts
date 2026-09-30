import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, Difficulty } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";

const createRecipeSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  prepTimeMinutes: z.number().int().nonnegative().optional().nullable(),
  cookTimeMinutes: z.number().int().nonnegative().optional().nullable(),
  servings: z.number().int().positive().optional().default(4),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.FACIL),
  category: z.string().optional(),
  coverImage: z.string().optional().nullable().or(z.literal("")),
  tips: z.string().optional(),
  ingredients: z.array(
    z.object({
      item: z.string().min(1),
      quantity: z.string().min(1),
      unit: z.string().optional(),
    })
  ),
  instructions: z.array(
    z.object({
      stepNumber: z.number().int(),
      title: z.string().optional(),
      description: z.string().min(1),
    })
  ),
  isPublic: z.boolean().default(true),
  cadernoId: z.string().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("q");
  const category = url.searchParams.get("categoria");
  const isPublicOnly = url.searchParams.get("public") === "true";
  const user = await getCurrentUser();

  try {
    const whereClause: Record<string, unknown> = {};

    if (isPublicOnly) {
      whereClause.isPublic = true;
    } else if (user) {
      whereClause.userId = user.id;
    } else {
      whereClause.isPublic = true;
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

    const recipes = await prisma.recipe.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
        cadernos: {
          include: {
            caderno: { select: { id: true, title: true, slug: true, coverColor: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
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
      cadernoId,
    } = parsed.data;

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
          isPublic,
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
