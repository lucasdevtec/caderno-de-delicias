import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@caderno/database";
import { getCurrentUser } from "@/lib/auth";

const reorderSchema = z.object({
  recipeOrders: z.array(
    z.object({
      recipeId: z.string(),
      position: z.number().int().min(0),
    })
  ),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const caderno = await prisma.caderno.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!caderno) {
      return NextResponse.json({ error: "Caderno não encontrado" }, { status: 404 });
    }

    if (caderno.userId !== user.id) {
      return NextResponse.json(
        { error: "Apenas o proprietário pode reordenar as receitas deste caderno." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = reorderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Formato de reordenação inválido." },
        { status: 400 }
      );
    }

    const { recipeOrders } = parsed.data;

    // Atualizar as posições em lote dentro de uma transação
    await prisma.$transaction(
      recipeOrders.map((item) =>
        prisma.cadernoRecipe.updateMany({
          where: {
            cadernoId: caderno.id,
            recipeId: item.recipeId,
          },
          data: {
            position: item.position,
          },
        })
      )
    );

    return NextResponse.json({
      message: "Ordem das receitas atualizada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao reordenar receitas:", error);
    return NextResponse.json(
      { error: "Erro interno ao reordenar receitas." },
      { status: 500 }
    );
  }
}
