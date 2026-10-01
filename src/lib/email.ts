/**
 * Utilitário de envio de e-mails do Caderno de Delícias.
 * 
 * Suporta Resend (quando RESEND_API_KEY estiver configurado) ou
 * fallback inteligente em console no ambiente de desenvolvimento/local.
 */

interface SendPasswordResetEmailParams {
  email: string;
  token: string;
}

export async function sendPasswordResetEmail({
  email,
  token,
}: SendPasswordResetEmailParams): Promise<{ success: boolean; error?: string }> {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const resetUrl = `${appUrl}/redefinir-senha?token=${token}`;

  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || "Caderno de Delícias <nao-responda@cadernodedelicias.com.br>";

  // Log formatado para desenvolvimento e depuração local
  console.log("==================================================");
  console.log("🔑 [Auth] RECUPERAÇÃO DE SENHA SOLICITADA");
  console.log(`Para: ${email}`);
  console.log(`Link de redefinição: ${resetUrl}`);
  console.log("Expira em: 1 hora");
  console.log("==================================================");

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [email],
          subject: "Redefinição de senha - Caderno de Delícias",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1c1917; line-height: 1.5;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #ea580c; font-size: 24px; margin-bottom: 8px;">🍳 Caderno de Delícias</h1>
                <p style="color: #78716c; font-size: 14px; margin: 0;">Seu espaço acolhedor para receitas e memórias afetivas.</p>
              </div>

              <div style="background-color: #f5f5f4; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
                <h2 style="font-size: 18px; margin-top: 0; color: #292524;">Recuperação de Senha</h2>
                <p style="font-size: 14px; color: #44403c;">
                  Você solicitou a redefinição de senha para sua conta no Caderno de Delícias associada a <strong>${email}</strong>.
                </p>
                <p style="font-size: 14px; color: #44403c;">
                  Clique no botão abaixo para escolher uma nova senha. O link é válido por <strong>1 hora</strong>:
                </p>
                <div style="text-align: center; margin: 28px 0;">
                  <a href="${resetUrl}" style="background-color: #ea580c; color: #ffffff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                    Redefinir Minha Senha
                  </a>
                </div>
                <p style="font-size: 12px; color: #78716c; margin-bottom: 0;">
                  Se o botão não funcionar, copie e cole o link no seu navegador:<br/>
                  <a href="${resetUrl}" style="color: #ea580c; word-break: break-all;">${resetUrl}</a>
                </p>
              </div>

              <p style="font-size: 12px; color: #a8a29e; text-align: center; margin-top: 32px;">
                Se você não solicitou esta redefinição, ignore este e-mail com segurança. Sua senha atual permanecerá inalterada.<br/>
                &copy; ${new Date().getFullYear()} Caderno de Delícias. Todos os direitos reservados.
              </p>
            </div>
          `,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Erro ao enviar e-mail via Resend:", errorData);
        return { success: false, error: "Falha ao enviar e-mail pelo provedor." };
      }

      return { success: true };
    } catch (err) {
      console.error("Exceção ao chamar serviço de e-mail:", err);
      return { success: false, error: "Exceção no envio de e-mail." };
    }
  }

  // Se não houver RESEND_API_KEY, opera em modo log de desenvolvimento com sucesso
  return { success: true };
}
