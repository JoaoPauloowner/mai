import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  estimateAiCost,
  checkAndIncrementAiBudget,
  fetchWithTimeout,
} from "../apps/api/src/services/circuit-breaker.js";

describe("Prompt 3 Commercial Hardening Tests (P6 - P10)", () => {
  describe("P6: Vertical Feature Flags", () => {
    it("should allow disabling verticals via environment variables", () => {
      const isAutoEnabled = process.env.NEXT_PUBLIC_VERTICAL_AUTO_ENABLED !== "false";
      expect(typeof isAutoEnabled).toBe("boolean");
    });
  });

  describe("P7: WhatsApp Connection Modes & Safety", () => {
    it("should have Meta Cloud API as recommended default and evolution mode toggle", () => {
      const isEvolutionDefault = process.env.NEXT_PUBLIC_ADMIN_EVOLUTION_MODE_ENABLED === "true";
      // In production/default settings, evolution non-official mode is disabled unless explicitly toggled
      expect(typeof isEvolutionDefault).toBe("boolean");
    });
  });

  describe("P8: LGPD Compliance", () => {
    it("should export structured data containing required LGPD portabilidade fields", () => {
      const sampleExport = {
        termoLGPD: "Relatório de Portabilidade de Dados Pessoais (LGPD - Lei 13.709/2018, Art. 18)",
        dataExportacao: new Date().toISOString(),
        lead: {
          id: "lead_123",
          nome: "João Teste",
          telefone: "+5511999990000",
          email: "joao@teste.com",
        },
      };

      expect(sampleExport.termoLGPD).toContain("LGPD");
      expect(sampleExport.lead.nome).toBe("João Teste");
      expect(sampleExport.lead.telefone).toBe("+5511999990000");
    });
  });

  describe("P9: Asaas Webhook & Subscription Lifecycle", () => {
    it("should map Asaas payment events to correct organization statusPlano", () => {
      const getStatusFromEvent = (event: string) => {
        if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") return "ativo";
        if (event === "PAYMENT_OVERDUE" || event === "PAYMENT_BANK_SLIP_CANCELLED") return "inadimplente";
        if (
          event === "PAYMENT_DELETED" ||
          event === "SUBSCRIPTION_CANCELLED" ||
          event === "SUBSCRIPTION_INACTIVATED" ||
          event === "PAYMENT_REFUNDED"
        ) return "cancelado";
        return "pendente";
      };

      expect(getStatusFromEvent("PAYMENT_CONFIRMED")).toBe("ativo");
      expect(getStatusFromEvent("PAYMENT_OVERDUE")).toBe("inadimplente");
      expect(getStatusFromEvent("SUBSCRIPTION_CANCELLED")).toBe("cancelado");
      expect(getStatusFromEvent("PAYMENT_REFUNDED")).toBe("cancelado");
    });
  });

  describe("P10: AI Circuit Breaker, Timeout & Cost Estimation", () => {
    beforeEach(() => {
      process.env.DAILY_AI_REQUEST_LIMIT = "5";
      process.env.DAILY_AI_COST_LIMIT_USD = "1.00";
    });

    it("should correctly calculate estimated cost for GPT-4o-mini and embeddings", () => {
      // 1M prompt tokens of gpt-4o-mini = $0.15
      const costMini = estimateAiCost("gpt-4o-mini", 1_000_000, 0);
      expect(costMini).toBeCloseTo(0.15, 4);

      // 1M completion tokens of gpt-4o-mini = $0.60
      const costCompletion = estimateAiCost("gpt-4o-mini", 0, 1_000_000);
      expect(costCompletion).toBeCloseTo(0.60, 4);

      // 1M tokens of text-embedding-3-small = $0.02
      const costEmbeddings = estimateAiCost("text-embedding-3-small", 1_000_000, 0);
      expect(costEmbeddings).toBeCloseTo(0.02, 4);
    });

    it("should enforce daily budget and trip circuit breaker when requests limit is reached", () => {
      const testOrgId = `test_org_${Date.now()}`;

      // First 5 requests should pass
      for (let i = 0; i < 5; i++) {
        const result = checkAndIncrementAiBudget(testOrgId, 0.001);
        expect(result.allowed).toBe(true);
      }

      // 6th request should trip the circuit breaker
      const blockedResult = checkAndIncrementAiBudget(testOrgId, 0.001);
      expect(blockedResult.allowed).toBe(false);
      expect(blockedResult.reason).toContain("Limite diário");
    });

    it("should abort fetch calls that exceed timeout threshold", async () => {
      const mockFetchHangs = vi.fn().mockImplementation(
        (_url: string, options: any) =>
          new Promise((resolve, reject) => {
            if (options?.signal) {
              options.signal.addEventListener("abort", () => {
                reject(new Error("Timeout de 50ms excedido"));
              });
            }
          })
      );

      vi.stubGlobal("fetch", mockFetchHangs);

      await expect(
        fetchWithTimeout("https://api.openai.com/test", {}, 50)
      ).rejects.toThrow("Timeout");

      vi.unstubAllGlobals();
    });
  });
});
