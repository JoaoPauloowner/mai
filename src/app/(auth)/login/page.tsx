"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@omni.com.br");
  const [password, setPassword] = useState("admin123");
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

  const setCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4 selection:bg-[#C1ED84] selection:text-[#2C2E2A]">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#2C2E2A] items-center justify-center font-extrabold text-[#C1ED84] text-2xl mb-4 shadow-lg">
            Ω
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#2C2E2A]">MAI Cockpit</h1>
          <p className="text-sm text-[#63695B] mt-1">Motor de Atendimento & Inteligência — Omni Service SaaS</p>
        </div>

        {/* Card Form */}
        <div className="bg-white border border-[#E0E3DE] rounded-2xl p-7 shadow-sm space-y-5">
          <div className="border-b-4 border-[#C1ED84] pb-4 mb-2">
            <h2 className="font-serif font-bold text-lg text-[#2C2E2A]">Acesso ao Cockpit</h2>
            <p className="text-xs text-[#63695B] mt-0.5">Insira suas credenciais corporativas para continuar</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#E9BEC4] border border-red-200 text-[#9B2226] text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2C2E2A] mb-1.5">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7C8472] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-[#2C2E2A] text-sm focus:outline-none focus:border-[#7A8E75] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C2E2A] mb-1.5">Senha de Acesso</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7C8472] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-[#2C2E2A] text-sm focus:outline-none focus:border-[#7A8E75] focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-1 rounded-xl bg-[#C1ED84] hover:bg-[#B2E372] text-[#2C2E2A] font-bold text-sm transition-all border border-[#A5DC60] flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#2C2E2A] border-t-transparent rounded-full animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  Entrar no Cockpit <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Atalhos Rápidos de Demonstração */}
          <div className="mt-2 pt-4 border-t border-[#E0E3DE]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#7C8472] mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7A8E75]" /> Acesso Rápido de Testes (1-Clique):
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCredentials("admin@omni.com.br", "admin123")}
                className="p-2.5 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] hover:border-[#7A8E75] hover:bg-[#E7EBE6] text-left transition"
              >
                <div className="font-bold text-[#2C2E2A]">Super Admin</div>
                <div className="text-[10px] text-[#7C8472] mt-0.5">Demo Switcher ativo</div>
              </button>

              <button
                type="button"
                onClick={() => setCredentials("auto@omni.com.br", "user123")}
                className="p-2.5 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] hover:border-[#8F5D18] hover:bg-[#F5EDD8] text-left transition"
              >
                <div className="font-bold text-[#8F5D18]">🚗 Automotivo</div>
                <div className="text-[10px] text-[#7C8472] mt-0.5">AutoPrime Motors</div>
              </button>

              <button
                type="button"
                onClick={() => setCredentials("seguros@omni.com.br", "user123")}
                className="p-2.5 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] hover:border-[#2D6A4F] hover:bg-[#DDE8DE] text-left transition"
              >
                <div className="font-bold text-[#2D6A4F]">🛡️ Seguros</div>
                <div className="text-[10px] text-[#7C8472] mt-0.5">Apex Corretora</div>
              </button>

              <button
                type="button"
                onClick={() => setCredentials("contabil@omni.com.br", "user123")}
                className="p-2.5 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] hover:border-[#2D6A4F] hover:bg-[#DDE8DE] text-left transition"
              >
                <div className="font-bold text-[#2D6A4F]">📊 Contábil</div>
                <div className="text-[10px] text-[#7C8472] mt-0.5">ContabFlow</div>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E0E3DE] text-center text-xs text-[#7C8472]">
            Ainda não tem uma conta?{" "}
            <Link href="/cadastro" className="text-[#2C2E2A] font-bold hover:underline">
              Criar Conta Comercial
            </Link>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-[#7C8472]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#7A8E75]" />
          <span>Dados criptografados & conformidade LGPD garantida</span>
        </div>
      </div>
    </div>
  );
}
