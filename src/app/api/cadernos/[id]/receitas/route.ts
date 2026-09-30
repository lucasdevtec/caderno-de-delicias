import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const addRecipeSchema = z.object({
  recipeId: z.string().min(1, "ID da receita é obrigatório"),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();

  try {
    const caderno = await prisma.caderno.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        recipes: {
          include: {
            recipe: true,
          },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!caderno) {
      return NextResponse.json({ error: "Caderno não encontrado." }, { status: 404 });
    }

    if (!caderno.isPublic && (!user || user.id !== caderno.userId)) {
      return NextResponse.json(
        { error: "Este caderno é privado." },
        { status: 403 }
      );
    }

    return NextResponse.json({ recipes: caderno.recipes });
  } catch (error) {
    console.error("Erro ao buscar receitas do caderno:", error);
    return NextResponse.json(
      { error: "Erro ao buscar receitas do caderno." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Faça login para adicionar receitas ao caderno." },
      { status: 401 }
    );
  }

  try {
    const caderno = await prisma.caderno.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!caderno) {
      return NextResponse.json({ error: "Caderno não encontrado." }, { status: 404 });
    }

    if (caderno.userId !== user.id) {
      return NextResponse.json(
        { error: "Você só pode adicionar receitas aos seus próprios cadernos." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = addRecipeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const { recipeId } = parsed.data;

    // Verificar se a receita existe
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Receita não encontrada." }, { status: 404 });
    }

    // Verificar se a receita já está no caderno
    const existing = await prisma.cadernoRecipe.findUnique({
      where: {
        cadernoId_recipeId: {
          cadernoId: caderno.id,
          recipeId: recipe.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Esta receita já está presente neste caderno.", alreadyExists: true },
        { status: 200 }
      );
    }

    // Identificar a próxima posição na sequência
    const lastItem = await prisma.cadernoRecipe.findFirst({
      where: { cadernoId: caderno.id },
      orderBy: { position: "desc" },
    });

    const nextPosition = lastItem ? lastItem.position + 1 : 0;

    const created = await prisma.cadernoRecipe.create({
      data: {
        cadernoId: caderno.id,
        recipeId: recipe.id,
        position: nextPosition,
      },
    });

    return NextResponse.json(
      {
        message: `Receita "${recipe.title}" adicionada com sucesso ao caderno "${caderno.title}".`,
        cadernoRecipe: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao adicionar receita ao caderno:", error);
    return NextResponse.json(
      { error: "Erro interno ao adicionar receita ao caderno." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Faça login para gerenciar este caderno." },
      { status: 401 }
    );
  }

  try {
    const caderno = await prisma.caderno.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!caderno) {
      return NextResponse.json({ error: "Caderno não encontrado." }, { status: 404 });
    }

    if (caderno.userId !== user.id) {
      return NextResponse.json(
        { error: "Você só pode remover receitas dos seus próprios cadernos." },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    let recipeId = url.searchParams.get("recipeId");

    if (!recipeId) {
      try {
        const body = await req.json();
        recipeId = body.recipeId;
      } catch {
        // Ignora erro de JSON vazio
      }
    }

    if (!recipeId) {
      return NextResponse.json(
        { error: "ID da receita a ser removida não informado." },
        { status: 400 }
      );
    }

    const deleted = await prisma.cadernoRecipe.deleteMany({
      where: {
        cadernoId: caderno.id,
        recipeId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Esta receita não foi encontrada neste caderno." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Receita removida deste caderno com sucesso.",
      cadernoId: caderno.id,
      recipeId,
    });
  } catch (error) {
    console.error("Erro ao remover receita do caderno:", error);
    return NextResponse.json(
      { error: "Erro interno ao remover receita do caderno." },
      { status: 500 }
    );
  }
}
