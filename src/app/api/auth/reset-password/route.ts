import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token de recuperação inválido ou ausente."),
  password: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    // Busca o token de verificação no banco
    const verificationRecord = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { error: "Link de recuperação inválido ou não encontrado. Por favor, solicite uma nova redefinição." },
        { status: 400 }
      );
    }

    // Verifica se o token expirou
    if (verificationRecord.expires < new Date()) {
      // Remove token expirado
      await prisma.verificationToken.delete({
        where: { token },
      }).catch(() => null);

      return NextResponse.json(
        { error: "Este link de recuperação expirou. Por favor, solicite uma nova redefinição de senha." },
        { status: 400 }
      );
    }

    // Identificador armazena o e-mail do usuário
    const email = verificationRecord.identifier;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário associado ao token não encontrado." },
        { status: 404 }
      );
    }

    // Gera o novo hash seguro da senha
    const newPasswordHash = await hashPassword(password);

    // Atualiza a senha do usuário
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    // Invalida todos os tokens de recuperação deste usuário
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    return NextResponse.json({
      message: "Senha redefinida com sucesso! Você já pode entrar com sua nova senha.",
    });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao redefinir a senha." },
      { status: 500 }
    );
  }
}
