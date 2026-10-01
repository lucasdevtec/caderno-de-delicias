import path from "path";
import fs from "fs";

/**
 * Retorna o diretório de uploads do sistema de forma resiliente.
 * Prioridade:
 * 1. Variável de ambiente UPLOADS_DIR (se definida)
 * 2. Diretório /app/uploads (montagem padrão em container Docker)
 * 3. Diretório /app/upload (singular em container Docker)
 * 4. Diretório ./upload na raiz do projeto (se existir)
 * 5. Diretório ./uploads na raiz do projeto (padrão local)
 */
export function getUploadsDir(): string {
  if (process.env.UPLOADS_DIR) {
    return path.resolve(process.env.UPLOADS_DIR);
  }

  const dockerUploads = path.resolve("/app/uploads");
  if (fs.existsSync(dockerUploads)) {
    return dockerUploads;
  }

  const dockerUpload = path.resolve("/app/upload");
  if (fs.existsSync(dockerUpload)) {
    return dockerUpload;
  }

  const localUpload = path.resolve(process.cwd(), "upload");
  if (fs.existsSync(localUpload)) {
    return localUpload;
  }

  return path.resolve(process.cwd(), "uploads");
}

/**
 * Garante que o diretório de uploads exista antes de salvar arquivos.
 */
export async function ensureUploadsDir(): Promise<string> {
  const dir = getUploadsDir();
  await fs.promises.mkdir(dir, { recursive: true });
  return dir;
}
