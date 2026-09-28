import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../apps/web/src/app/api/quiz/submit/route";
import { prisma } from "../apps/web/src/lib/prisma";

vi.mock("../apps/web/src/lib/prisma", () => ({
  prisma: {
    organization: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
    lead: {
      create: vi.fn().mockResolvedValue({ id: "lead-123" }),
    },
    conversation: {
      create: vi.fn().mockResolvedValue({ id: "conv-123" }),
    },
    message: {
      create: vi.fn().mockResolvedValue({ id: "msg-123" }),
    },
    user: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

vi.mock("../apps/web/src/lib/round-robin", () => ({
  assignLeadToNextSeller: vi.fn().mockResolvedValue(null),
}));

describe("[M5] Public Quiz Endpoint Hardening", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reject submission without a slug parameter", async () => {
    const req = new Request("http://localhost:3000/api/quiz/submit", {
      method: "POST",
      body: JSON.stringify({
        nome: "Lead Teste",
        telefone: "11999998888",
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("slug");
  });

  it("should reject submission for a non-existent organization without falling back to another tenant", async () => {
    (prisma.organization.findUnique as any).mockResolvedValue(null);

    const req = new Request("http://localhost:3000/api/quiz/submit", {
      method: "POST",
      body: JSON.stringify({
        slug: "inexistent-org",
        nome: "Lead Teste",
        telefone: "11999998888",
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(prisma.organization.findFirst).not.toHaveBeenCalled();
  });

  it("should reject invalid phone numbers", async () => {
    const req = new Request("http://localhost:3000/api/quiz/submit", {
      method: "POST",
      body: JSON.stringify({
        slug: "org-valid",
        nome: "Lead Teste",
        telefone: "123", // too short
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("telefone");
  });
});
