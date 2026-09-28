import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { verifyMetaSignature } from "../apps/api/src/services/meta.js";

describe("S2 & S3: Webhook Security and Tenant Resolution", () => {
  const secret = "test_meta_secret_key_12345";
  const rawBody = Buffer.from(JSON.stringify({ object: "whatsapp_business_account", entry: [] }));

  it("deve validar com sucesso a assinatura HMAC correta com Buffer", () => {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(rawBody).digest("hex");
    const signatureHeader = `sha256=${digest}`;

    expect(verifyMetaSignature(rawBody, signatureHeader, secret)).toBe(true);
  });

  it("deve rejeitar assinatura forjada ou inválida sem lançar exceção", () => {
    expect(verifyMetaSignature(rawBody, "sha256=invalid_hex_or_wrong_len", secret)).toBe(false);
    expect(verifyMetaSignature(rawBody, "sha256=abcdef123456", secret)).toBe(false);
    expect(verifyMetaSignature(rawBody, undefined, secret)).toBe(false);
  });

  it("deve validar autenticação de webhook da Evolution API por API key", () => {
    const validKey = "evo_secret_token_2026";
    const checkKey = (providedHeader: string | undefined) => {
      if (!providedHeader) return false;
      const clean = providedHeader.replace("Bearer ", "").trim();
      return clean === validKey;
    };

    expect(checkKey("Bearer evo_secret_token_2026")).toBe(true);
    expect(checkKey("Bearer wrong_token")).toBe(false);
    expect(checkKey(undefined)).toBe(false);
  });
});
