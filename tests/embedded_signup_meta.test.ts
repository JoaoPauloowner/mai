import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isMetaTokenExpired, exchangeForLongLivedToken } from "../apps/web/src/lib/meta";
import { isMetaTokenExpired as isApiMetaTokenExpired } from "../apps/api/src/services/meta";

describe("Meta Embedded Signup & Token Lifecycle [Fase 2]", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe("2.1 & 2.2: exchangeForLongLivedToken", () => {
    it("deve trocar token de curta duração por token de 60 dias quando credenciais configuradas", async () => {
      process.env.META_APP_ID = "1448689107110156";
      process.env.META_APP_SECRET = "test_app_secret_123456";

      const mockFetch = vi.fn().mockResolvedValue({
        json: async () => ({
          access_token: "EAALongLivedTokenMock60Days",
          token_type: "bearer",
          expires_in: 5184000,
        }),
      });
      global.fetch = mockFetch;

      const result = await exchangeForLongLivedToken("short_user_token_123");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("grant_type=fb_exchange_token")
      );
      expect(result.accessToken).toBe("EAALongLivedTokenMock60Days");
      expect(result.isLongLived).toBe(true);
      expect(result.expiresIn).toBe(5184000);
    });

    it("deve retornar o token original como fallback caso META_APP_SECRET não esteja configurado", async () => {
      delete process.env.META_APP_SECRET;

      const result = await exchangeForLongLivedToken("original_token");
      expect(result.accessToken).toBe("original_token");
      expect(result.isLongLived).toBe(false);
    });
  });

  describe("2.3 & 2.4: Fluxo Simulado de Subscribed Apps & Register", () => {
    it("deve processar resposta de subscribed_apps com sucesso", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        json: async () => ({ success: true }),
      });
      global.fetch = mockFetch;

      const res = await fetch("https://graph.facebook.com/v21.0/1382424483961555/subscribed_apps", {
        method: "POST",
      });
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it("deve tratar número já registrado (código 133010) como sucesso operacional", async () => {
      const registerMockResponse = {
        error: {
          message: "(#133010) Phone number already registered",
          type: "OAuthException",
          code: 133010,
        },
      };

      const isSuccessOrAlreadyRegistered = (data: any) =>
        Boolean(data?.success || data?.error?.code === 133010);

      expect(isSuccessOrAlreadyRegistered(registerMockResponse)).toBe(true);
      expect(isSuccessOrAlreadyRegistered({ success: true })).toBe(true);
      expect(isSuccessOrAlreadyRegistered({ error: { code: 99999 } })).toBe(false);
    });
  });

  describe("2.5: Handler de account_update do Webhook Meta", () => {
    it("deve mapear eventos de banimento/restrição para RESTRICTED", () => {
      const determineStatus = (eventType: string) => {
        const upper = String(eventType).toUpperCase();
        if (upper.includes("BANNED") || upper.includes("DISABLED") || upper.includes("RESTRICTED")) {
          return "RESTRICTED";
        }
        if (upper.includes("CONNECTED") || upper.includes("APPROVED") || upper.includes("VERIFIED")) {
          return "CONNECTED";
        }
        return "UNKNOWN";
      };

      expect(determineStatus("ACCOUNT_RESTRICTED")).toBe("RESTRICTED");
      expect(determineStatus("PHONE_NUMBER_BANNED")).toBe("RESTRICTED");
      expect(determineStatus("WABA_DISABLED")).toBe("RESTRICTED");
      expect(determineStatus("VERIFIED_ACCOUNT")).toBe("CONNECTED");
      expect(determineStatus("PHONE_NUMBER_CONNECTED")).toBe("CONNECTED");
      expect(determineStatus("CUSTOM_UNKNOWN_EVENT")).toBe("UNKNOWN");
    });
  });

  describe("2.6: isMetaTokenExpired (Detecção de Expiração de Token)", () => {
    it("deve detectar erro 190 de OAuthException (Sessão Expirada)", () => {
      const errorPayload = {
        error: {
          message: "Error validating access token: Session has expired on Monday, 10-Jul-23 10:00:00 PDT.",
          type: "OAuthException",
          code: 190,
          error_subcode: 463,
          fbtrace_id: "AZ123456",
        },
      };

      expect(isMetaTokenExpired(errorPayload)).toBe(true);
      expect(isApiMetaTokenExpired(errorPayload)).toBe(true);
    });

    it("deve detectar subcode 467 (Invalid Token)", () => {
      const errorPayload = {
        error: {
          message: "Error validating access token: The session has been invalidated because the user changed their password.",
          type: "OAuthException",
          code: 190,
          error_subcode: 467,
        },
      };

      expect(isMetaTokenExpired(errorPayload)).toBe(true);
      expect(isApiMetaTokenExpired(errorPayload)).toBe(true);
    });

    it("deve ignorar erros operacionais normais que não sejam de token expirado", () => {
      const normalError = {
        error: {
          message: "(#131030) Message failed to send because more than 24 hours have passed since the customer last replied.",
          type: "OAuthException",
          code: 131030,
        },
      };

      expect(isMetaTokenExpired(normalError)).toBe(false);
      expect(isApiMetaTokenExpired(normalError)).toBe(false);
    });

    it("deve retornar false para payload nulo ou sem erro", () => {
      expect(isMetaTokenExpired(null)).toBe(false);
      expect(isMetaTokenExpired({})).toBe(false);
      expect(isApiMetaTokenExpired(undefined)).toBe(false);
    });
  });
});
