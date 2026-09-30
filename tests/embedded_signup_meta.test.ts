import { describe, it, expect, vi, beforeEach } from "vitest";
import { isMetaTokenExpired } from "../apps/web/src/lib/meta";
import { isMetaTokenExpired as isApiMetaTokenExpired } from "../apps/api/src/services/meta";

describe("Meta Embedded Signup & Token Lifecycle [Tarefas 1-6]", () => {
  describe("Tarefa 6: isMetaTokenExpired", () => {
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
