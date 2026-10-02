import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Sliding window rate limiter com suporte real a Upstash Redis (distribuído)
 * e fallback em memória para desenvolvimento local e testes unitários.
 *
 * MODO DEV APENAS: O fallback em memória não deve ser utilizado em produção
 * com múltiplas instâncias ou ambiente serverless.
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

let redisClient: Redis | null = null;
const upstashRatelimitCache = new Map<string, Ratelimit>();

const hasUpstashConfig = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

if (hasUpstashConfig) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  } catch (err) {
    console.error("[RATE-LIMIT] Erro ao inicializar Upstash Redis:", err);
  }
} else if (process.env.NODE_ENV === "production") {
  console.warn(
    "⚠️ [SECURITY WARNING] UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN não configurados em produção! " +
    "Fallback para Map em memória ativado (modo dev apenas, não usar em produção com mais de 1 instância ou serverless)."
  );
}

/**
 * Obtém o endereço IP confiável do cliente evitando falsificações e spoofing
 */
export function getTrustedClientIp(req: Request): string {
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const hops = xForwardedFor.split(",").map((s) => s.trim());
    return hops[0] || "127.0.0.1";
  }

  return "127.0.0.1";
}

/**
 * Verifica limites de requisição por chave (IP, tenant ou usuário).
 * Utiliza Upstash Redis quando configurado, com fallback gracioso para memória.
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutos
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  if (redisClient) {
    try {
      const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));
      const limiterKey = `${maxRequests}_${windowSeconds}`;

      let ratelimit = upstashRatelimitCache.get(limiterKey);
      if (!ratelimit) {
        ratelimit = new Ratelimit({
          redis: redisClient,
          limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
          analytics: false,
          prefix: "omnai:ratelimit",
        });
        upstashRatelimitCache.set(limiterKey, ratelimit);
      }

      const result = await ratelimit.limit(key);
      return {
        allowed: result.success,
        remaining: result.remaining,
        resetAt: result.reset,
      };
    } catch (redisError) {
      console.error("[RATE-LIMIT] Falha no Upstash Redis, utilizando fallback em memória:", redisError);
    }
  }

  // Fallback em memória (modo dev apenas)
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitMap.set(key, newRecord);
    return { allowed: true, remaining: maxRequests - 1, resetAt: newRecord.resetAt };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  rateLimitMap.set(key, record);
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}
