import { describe, it, expect } from "vitest";

// Valida regras de allowlist de roles e proteção de escalada de privilégios
export const ALLOWED_TENANT_ROLES = ["ADMIN_EMPRESA", "VENDEDOR"] as const;
export type AllowedTenantRole = (typeof ALLOWED_TENANT_ROLES)[number];

export function validateTenantRole(role: string): { valid: boolean; role?: AllowedTenantRole; error?: string } {
  if (!role) return { valid: true, role: "VENDEDOR" };
  if (!ALLOWED_TENANT_ROLES.includes(role as AllowedTenantRole)) {
    return { valid: false, error: "Função não permitida para gestão de equipe no tenant." };
  }
  return { valid: true, role: role as AllowedTenantRole };
}

export function validateSelfRoleModification(sessionUserId: string, targetUserId: string): boolean {
  return sessionUserId !== targetUserId;
}

export function canDemoteOrRemoveAdmin(currentRole: string, adminCountInOrg: number): boolean {
  if (currentRole === "ADMIN_EMPRESA" && adminCountInOrg <= 1) {
    return false;
  }
  return true;
}

describe("S1: Privilege Escalation & Role Security", () => {
  it("deve bloquear a atribuição de SUPER_ADMIN via API de gestão de equipe", () => {
    const result = validateTenantRole("SUPER_ADMIN");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("não permitida");
  });

  it("deve permitir atribuição de roles válidas (ADMIN_EMPRESA e VENDEDOR)", () => {
    expect(validateTenantRole("ADMIN_EMPRESA").valid).toBe(true);
    expect(validateTenantRole("VENDEDOR").valid).toBe(true);
  });

  it("deve bloquear auto-promoção ou alteração da própria role", () => {
    const allowed = validateSelfRoleModification("user_123", "user_123");
    expect(allowed).toBe(false);
  });

  it("deve impedir rebaixar ou remover o último ADMIN_EMPRESA da organização", () => {
    const allowed = canDemoteOrRemoveAdmin("ADMIN_EMPRESA", 1);
    expect(allowed).toBe(false);

    const allowedWithMultiple = canDemoteOrRemoveAdmin("ADMIN_EMPRESA", 2);
    expect(allowedWithMultiple).toBe(true);
  });
});
