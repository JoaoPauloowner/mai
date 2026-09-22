import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAI — Motor de Atendimento & Inteligência",
  description: "Transforme leads em conversas qualificadas e dê ao seu time uma única torre de controle para atendimento, IA e vendas.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const experience = requestHeaders.get("x-mai-experience") || "mai";
  return (
    <html lang="pt-BR">
      <body className={`min-h-screen antialiased experience-${experience}`}>{children}</body>
    </html>
  );
}