import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omni Service SaaS | AI-Powered Vertical Platform",
  description: "Plataforma Multi-Vertical com IA, Atribuição de Marketing Total e Caixa de Entrada Unificada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#0a0d14] text-[#f3f4f6] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
