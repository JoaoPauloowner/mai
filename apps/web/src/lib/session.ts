import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface SessionData {
  userId: string;
  organizationId: string;
  organizationNome: string;
  organizationSlug: string;
  organizationSegmento: string; // AUTO, INSURANCE, ACCOUNTING, CLINIC, GENERAL
  nome: string;
  email: string;
  role: string; // SUPER_ADMIN, ADMIN_EMPRESA, VENDEDOR
  isDemoMode?: boolean;
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "omni_saas_ultra_secure_secret_key_change_in_production_2026_at_least_32_bytes",
  cookieName: "omni-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();

  if (!session.userId || !session.organizationId) {
    redirect("/login");
  }

  return {
    userId: session.userId,
    organizationId: session.organizationId,
    organizationNome: session.organizationNome || "Minha Empresa",
    organizationSlug: session.organizationSlug || "empresa",
    organizationSegmento: session.organizationSegmento || "GENERAL",
    nome: session.nome || "Usuário",
    email: session.email || "",
    role: session.role || "ADMIN_EMPRESA",
    isDemoMode: Boolean(session.isDemoMode),
  };
}
