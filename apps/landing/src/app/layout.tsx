import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SDR com Inteligência Artificial | Atendimento e Qualificação 24/7",
  description: "Automatize seu atendimento no WhatsApp e Instagram Direct com agentes de IA especializados.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased selection:bg-zinc-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
