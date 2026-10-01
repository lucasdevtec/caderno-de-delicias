import crypto from "crypto";

/**
 * Gera a URL do Gravatar para o e-mail informado.
 * Se o e-mail não tiver uma foto cadastrada no Gravatar, o parâmetro d=identicon
 * gera automaticamente um avatar geométrico colorido exclusivo baseado no hash do e-mail.
 */
export function getGravatarUrl(email?: string | null, size = 120): string {
  if (!email || !email.trim()) {
    return `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=${size}&d=mp`;
  }

  const cleanEmail = email.trim().toLowerCase();
  const hash = crypto.createHash("md5").update(cleanEmail).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

/**
 * Retorna a foto do usuário se existir, ou o Gravatar com fallback automático.
 */
export function getUserAvatarUrl(
  user?: { image?: string | null; email?: string | null; name?: string | null } | null,
  size = 120
): string {
  if (user?.image && user.image.trim()) {
    return user.image.trim();
  }
  return getGravatarUrl(user?.email, size);
}
