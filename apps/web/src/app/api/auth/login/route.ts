import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { validateCredentials } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const user = await validateCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais incorretas" },
        { status: 401 }
      );
    }

    const session = await getSession();
    session.userId = user.userId;
    session.organizationId = user.organizationId;
    session.organizationNome = user.organizationNome;
    session.organizationSlug = user.organizationSlug;
    session.organizationSegmento = user.organizationSegmento;
    session.nome = user.nome;
    session.email = user.email;
    session.role = user.role;
    session.isDemoMode = user.role === "SUPER_ADMIN";

    await session.save();

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor de autenticação" },
      { status: 500 }
    );
  }
}
