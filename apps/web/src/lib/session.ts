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

const sessionSecret = process.env.SESSION_SECRET;

if (process.env.NODE_ENV === "production") {
  if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error("CRITICAL SECURITY ERROR: SESSION_SECRET must be at least 32 characters in production.");
  }
} else if (sessionSecret && sessionSecret.length < 32) {
  console.warn("[SECURITY WARNING] SESSION_SECRET is shorter than 32 characters.");
}

export const sessionOptions: SessionOptions = {
  password: sessionSecret && sessionSecret.length >= 32
    ? sessionSecret
    : "omni_saas_ultra_secure_secret_key_development_only_min_32_bytes",
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
