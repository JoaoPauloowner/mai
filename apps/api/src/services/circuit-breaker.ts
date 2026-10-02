/**
 * AI Circuit Breaker & Budget Guard for OMNAI / MAI
 * Prevents runaway OpenAI costs, enforces daily per-tenant request/budget limits,
 * and wraps all outgoing external LLM/Meta calls in a 15-second AbortController timeout.
 */

interface DailyUsageRecord {
  requests: number;
  costUsd: number;
  resetDate: string;
}

const memoryUsageStore = new Map<string, DailyUsageRecord>();

const DEFAULT_DAILY_MAX_REQUESTS = 500;
const DEFAULT_DAILY_MAX_COST_USD = 5.0; // $5.00 USD per organization per day
const DEFAULT_TIMEOUT_MS = 15000; // 15 seconds

/**
 * Calculates estimated USD cost for LLM calls based on current OpenAI pricing
 */
export function estimateAiCost(
  model: string = "gpt-4o-mini",
  promptTokens: number = 0,
  completionTokens: number = 0
): number {
  if (model.includes("gpt-4o-mini")) {
    // $0.15 / 1M prompt tokens, $0.60 / 1M completion tokens
    const promptCost = (promptTokens / 1_000_000) * 0.15;
    const completionCost = (completionTokens / 1_000_000) * 0.60;
    return promptCost + completionCost;
  }

  if (model.includes("gpt-4o")) {
    // $2.50 / 1M prompt tokens, $10.00 / 1M completion tokens
    const promptCost = (promptTokens / 1_000_000) * 2.50;
    const completionCost = (completionTokens / 1_000_000) * 10.00;
    return promptCost + completionCost;
  }

  if (model.includes("text-embedding")) {
    // $0.02 / 1M tokens
    return (promptTokens / 1_000_000) * 0.02;
  }

  // Groq / Local models: zero marginal API cost
  return 0;
}

/**
 * Checks if the organization has exceeded its daily AI quota/budget.
 * Increments request count and estimated cost if within limits.
 */
export function checkAndIncrementAiBudget(
  organizationId: string,
  estimatedCostUsd: number = 0.001
): {
  allowed: boolean;
  requestsToday: number;
  costTodayUsd: number;
  reason?: string;
} {
  const maxRequests = parseInt(
    process.env.DAILY_AI_REQUEST_LIMIT || String(DEFAULT_DAILY_MAX_REQUESTS),
    10
  );
  const maxCost = parseFloat(
    process.env.DAILY_AI_COST_LIMIT_USD || String(DEFAULT_DAILY_MAX_COST_USD)
  );

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const recordKey = `${organizationId}:${todayStr}`;

  const current = memoryUsageStore.get(recordKey) || {
    requests: 0,
    costUsd: 0,
    resetDate: todayStr,
  };

  // Reset check if day changed
  if (current.resetDate !== todayStr) {
    current.requests = 0;
    current.costUsd = 0;
    current.resetDate = todayStr;
  }

  if (current.requests >= maxRequests) {
    return {
      allowed: false,
      requestsToday: current.requests,
      costTodayUsd: current.costUsd,
      reason: `Limite diário de requisições de IA (${maxRequests}/dia) atingido para esta organização.`,
    };
  }

  if (current.costUsd >= maxCost) {
    return {
      allowed: false,
      requestsToday: current.requests,
      costTodayUsd: current.costUsd,
      reason: `Orçamento diário de IA ($${maxCost.toFixed(2)} USD/dia) atingido para esta organização.`,
    };
  }

  // Increment usage
  current.requests += 1;
  current.costUsd += estimatedCostUsd;
  memoryUsageStore.set(recordKey, current);

  return {
    allowed: true,
    requestsToday: current.requests,
    costTodayUsd: current.costUsd,
  };
}

/**
 * Wraps fetch with a strict AbortController timeout (default 15s)
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort(new Error(`Timeout de ${timeoutMs}ms excedido na requisição para ${url}`));
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
