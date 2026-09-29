/**
 * AI Circuit Breaker & Timeout Guard for Web app
 */

const DEFAULT_TIMEOUT_MS = 15000; // 15 seconds

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort(new Error(`Timeout de ${timeoutMs}ms excedido na chamada para ${url}`));
  }, timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}
