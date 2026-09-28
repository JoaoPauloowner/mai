import { describe, it, expect } from "vitest";
import { isDuplicateWebhookMessage } from "../apps/api/src/routes/webhooks";

describe("[P1, P2, P3] Messaging, Handoff & Webhook Idempotency", () => {
  it("should correctly detect and suppress duplicate incoming webhook message IDs (P3)", () => {
    const msgId = "wamid.test_unique_id_12345";

    // First delivery -> not duplicate
    expect(isDuplicateWebhookMessage(msgId)).toBe(false);

    // Immediate retry with same ID -> duplicate detected
    expect(isDuplicateWebhookMessage(msgId)).toBe(true);
  });

  it("should allow different message IDs independently", () => {
    const idA = "wamid.msg_A_" + Date.now();
    const idB = "wamid.msg_B_" + Date.now();

    expect(isDuplicateWebhookMessage(idA)).toBe(false);
    expect(isDuplicateWebhookMessage(idB)).toBe(false);
  });
});
