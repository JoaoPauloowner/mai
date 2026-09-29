/**
 * Utilitários de mascaramento de PII para logs e observabilidade (M6)
 */
export function maskPhone(phone?: string | null): string {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length <= 4) return "****";
  return `***-***-${digits.slice(-4)}`;
}

export function maskMessage(text?: string | null, maxLen = 20): string {
  if (!text) return "";
  const trimmed = String(text).trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen)}...`;
}

export function maskEmail(email?: string | null): string {
  if (!email) return "";
  const str = String(email).trim();
  const parts = str.split("@");
  if (parts.length !== 2) return "***@***.com";
  const [user, domain] = parts;
  const maskedUser = user.length <= 2 ? `${user[0] || ""}*` : `${user.slice(0, 2)}***`;
  return `${maskedUser}@${domain}`;
}

export function maskToken(token?: string | null): string {
  if (!token) return "[EMPTY]";
  return `[REDACTED_${token.slice(0, 4)}...]`;
}
