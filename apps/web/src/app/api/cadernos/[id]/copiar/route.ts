import { NextResponse } from "next/server";
import { prisma } from "@caderno/database";
import { getCurrentUser } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Faça login para copiar este caderno para sua conta." },
      { status: 401 }
    );
  }

  try {
    // 1. Localizar o caderno de origem
    const sourceCaderno = await prisma.caderno.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        user: { select: { id: true, name: true, username: true } },
        recipes: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!sourceCaderno) {
      return NextResponse.json(
        { error: "Caderno original não encontrado." },
        { status: 404 }
      );
    }

    // 2. REGRA MANDATÓRIA: O caderno de origem TEM QUE SER PÚBLICO
    if (!sourceCaderno.isPublic) {
      return NextResponse.json(
        {
          error:
            "Apenas cadernos públicos podem ser copiados. Este caderno foi marcado como privado pelo autor.",
        },
        { status: 403 }
      );
    }

    // Se o usuário já é o dono, pode duplicar, mas avisamos ou geramos uma cópia clara
    const isOwner = sourceCaderno.userId === user.id;

    // 3. Ler dados opcionais do corpo da requisição (ex: customizar título ou privacidade inicial)
    let customTitle = sourceCaderno.title;
    let customIsPublic = false; // Por padrão, cópias iniciam privadas para o usuário organizar

    try {
      const body = await req.json();
      if (body.title && typeof body.title === "string") {
        customTitle = body.title.trim();
      }
      if (typeof body.isPublic === "boolean") {
        customIsPublic = body.isPublic;
      }
    } catch {
      // Body vazio ou opcional
    }

    if (isOwner && !customTitle.includes("(Cópia)")) {
      customTitle = `${customTitle} (Cópia)`;
    }

    // 4. Gerar slug único para o usuário de destino
    const baseSlug = generateSlug(customTitle);
    let newSlug = baseSlug;
    let counter = 1;

    while (
      await prisma.caderno.findUnique({
        where: { userId_slug: { userId: user.id, slug: newSlug } },
      })
    ) {
      newSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 5. Criar o caderno cópia COM ATRIBUIÇÃO PERMANENTE AO CADERNO ORIGINAL
    const originalAuthorDisplay =
      sourceCaderno.user.name || `@${sourceCaderno.user.username}` || "Chef da Comunidade";

    const novoCaderno = await prisma.$transaction(async (tx) => {
      const criado = await tx.caderno.create({
        data: {
          title: customTitle,
          slug: newSlug,
          description: sourceCaderno.description,
          coverColor: sourceCaderno.coverColor,
          coverImage: sourceCaderno.coverImage,
          icon: sourceCaderno.icon,
          isPublic: customIsPublic,
          userId: user.id,
          // Atribuição da origem pública:
          originalCadernoId: sourceCaderno.id,
          originalAuthorName: originalAuthorDisplay,
          copiedAt: new Date(),
        },
      });

      // 6. Copiar todas as relações de receitas mantendo rigorosamente a ordem (position)
      if (sourceCaderno.recipes.length > 0) {
        await tx.cadernoRecipe.createMany({
          data: sourceCaderno.recipes.map((cr) => ({
            cadernoId: criado.id,
            recipeId: cr.recipeId,
            position: cr.position,
          })),
        });
      }

      return criado;
    });

    return NextResponse.json(
      {
        message: "Caderno copiado com sucesso com atribuição à origem pública mantida!",
        caderno: novoCaderno,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao copiar caderno:", error);
    return NextResponse.json(
      { error: "Erro interno ao copiar caderno. Tente novamente." },
      { status: 500 }
    );
  }
}
