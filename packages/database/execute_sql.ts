import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("ERRO: DATABASE_URL ou DIRECT_URL não encontrada no ambiente.");
  process.exit(1);
}

console.log("Conectando ao banco de dados Supabase...");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inDollarQuote = false;

  const lines = sql.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    // Pula linhas de comentário completo se não estiver dentro de dollar quote
    if (!inDollarQuote && (trimmed.startsWith("--") || trimmed.length === 0)) {
      continue;
    }

    if (line.includes("$$")) {
      inDollarQuote = !inDollarQuote;
    }

    current += line + "\n";

    if (!inDollarQuote && trimmed.endsWith(";")) {
      statements.push(current.trim());
      current = "";
    }
  }

  if (current.trim().length > 0) {
    statements.push(current.trim());
  }

  return statements;
}

async function run() {
  const sqlPath = path.join(__dirname, "prisma", "migrations_supabase", "init_supabase_pgvector.sql");
  const sqlContent = fs.readFileSync(sqlPath, "utf8");
  const statements = splitSqlStatements(sqlContent);

  console.log(`Total de ${statements.length} instruções SQL encontradas para execução.`);

  let executedCount = 0;
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await prisma.$executeRawUnsafe(stmt);
      executedCount++;
    } catch (err: any) {
      console.warn(`[Aviso instrução ${i + 1}]: ${err.message?.slice(0, 120)}...`);
    }
  }

  console.log(`\n🎉 Concluído com sucesso! ${executedCount}/${statements.length} instruções executadas diretamente no Supabase.`);
  await prisma.$disconnect();
}

run();
