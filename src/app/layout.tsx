import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAI — Motor de Atendimento & Inteligência | WhatsApp Attribution",
  description: "Plataforma B2B de Atendimento Imediato com IA, Atribuição Reversa de Marketing e CRM Integrado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#F5F5F5] text-[#2C2E2A] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
