import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const updateCadernoSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres").optional(),
  description: z.string().optional().nullable(),
  coverColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  coverImage: z.string().url().optional().nullable().or(z.literal("")),
  icon: z.string().optional(),
  isPublic: z.boolean().optional(),
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
        user: {
          select: { id: true, name: true, username: true, image: true },
        },
        originalCaderno: {
          select: {
            id: true,
            title: true,
            slug: true,
            isPublic: true,
            user: { select: { id: true, name: true, username: true } },
          },
        },
        recipes: {
          include: {
            recipe: {
              include: {
                user: { select: { id: true, name: true, username: true } },
              },
            },
          },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!caderno) {
      return NextResponse.json({ error: "Caderno não encontrado" }, { status: 404 });
    }

    // Se for privado, apenas o dono pode visualizar
    if (!caderno.isPublic && (!user || user.id !== caderno.userId)) {
      return NextResponse.json(
        { error: "Este caderno é privado e pertence a outro usuário." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      caderno,
      isOwner: user?.id === caderno.userId,
    });
  } catch (error) {
    console.error("Erro ao buscar caderno:", error);
    return NextResponse.json({ error: "Erro ao buscar caderno" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const caderno = await prisma.caderno.findUnique({
      where: { id },
    });

    if (!caderno) {
      return NextResponse.json({ error: "Caderno não encontrado" }, { status: 404 });
    }

    if (caderno.userId !== user.id) {
      return NextResponse.json(
        { error: "Apenas o proprietário pode editar este caderno." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateCadernoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Dados inválidos" },
        { status: 400 }
      );
    }

    const updated = await prisma.caderno.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ caderno: updated });
  } catch (error) {
    console.error("Erro ao atualizar caderno:", error);
    return NextResponse.json({ error: "Erro ao atualizar caderno" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const caderno = await prisma.caderno.findUnique({
      where: { id },
    });

    if (!caderno) {
      return NextResponse.json({ error: "Caderno não encontrado" }, { status: 404 });
    }

    if (caderno.userId !== user.id) {
      return NextResponse.json(
        { error: "Apenas o proprietário pode excluir este caderno." },
        { status: 403 }
      );
    }

    await prisma.caderno.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Caderno excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir caderno:", error);
    return NextResponse.json({ error: "Erro ao excluir caderno" }, { status: 500 });
  }
}
