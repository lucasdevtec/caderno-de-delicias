import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido").toLowerCase().trim(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Dados inválidos" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Já existe uma conta cadastrada com este e-mail." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Gerar username único
    const baseUsername = generateSlug(name);
    let username = baseUsername;
    let counter = 1;
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}-${counter}`;
      counter++;
    }

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
      },
    });

    // Cria caderno padrão para o usuário recém-criado
    await prisma.caderno.create({
      data: {
        title: "Meu Primeiro Caderno",
        slug: "meu-primeiro-caderno",
        description: "Meu cantinho especial para guardar receitas e delícias caseiras.",
        coverColor: "#EA580C",
        icon: "chef-hat",
        isPublic: true,
        userId: user.id,
      },
    });

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
    });

    return NextResponse.json(
      { message: "Conta criada com sucesso!", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json(
      { error: "Erro interno ao cadastrar conta. Tente novamente." },
      { status: 500 }
    );
  }
}
