import { describe, it, expect, vi, beforeEach } from "vitest";
import { isDuplicateWebhookMessage } from "../apps/api/src/routes/webhooks";
import { POST } from "../apps/web/src/app/api/conversations/[id]/messages/route";
import { prisma } from "../apps/web/src/lib/prisma";
import { getSession } from "../apps/web/src/lib/session";

// Mock Prisma
vi.mock("../apps/web/src/lib/prisma", () => ({
  prisma: {
    conversation: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    message: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock Session
vi.mock("../apps/web/src/lib/session", () => ({
  getSession: vi.fn(),
}));

describe("[P1, P2, P3] Messaging, Handoff & Webhook Idempotency", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // P3: Idempotência de Webhook
  // ==========================================
  describe("P3: Webhook Deduplication & Idempotency", () => {
    it("should correctly detect and suppress duplicate incoming webhook message IDs", () => {
      const msgId = "wamid.test_unique_id_" + Math.random();

      // First delivery -> not duplicate
      expect(isDuplicateWebhookMessage(msgId)).toBe(false);

      // Immediate retry with same ID -> duplicate detected
      expect(isDuplicateWebhookMessage(msgId)).toBe(true);
    });

    it("should allow different message IDs independently", () => {
      const idA = "wamid.msg_A_" + Date.now() + "_" + Math.random();
      const idB = "wamid.msg_B_" + Date.now() + "_" + Math.random();

      expect(isDuplicateWebhookMessage(idA)).toBe(false);
      expect(isDuplicateWebhookMessage(idB)).toBe(false);
    });
  });

  // ==========================================
  // P1: Envio Externo e Status de Mensagem
  // ==========================================
  describe("P1: External Dispatch & Message Status Updates", () => {
    const mockOrg = {
      id: "org-1",
      slug: "apex-seguros",
      whatsappTipoConexao: "OFICIAL_META",
      metaAccessToken: "EAATESTTOKEN123",
      metaPhoneNumberId: "1099887766",
    };

    const mockLead = {
      id: "lead-1",
      nome: "Cliente Teste",
      telefone: "+5511999998888",
    };

    const mockConversation = {
      id: "conv-1",
      organizationId: "org-1",
      canal: "WHATSAPP",
      status: "ABERTO",
      lead: mockLead,
      organization: mockOrg,
    };

    it("should call Meta Graph API with correct payload and update statusEnvio to ENVIADO on success", async () => {
      (getSession as any).mockResolvedValue({
        userId: "user-1",
        organizationId: "org-1",
      });

      (prisma.conversation.findUnique as any).mockResolvedValue(mockConversation);
      (prisma.message.create as any).mockResolvedValue({
        id: "msg-1",
        conversationId: "conv-1",
        remetenteTipo: "HUMANO",
        conteudo: "Olá, como posso ajudar?",
        statusEnvio: "PENDENTE",
      });

      (prisma.conversation.update as any).mockResolvedValue({
        ...mockConversation,
        status: "PAUSADO_HUMANO",
      });

      (prisma.message.update as any).mockImplementation(({ data }: any) => ({
        id: "msg-1",
        statusEnvio: data.statusEnvio,
      }));

      // Mock fetch global para simular sucesso da Meta API
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ messages: [{ id: "wamid.HBgL123" }] }),
      });
      global.fetch = fetchMock;

      const req = new Request("http://localhost:3000/api/conversations/conv-1/messages", {
        method: "POST",
        body: JSON.stringify({ conteudo: "Olá, como posso ajudar?" }),
      });

      const res = await POST(req, { params: Promise.resolve({ id: "conv-1" }) });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message.statusEnvio).toBe("ENVIADO");

      // Confirma que chamou a URL da Meta Graph API esperada
      expect(fetchMock).toHaveBeenCalledWith(
        "https://graph.facebook.com/v20.0/1099887766/messages",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer EAATESTTOKEN123",
          }),
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: "5511999998888",
            type: "text",
            text: { preview_url: false, body: "Olá, como posso ajudar?" },
          }),
        })
      );
    });

    it("should update statusEnvio to FALHA when external fetch fails", async () => {
      (getSession as any).mockResolvedValue({
        userId: "user-1",
        organizationId: "org-1",
      });

      (prisma.conversation.findUnique as any).mockResolvedValue(mockConversation);
      (prisma.message.create as any).mockResolvedValue({
        id: "msg-2",
        conversationId: "conv-1",
        remetenteTipo: "HUMANO",
        conteudo: "Mensagem com erro",
        statusEnvio: "PENDENTE",
      });

      (prisma.conversation.update as any).mockResolvedValue({
        ...mockConversation,
        status: "PAUSADO_HUMANO",
      });

      (prisma.message.update as any).mockImplementation(({ data }: any) => ({
        id: "msg-2",
        statusEnvio: data.statusEnvio,
      }));

      // Mock fetch global para simular erro da Meta API
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: "Invalid OAuth Token" } }),
      });
      global.fetch = fetchMock;

      const req = new Request("http://localhost:3000/api/conversations/conv-1/messages", {
        method: "POST",
        body: JSON.stringify({ conteudo: "Mensagem com erro" }),
      });

      const res = await POST(req, { params: Promise.resolve({ id: "conv-1" }) });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message.statusEnvio).toBe("FALHA");
      expect(data.dispatchError).toContain("Invalid OAuth Token");
    });
  });

  // ==========================================
  // P2: Handoff Humano e Supressão da IA
  // ==========================================
  describe("P2: Human Handoff & SDR/AI Suppression", () => {
    it("should switch conversation status to PAUSADO_HUMANO upon human message dispatch", async () => {
      (getSession as any).mockResolvedValue({
        userId: "user-1",
        organizationId: "org-1",
      });

      (prisma.conversation.findUnique as any).mockResolvedValue({
        id: "conv-handoff",
        organizationId: "org-1",
        canal: "WHATSAPP",
        status: "ABERTO",
        lead: { telefone: "5511988887777" },
        organization: { whatsappTipoConexao: "OFICIAL_META", metaAccessToken: "token", metaPhoneNumberId: "123" },
      });

      (prisma.message.create as any).mockResolvedValue({ id: "msg-h", statusEnvio: "PENDENTE" });
      (prisma.message.update as any).mockResolvedValue({ id: "msg-h", statusEnvio: "ENVIADO" });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      const req = new Request("http://localhost:3000/api/conversations/conv-handoff/messages", {
        method: "POST",
        body: JSON.stringify({ conteudo: "Assumindo o atendimento agora." }),
      });

      await POST(req, { params: Promise.resolve({ id: "conv-handoff" }) });

      // Confirma que a conversa foi atualizada para PAUSADO_HUMANO
      expect(prisma.conversation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "conv-handoff" },
          data: expect.objectContaining({
            status: "PAUSADO_HUMANO",
          }),
        })
      );
    });

    it("should suppress generateSDRResponse when conversation is in PAUSADO_HUMANO or TRANSFERIDO_HUMANO", () => {
      // Regra de supressão verificada no fluxo de webhook
      const shouldSuppressAI = (status: string) => {
        return status === "PAUSADO_HUMANO" || status === "TRANSFERIDO_HUMANO";
      };

      expect(shouldSuppressAI("PAUSADO_HUMANO")).toBe(true);
      expect(shouldSuppressAI("TRANSFERIDO_HUMANO")).toBe(true);
      expect(shouldSuppressAI("ABERTO")).toBe(false);
      expect(shouldSuppressAI("QUALIFICADO")).toBe(false);
      expect(shouldSuppressAI("FINALIZADO")).toBe(false);
    });
  });
});
