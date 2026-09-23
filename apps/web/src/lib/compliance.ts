import crypto from "crypto";

/**
 * Normaliza número de telefone para o padrão internacional E.164.
 * Aceita formatos comuns brasileiros como:
 * - (11) 99999-8888 -> +5511999998888
 * - 11999998888     -> +5511999998888
 * - 5511999998888   -> +5511999998888
 */
export function normalizePhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");

  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`;
  }

  if (digits.length === 12 || digits.length === 13) {
    return `+${digits}`;
  }

  return `+${digits}`;
}

/**
 * Gera hash criptográfico SHA-256 para indexação e deduplicação ultra rápida.
 */
export function hashPhone(phone: string): string {
  const normalized = normalizePhone(phone);
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Mascara telefone para exibição segura em telas de demonstração ou LGPD.
 * Ex: +5511999998888 -> +55 (11) 9****-8888
 */
export function maskPhone(phone: string): string {
  const normalized = normalizePhone(phone);
  if (normalized.length >= 13) {
    const ddd = normalized.slice(3, 5);
    const firstDigit = normalized.slice(5, 6);
    const lastDigits = normalized.slice(-4);
    return `+55 (${ddd}) ${firstDigit}****-${lastDigits}`;
  }
  return phone;
}
