import { NextResponse } from "next/server";
import { getGoogleOAuthUrl } from "@/lib/google-auth";

export async function GET() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      {
        error:
          "Google OAuth não configurado. Por favor configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no arquivo .env",
      },
      { status: 500 }
    );
  }

  const url = getGoogleOAuthUrl();
  return NextResponse.redirect(url);
}
