import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAI — Motor de Atendimento & Inteligência",
  description:
    "Transforme leads em conversas qualificadas e dê ao seu time uma única torre de controle para atendimento, IA e vendas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
