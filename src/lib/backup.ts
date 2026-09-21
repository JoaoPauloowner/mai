/**
 * Script de Backup Automatizado do Banco de Dados
 * Executa cópia snapshot do banco SQLite (dev.db) com carimbo ISO e rotação de 30 dias.
 */

import fs from "fs";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "prisma/dev.db");
const BACKUP_DIR = path.resolve(process.cwd(), "backups");

export function runDatabaseBackup(): { success: boolean; backupFile?: string; error?: string } {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { success: false, error: "Arquivo de banco de dados não encontrado." };
    }

    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFileName = `backup_omni_${timestamp}.db`;
    const destinationPath = path.join(BACKUP_DIR, backupFileName);

    fs.copyFileSync(DB_PATH, destinationPath);
    console.log(`[Backup System] Snapshot salvo com sucesso em: ${destinationPath}`);

    // Rotação: manter apenas os últimos 30 backups
    const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.startsWith("backup_omni_"));
    if (files.length > 30) {
      files.sort();
      const filesToDelete = files.slice(0, files.length - 30);
      for (const f of filesToDelete) {
        fs.unlinkSync(path.join(BACKUP_DIR, f));
        console.log(`[Backup Rotation] Backup antigo removido: ${f}`);
      }
    }

    return { success: true, backupFile: backupFileName };
  } catch (error: any) {
    console.error("Falha ao executar backup do banco:", error);
    return { success: false, error: error.message };
  }
}

// Se executado diretamente via CLI (node / tsx)
if (require.main === module) {
  const res = runDatabaseBackup();
  console.log("Resultado do Backup:", res);
}
