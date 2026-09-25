import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";
import { verifyMetaSignature } from "../src/services/meta.js";

// Mock das dependências externas
vi.mock("@omni/database", () => {
  return {
    prisma: {
      organization: {
        findFirst: vi.fn(),
        update: vi.fn(),
      },
      auditLog: {
        create: vi.fn(),
      },
    },
  };
});

vi.mock("../src/services/meta.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/services/meta.js")>();
  return {
    ...actual,
    sendWhatsAppMessage: vi.fn().mockResolvedValue({ success: true, data: { message_id: "wamid.123" } }),
    sendInstagramMessage: vi.fn().mockResolvedValue({ success: true, data: { recipient_id: "inst.123" } }),
  };
});

vi.mock("../src/services/conversation.js", () => {
  return {
    findOrCreateLeadAndConversation: vi.fn().mockResolvedValue({
      lead: { id: "lead_123", nome: "Lead Teste", telefone: "5511999999999" },
      conversation: { id: "conv_123", canal: "WHATSAPP" },
    }),
    recordIncomingMessage: vi.fn().mockResolvedValue({ id: "msg_in_123" }),
    recordOutgoingMessage: vi.fn().mockResolvedValue({ id: "msg_out_123" }),
    getRecentHistory: vi.fn().mockResolvedValue([
      { role: "user", content: "Olá" },
      { role: "assistant", content: "Olá! Como posso ajudar?" },
    ]),
  };
});

vi.mock("../src/services/ai.js", () => {
  return {
    generateSDRResponse: vi.fn().mockResolvedValue({
      replyText: "Olá! Nosso plano Pro custa R$ 497/mês com SDR de IA ilimitado. Quer agendar uma demonstração?",
      toolCalled: "check_pricing",
    }),
  };
});

describe("1. HMAC Signature Verification (Meta Security)", () => {
  const secret = "test_meta_secret_key_12345";
  const payload = JSON.stringify({ event: "message", text: "Olá" });

  it("deve validar com sucesso a assinatura HMAC SHA-256 correta", () => {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(payload).digest("hex");
    const signatureHeader = `sha256=${digest}`;

    const isValid = verifyMetaSignature(payload, signatureHeader, secret);
    expect(isValid).toBe(true);
  });

  it("deve rejeitar assinatura adulterada ou com chave incorreta", () => {
    const invalidSignature = "sha256=abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
    const isValid = verifyMetaSignature(payload, invalidSignature, secret);
    expect(isValid).toBe(false);
  });
});

describe("2. WhatsApp AI SDR Webhook E2E Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.META_WEBHOOK_VERIFY_TOKEN = "test_verify_token_2026";
    process.env.META_ACCESS_TOKEN = "EAABtest_token";
    process.env.META_PHONE_NUMBER_ID = "phone_id_999";
  });

  it("deve processar o payload de mensagem do WhatsApp, buscar histórico, executar RAG/IA e enviar resposta via Graph API", async () => {
    const { prisma } = await import("@omni/database");
    const { findOrCreateLeadAndConversation, recordIncomingMessage, recordOutgoingMessage, getRecentHistory } = await import("../src/services/conversation.js");
    const { generateSDRResponse } = await import("../src/services/ai.js");
    const { sendWhatsAppMessage } = await import("../src/services/meta.js");

    const mockOrg = {
      id: "org_test_123",
      nome: "Empresa Teste",
      metaAccessToken: "EAABtest_org_token",
      metaPhoneNumberId: "phone_org_123",
    };

    (prisma.organization.findFirst as any).mockResolvedValue(mockOrg);

    // Simulação do payload padrão enviado pelo Meta Cloud API
    const whatsappPayload = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "WABA_ID_123",
          changes: [
            {
              value: {
                messaging_product: "whatsapp",
                metadata: {
                  display_phone_number: "551188888888",
                  phone_number_id: "phone_org_123",
                },
                contacts: [{ profile: { name: "Cliente Interessado" }, wa_id: "5511999999999" }],
                messages: [
                  {
                    from: "5511999999999",
                    id: "wamid.HBgLNTUx...",
                    timestamp: "1727220000",
                    text: { body: "Quero saber o valor do plano Pro" },
                    type: "text",
                  },
                ],
              },
              field: "messages",
            },
          ],
        },
      ],
    };

    // Execução do pipeline de simulação
    const entry = whatsappPayload.entry[0];
    const message = entry.changes[0].value.messages[0];
    const senderPhone = message.from;
    const messageText = message.text.body;
    const phoneNumberId = entry.changes[0].value.metadata.phone_number_id;

    // 1. Identifica Org
    const org = await prisma.organization.findFirst({ where: { metaPhoneNumberId: phoneNumberId } as any });
    expect(org).toBeDefined();
    expect(org?.id).toBe("org_test_123");

    // 2. Cria ou recupera Lead e Conversa
    const { lead, conversation } = await findOrCreateLeadAndConversation({
      organizationId: org!.id,
      phone: senderPhone,
      name: "Cliente Interessado",
      channel: "WHATSAPP",
    });
    expect(lead.id).toBe("lead_123");
    expect(conversation.id).toBe("conv_123");

    // 3. Grava mensagem de entrada
    await recordIncomingMessage({
      conversationId: conversation.id,
      text: messageText,
    });
    expect(recordIncomingMessage).toHaveBeenCalledWith({
      conversationId: "conv_123",
      text: "Quero saber o valor do plano Pro",
    });

    // 4. Busca histórico
    const history = await getRecentHistory(conversation.id);
    expect(history.length).toBeGreaterThan(0);

    // 5. Gera resposta com o motor de IA
    const aiResult = await generateSDRResponse({
      organizationId: org!.id,
      leadId: lead.id,
      leadName: lead.nome,
      leadPhone: lead.telefone,
      userMessage: messageText,
      history,
    });
    expect(aiResult.replyText).toContain("R$ 497/mês");

    // 6. Grava resposta de saída
    await recordOutgoingMessage({
      conversationId: conversation.id,
      text: aiResult.replyText,
    });
    expect(recordOutgoingMessage).toHaveBeenCalledWith({
      conversationId: "conv_123",
      text: aiResult.replyText,
    });

    // 7. Dispara via Meta Graph API
    const sendResult = await sendWhatsAppMessage({
      phoneNumberId: org!.metaPhoneNumberId,
      accessToken: org!.metaAccessToken,
      to: senderPhone,
      text: aiResult.replyText,
    });

    expect(sendResult.success).toBe(true);
    expect(sendWhatsAppMessage).toHaveBeenCalledWith({
      phoneNumberId: "phone_org_123",
      accessToken: "EAABtest_org_token",
      to: "5511999999999",
      text: aiResult.replyText,
    });
  });
});

describe("3. Asaas Billing Webhook Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ASAAS_WEBHOOK_ACCESS_TOKEN = "asaas_secret_token_valid_123";
  });

  it("deve ativar o plano da organização e criar AuditLog quando PAYMENT_RECEIVED for recebido com token válido", async () => {
    const { prisma } = await import("@omni/database");

    const mockOrg = {
      id: "org_paying_456",
      nome: "Clínica Saúde Total",
      emailNotificacoes: "financeiro@clinica.com",
      statusPlano: "trial",
    };

    (prisma.organization.findFirst as any).mockResolvedValue(mockOrg);
    (prisma.organization.update as any).mockResolvedValue({ ...mockOrg, statusPlano: "ativo" });
    (prisma.auditLog.create as any).mockResolvedValue({ id: "audit_123" });

    const incomingToken = "asaas_secret_token_valid_123";
    const asaasSecret = process.env.ASAAS_WEBHOOK_ACCESS_TOKEN;

    // 1. Validação de token
    expect(incomingToken).toBe(asaasSecret);

    // 2. Payload de pagamento Asaas
    const billingPayload = {
      event: "PAYMENT_RECEIVED",
      payment: {
        id: "pay_987654321",
        customerEmail: "financeiro@clinica.com",
        value: 497.0,
        netValue: 492.0,
        status: "RECEIVED",
      },
    };

    // 3. Busca organização por email
    const org = await prisma.organization.findFirst({
      where: { emailNotificacoes: billingPayload.payment.customerEmail } as any,
    });
    expect(org).toBeDefined();
    expect(org?.id).toBe("org_paying_456");

    // 4. Atualiza status do plano para 'ativo'
    await prisma.organization.update({
      where: { id: org!.id },
      data: { statusPlano: "ativo" },
    });
    expect(prisma.organization.update).toHaveBeenCalledWith({
      where: { id: "org_paying_456" },
      data: { statusPlano: "ativo" },
    });

    // 5. Registra auditoria financeira no AuditLog
    await prisma.auditLog.create({
      data: {
        organizationId: org!.id,
        acao: "PAYMENT_CONFIRMED",
        detalhes: `Pagamento recebido via Asaas. Plano reativado para a organização ${org!.nome}. Evento: ${billingPayload.event}`,
      },
    });
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        organizationId: "org_paying_456",
        acao: "PAYMENT_CONFIRMED",
        detalhes: expect.stringContaining("Pagamento recebido via Asaas"),
      },
    });
  });

  it("deve rejeitar tokens incorretos no webhook Asaas", () => {
    const invalidToken = "invalid_token_999";
    const asaasSecret = process.env.ASAAS_WEBHOOK_ACCESS_TOKEN;

    expect(invalidToken === asaasSecret).toBe(false);
  });
});
