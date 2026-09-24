import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

function getResolvedDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  let current = process.cwd();
  while (current && current !== path.dirname(current)) {
    const candidate = path.join(current, "packages", "database", "prisma", "dev.db");
    if (fs.existsSync(candidate)) {
      return `file:${candidate.replace(/\\/g, "/")}`;
    }
    const candidateDirect = path.join(current, "prisma", "dev.db");
    if (fs.existsSync(candidateDirect)) {
      return `file:${candidateDirect.replace(/\\/g, "/")}`;
    }
    current = path.dirname(current);
  }

  return envUrl;
}

const resolvedUrl = getResolvedDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    ...(resolvedUrl ? { datasources: { db: { url: resolvedUrl } } } : {}),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "@prisma/client";

