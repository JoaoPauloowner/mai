"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Credenciais inválidas");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4 selection:bg-[#C1ED84] selection:text-[#2C2E2A]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#2C2E2A] items-center justify-center font-extrabold text-[#C1ED84] text-xl mb-4 shadow-md">
            Ω
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2C2E2A]">MAI Cockpit</h1>
          <p className="text-xs text-[#63695B] mt-1">Omni Service SaaS — Acesso Corporativo</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#E0E3DE] rounded-2xl p-6 shadow-sm space-y-5">
          <div className="pb-4 border-b-2 border-[#C1ED84]">
            <h2 className="font-serif font-bold text-base text-[#2C2E2A]">Entrar na Plataforma</h2>
            <p className="text-[11px] text-[#63695B] mt-0.5">Insira seu e-mail e senha para continuar</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#E9BEC4] border border-red-200 text-[#9B2226] text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#2C2E2A] mb-1.5 uppercase tracking-wide">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7C8472] absolute left-3.5 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@empresa.com.br"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-sm text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2C2E2A] mb-1.5 uppercase tracking-wide">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7C8472] absolute left-3.5 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-sm text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#C1ED84] hover:bg-[#B2E372] text-[#2C2E2A] font-bold text-sm transition border border-[#A5DC60] flex items-center justify-center gap-2 disabled:opacity-60 shadow-xs"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#2C2E2A] border-t-transparent rounded-full animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  Entrar <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-1 border-t border-[#E0E3DE] text-center text-xs text-[#7C8472]">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="text-[#2C2E2A] font-bold hover:underline">
              Criar Conta Comercial
            </Link>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-[#7C8472]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#7A8E75]" />
          <span>Criptografia ponta a ponta · Conformidade LGPD</span>
        </div>
      </div>
    </div>
  );
}
