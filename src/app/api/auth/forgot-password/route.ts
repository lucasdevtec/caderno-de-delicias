import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido").toLowerCase().trim(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Busca usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Prática recomendada de segurança: mesmo que o usuário não exista,
    // retornamos status 200 para evitar enumeração de contas.
    if (!user) {
      return NextResponse.json({
        message: "Se o e-mail informado estiver cadastrado, as instruções para redefinir sua senha foram enviadas.",
      });
    }

    // Gera token seguro e define expiração para 1 hora
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Limpa tokens antigos para este e-mail
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Salva o novo token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Envia o e-mail (ou emite log detalhado em ambiente de dev)
    await sendPasswordResetEmail({
      email,
      token,
    });

    return NextResponse.json({
      message: "Se o e-mail informado estiver cadastrado, as instruções para redefinir sua senha foram enviadas.",
    });
  } catch (error) {
    console.error("Erro na solicitação de recuperação de senha:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar a solicitação." },
      { status: 500 }
    );
  }
}
