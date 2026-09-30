import path from "node:path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Garante que o .env esteja carregado
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  dotenv.config();
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { Difficulty, Role, PrismaClient, Prisma } from "@prisma/client";
export type * from "@prisma/client";

