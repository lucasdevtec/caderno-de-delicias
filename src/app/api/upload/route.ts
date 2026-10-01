import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { requireAuth } from "@/lib/auth";
import { ensureUploadsDir } from "@/lib/storage";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const uploadsDir = await ensureUploadsDir();
    const contentType = req.headers.get("content-type") || "";

    let fileBuffer: Buffer;
    let extension = "jpg";

    if (contentType.includes("application/json")) {
      // Upload via Base64 (ex: comprimido pelo canvas do navegador)
      const body = await req.json();
      const base64Data = body.base64;
      const originalName = body.filename || "imagem.jpg";

      if (!base64Data || typeof base64Data !== "string") {
        return NextResponse.json(
          { error: "Dados de imagem em base64 não fornecidos." },
          { status: 400 }
        );
      }

      // Extrai mime type e buffer
      const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mime = matches[1];
        if (mime.includes("png")) extension = "png";
        else if (mime.includes("webp")) extension = "webp";
        else if (mime.includes("gif")) extension = "gif";
        else extension = "jpg";

        fileBuffer = Buffer.from(matches[2], "base64");
      } else {
        // Base64 direto sem prefixo data URL
        const ext = path.extname(originalName).replace(".", "").toLowerCase();
        if (ALLOWED_EXTENSIONS.includes(ext)) {
          extension = ext;
        }
        fileBuffer = Buffer.from(base64Data, "base64");
      }
    } else if (contentType.includes("multipart/form-data")) {
      // Upload via multipart form
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { error: "Nenhum arquivo enviado no campo 'file'." },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "O arquivo excede o limite máximo de 10MB." },
          { status: 400 }
        );
      }

      const ext = path.extname(file.name).replace(".", "").toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          { error: `Formato de arquivo não suportado (.${ext}). Use JPG, PNG ou WebP.` },
          { status: 400 }
        );
      }

      extension = ext;
      const bytes = await file.arrayBuffer();
      fileBuffer = Buffer.from(bytes);
    } else {
      return NextResponse.json(
        { error: "Content-Type não suportado. Envie multipart/form-data ou JSON com base64." },
        { status: 415 }
      );
    }

    if (fileBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "A imagem processada excede o limite de 10MB." },
        { status: 400 }
      );
    }

    // Gera nome único e seguro para o arquivo
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
    const filename = `receita-${uniqueSuffix}.${extension}`;
    const destPath = path.join(uploadsDir, filename);

    // Grava o arquivo no volume de uploads
    await fs.promises.writeFile(destPath, fileBuffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
      size: fileBuffer.length,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Faça login para enviar imagens." }, { status: 401 });
    }
    console.error("Erro no upload de imagem:", error);
    return NextResponse.json(
      { error: "Falha ao salvar a imagem no servidor." },
      { status: 500 }
    );
  }
}
