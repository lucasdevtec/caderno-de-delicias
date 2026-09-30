import { NextResponse } from "next/server";
import {
  exchangeGoogleCodeForTokens,
  getGoogleUserProfile,
  findOrCreateGoogleUser,
} from "@/lib/google-auth";
import { setSessionCookie } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error || !code) {
    console.error("Erro no retorno do Google OAuth:", error);
    return NextResponse.redirect(`${appUrl}/login?error=google_cancelled`);
  }

  try {
    const tokens = await exchangeGoogleCodeForTokens(code);
    const profile = await getGoogleUserProfile(tokens.access_token);
    const user = await findOrCreateGoogleUser(profile);

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
    });

    return NextResponse.redirect(`${appUrl}/cadernos`);
  } catch (err) {
    console.error("Erro ao autenticar com Google:", err);
    return NextResponse.redirect(`${appUrl}/login?error=google_auth_failed`);
  }
}
