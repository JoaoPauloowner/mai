// Lista dos provedores de e-mail temporário / descartável mais comuns
const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "tempmail.com",
  "tempmail.net",
  "temp-mail.org",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "sharklasers.com",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "mailinator.com",
  "dispostable.com",
  "trashmail.com",
  "getairmail.com",
  "fakemailgenerator.com",
  "burnermail.io",
  "throwawaymail.com",
  "generator.email",
  "crazymailing.com",
  "mohmal.com",
  "inboxkitten.com",
  "mytemp.email",
  "getnada.com",
  "emailondeck.com",
  "minuteinbox.com",
  "tempail.com",
  "disposablemail.com",
]);

/**
 * Valida se um e-mail é sintaticamente válido e se não provém de um provedor temporário/falso.
 */
export function validateRealEmail(email: string): { valid: boolean; reason?: string } {
  if (!email || typeof email !== "string") {
    return { valid: false, reason: "E-mail não fornecido." };
  }

  const clean = email.trim().toLowerCase();
  
  // Regex RFC 5322 simplificado e rigoroso
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(clean)) {
    return { valid: false, reason: "Formato de e-mail inválido." };
  }

  const domain = clean.split("@")[1];
  if (!domain) {
    return { valid: false, reason: "Domínio de e-mail ausente." };
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, reason: "E-mails temporários ou descartáveis não são permitidos. Use um e-mail corporativo ou pessoal válido." };
  }

  return { valid: true };
}
