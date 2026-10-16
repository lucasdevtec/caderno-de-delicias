import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { buildEntityLookupOr } from "@/lib/slug";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();

  try {
    const recipe = await prisma.recipe.findFirst({
      where: {
        OR: buildEntityLookupOr(id),
      },
      orderBy: user ? [{ createdAt: "desc" }] : undefined,
      include: {
        user: { select: { id: true, name: true, username: true, image: true, bio: true } },
        cadernos: {
          where: {
            caderno: user
              ? { OR: [{ isPublic: true }, { userId: user.id }] }
              : { isPublic: true },
          },
          include: {
            caderno: {
              select: {
                id: true,
                title: true,
                slug: true,
                coverColor: true,
                isPublic: true,
                originalCadernoId: true,
                originalAuthorName: true,
              },
            },
          },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Receita não encontrada" }, { status: 404 });
    }

    if ((recipe.isDraft || !recipe.isPublic) && (!user || user.id !== recipe.userId)) {
      return NextResponse.json(
        { error: "Esta receita é privada ou um rascunho do autor." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      recipe,
      isAuthor: user?.id === recipe.userId,
    });
  } catch (error) {
    console.error("Erro ao buscar receita:", error);
    return NextResponse.json({ error: "Erro ao buscar receita" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const recipe = await prisma.recipe.findFirst({
      where: {
        OR: buildEntityLookupOr(id),
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Receita não encontrada" }, { status: 404 });
    }

    if (recipe.userId !== user.id) {
      return NextResponse.json(
        { error: "Apenas o autor pode editar esta receita." },
        { status: 403 }
      );
    }

    if (!recipe.isDraft) {
      return NextResponse.json(
        { error: "Apenas receitas em rascunho podem ser editadas. Receitas já publicadas (públicas ou privadas) só podem ser excluídas." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const isDraft = typeof body.isDraft === "boolean" ? body.isDraft : recipe.isDraft;

    const rawIngredients = Array.isArray(body.ingredients) ? body.ingredients : [];
    const rawInstructions = Array.isArray(body.instructions) ? body.instructions : [];

    const cleanIngredients = rawIngredients.filter(
      (i: { item?: string }) => i && typeof i.item === "string" && i.item.trim() !== ""
    );
    const cleanInstructions = rawInstructions
      .filter(
        (i: { title?: string; description?: string }) =>
          i &&
          ((typeof i.title === "string" && i.title.trim() !== "") ||
            (typeof i.description === "string" && i.description.trim() !== ""))
      )
      .map((item: Record<string, unknown>, idx: number) => ({ ...item, stepNumber: idx + 1 }));

    if (!isDraft) {
      if (cleanIngredients.length === 0) {
        return NextResponse.json(
          { error: "Adicione pelo menos um ingrediente para publicar a receita." },
          { status: 400 }
        );
      }
      if (cleanInstructions.length === 0) {
        return NextResponse.json(
          { error: "Adicione pelo menos um passo de preparo (com título ou instruções) para publicar a receita." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.recipe.update({
      where: { id: recipe.id },
      data: {
        title: body.title,
        description: body.description,
        prepTimeMinutes: body.prepTimeMinutes,
        cookTimeMinutes: body.cookTimeMinutes,
        servings: body.servings,
        difficulty: body.difficulty,
        category: body.category,
        coverImage: body.coverImage || null,
        tips: body.tips,
        ingredients: cleanIngredients,
        instructions: cleanInstructions,
        isPublic: isDraft ? false : Boolean(body.isPublic),
        isDraft,
      },
    });

    return NextResponse.json({ recipe: updated });
  } catch (error) {
    console.error("Erro ao atualizar receita:", error);
    return NextResponse.json({ error: "Erro ao atualizar receita" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const recipe = await prisma.recipe.findFirst({
      where: {
        OR: buildEntityLookupOr(id),
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Receita não encontrada" }, { status: 404 });
    }

    if (recipe.userId !== user.id) {
      return NextResponse.json(
        { error: "Apenas o autor pode excluir esta receita." },
        { status: 403 }
      );
    }

    await prisma.recipe.delete({
      where: { id: recipe.id },
    });

    return NextResponse.json({ message: "Receita excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir receita:", error);
    return NextResponse.json({ error: "Erro ao excluir receita" }, { status: 500 });
  }
}
