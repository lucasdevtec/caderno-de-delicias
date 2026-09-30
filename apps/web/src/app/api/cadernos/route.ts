import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@caderno/database";
import { getCurrentUser } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";

const createCadernoSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  coverColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida").optional().default("#EA580C"),
  coverImage: z.string().url().optional().or(z.literal("")),
  icon: z.string().optional().default("chef-hat"),
  isPublic: z.boolean().default(true),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isPublicOnly = url.searchParams.get("public") === "true";
  const user = await getCurrentUser();

  try {
    if (isPublicOnly) {
      const cadernos = await prisma.caderno.findMany({
        where: { isPublic: true },
        include: {
          user: {
            select: { id: true, name: true, username: true, image: true },
          },
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
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ cadernos });
    }

    // Listar cadernos do usuário logado
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const cadernos = await prisma.caderno.findMany({
      where: { userId: user.id },
      include: {
        user: {
          select: { id: true, name: true, username: true, image: true },
        },
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ cadernos });
  } catch (error) {
    console.error("Erro ao listar cadernos:", error);
    return NextResponse.json({ error: "Erro ao buscar cadernos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Faça login para criar um caderno" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createCadernoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Dados inválidos" },
        { status: 400 }
      );
    }

    const { title, description, coverColor, coverImage, icon, isPublic } = parsed.data;

    // Gerar slug único para o usuário
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.caderno.findUnique({
      where: { userId_slug: { userId: user.id, slug } },
    })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const caderno = await prisma.caderno.create({
      data: {
        title,
        slug,
        description,
        coverColor,
        coverImage: coverImage || null,
        icon,
        isPublic,
        userId: user.id,
      },
      include: {
        user: { select: { name: true, username: true } },
      },
    });

    return NextResponse.json({ caderno }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar caderno:", error);
    return NextResponse.json({ error: "Erro ao criar caderno" }, { status: 500 });
  }
}
