import { prisma } from "@/lib/prisma";

/**
 * Helper centralizado para obtenção de Token da Meta por Organização.
 * 
 * ARQUITETURA & MIGRAÇÃO FUTURA:
 * Atualmente, cada organização conectada via Embedded Signup armazena seu próprio token
 * de longa duração (gerado via fb_exchange_token) no campo `metaAccessToken`.
 * 
 * O modelo recomendado a longo prazo pela Meta para SaaS multi-tenant é utilizar um
 * Token Único de Usuário de Sistema (META_SYSTEM_USER_TOKEN / System User Token permanente)
 * com permissões delegadas nas WABAs dos clientes, combinado com `metaWabaId` e `metaPhoneNumberId`.
 * 
 * Este helper centraliza essa resolução para que a transição futura ocorra em um único local.
 */
export async function getMetaTokenForOrg(organizationId: string): Promise<string | null> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { metaAccessToken: true },
  });

  return (
    org?.metaAccessToken ||
    process.env.META_SYSTEM_USER_TOKEN ||
    process.env.META_ACCESS_TOKEN ||
    null
  );
}

/**
 * Troca um token de usuário de curta duração (1-2 horas) por um token de longa duração (60 dias)
 * através do endpoint oauth/access_token da Graph API.
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<{
  accessToken: string;
  expiresIn?: number;
  isLongLived: boolean;
}> {
  const appId = process.env.META_APP_ID || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!appId || !appSecret) {
    console.warn(
      "[Meta OAuth] META_APP_ID ou META_APP_SECRET não configurados. Usando token original."
    );
    return { accessToken: shortLivedToken, isLongLived: false };
  }

  try {
    const url = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.access_token) {
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        isLongLived: true,
      };
    }

    console.warn("[Meta OAuth] Resposta inesperada ao trocar token:", data);
    return { accessToken: shortLivedToken, isLongLived: false };
  } catch (error) {
    console.error("[Meta OAuth Error] Falha na troca por token de longa duração:", error);
    return { accessToken: shortLivedToken, isLongLived: false };
  }
}

/**
 * Verifica se um erro retornado pela Graph API da Meta indica token expirado ou inválido (OAuthException / código 190).
 */
export function isMetaTokenExpired(errorData: any): boolean {
  if (!errorData) return false;
  const err = errorData?.error || errorData;
  const code = Number(err?.code);
  const subcode = Number(err?.error_subcode);
  const message = String(err?.message || "");

  return (
    code === 190 ||
    subcode === 463 ||
    subcode === 467 ||
    message.includes("Session has expired") ||
    message.includes("Error validating access token") ||
    message.includes("The access token could not be decrypted") ||
    message.includes("Malformed access token")
  );
}

/**
 * Utilitário para resolver variações de formato de telefone WhatsApp (especialmente a regra do 9º dígito no Brasil).
 */
export function formatWhatsAppRecipientCandidates(phone: string): string[] {
  const clean = phone.replace(/\D/g, "");

  // Regra do 9º dígito do Brasil (+55 + 2 dígitos DDD + 8 dígitos móvel => prioriza +55 + DDD + 9 + 8 dígitos)
  if (clean.startsWith("55") && clean.length === 12) {
    const ddd = clean.slice(2, 4);
    const rest = clean.slice(4);
    if (["6", "7", "8", "9"].includes(rest[0])) {
      const withNine = `55${ddd}9${rest}`;
      return [withNine, clean];
    }
  }

  // Se já tem 13 dígitos no Brasil (55 + DDD + 9 + 8 dígitos)
  if (clean.startsWith("55") && clean.length === 13) {
    const ddd = clean.slice(2, 4);
    const ninth = clean[4];
    const rest = clean.slice(5);
    if (ninth === "9") {
      const withoutNine = `55${ddd}${rest}`;
      return [clean, withoutNine];
    }
  }

  return [clean];
}
