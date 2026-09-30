import { prisma } from "@/lib/prisma";
import { generateSlug } from "./slug";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const REDIRECT_URI = `${NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

export function getGoogleOAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state: state || "google-auth",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export interface GoogleUserProfile {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified: boolean;
}

export async function exchangeGoogleCodeForTokens(code: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Falha ao trocar código do Google: ${errorData}`);
  }

  return response.json();
}

export async function getGoogleUserProfile(accessToken: string): Promise<GoogleUserProfile> {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Falha ao obter perfil do usuário no Google");
  }

  return response.json();
}

export async function findOrCreateGoogleUser(profile: GoogleUserProfile) {
  // 1. Procurar conta existente vinculada
  const existingAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId: profile.sub,
      },
    },
    include: {
      user: true,
    },
  });

  if (existingAccount) {
    return existingAccount.user;
  }

  // 2. Procurar usuário pelo e-mail
  let user = await prisma.user.findUnique({
    where: { email: profile.email },
  });

  if (!user) {
    // Cria novo usuário
    const baseUsername = generateSlug(profile.name || profile.email.split("@")[0]);
    let username = baseUsername;
    let counter = 1;

    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}-${counter}`;
      counter++;
    }

    user = await prisma.user.create({
      data: {
        name: profile.name,
        username,
        email: profile.email,
        image: profile.picture,
        emailVerified: profile.email_verified ? new Date() : null,
      },
    });
  }

  // 3. Vincular Account do Google
  await prisma.account.create({
    data: {
      userId: user.id,
      type: "oauth",
      provider: "google",
      providerAccountId: profile.sub,
    },
  });

  return user;
}
