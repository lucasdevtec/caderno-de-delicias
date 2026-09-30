import { NextResponse } from "next/server";
import { prisma } from "@caderno/database";
import { getCurrentUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();

  try {
    const recipe = await prisma.recipe.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        user: { select: { id: true, name: true, username: true, image: true, bio: true } },
        cadernos: {
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

    if (!recipe.isPublic && (!user || user.id !== recipe.userId)) {
      return NextResponse.json(
        { error: "Esta receita é privada do autor." },
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
    const recipe = await prisma.recipe.findUnique({
      where: { id },
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

    const body = await req.json();

    const updated = await prisma.recipe.update({
      where: { id },
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
        ingredients: body.ingredients,
        instructions: body.instructions,
        isPublic: body.isPublic,
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
    const recipe = await prisma.recipe.findUnique({
      where: { id },
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
      where: { id },
    });

    return NextResponse.json({ message: "Receita excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir receita:", error);
    return NextResponse.json({ error: "Erro ao excluir receita" }, { status: 500 });
  }
}
