"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="min-h-screen bg-[#0a0d14] flex flex-col items-center justify-center p-4 selection:bg-[#00ddd7] selection:text-black">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00ddd7] to-[#3b82f6] items-center justify-center font-bold text-black text-2xl mb-4 shadow-[0_0_25px_rgba(0,221,215,0.4)]">
            Ω
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Omni Service SaaS</h1>
          <p className="text-sm text-gray-400 mt-1">Cockpit Multi-Tenant com Atribuição de Marketing</p>
        </div>

        {/* Card Form */}
        <div className="bg-[#111622] border border-[#1e2638] rounded-2xl p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00ddd7] via-[#38bdf8] to-[#818cf8]" />

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-white text-sm focus:outline-none focus:border-[#00ddd7] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Senha de Acesso</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-white text-sm focus:outline-none focus:border-[#00ddd7] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black font-bold text-sm transition-all duration-150 shadow-[0_0_20px_rgba(0,221,215,0.3)] hover:shadow-[0_0_25px_rgba(0,221,215,0.5)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Autenticando..."
              ) : (
                <>
                  Entrar no Cockpit <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Atalhos Rápidos de Demonstração */}
          <div className="mt-6 pt-5 border-t border-[#1e2638]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00ddd7]" /> Acesso Rápido de Testes (1-Clique):
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCredentials("admin@omni.com.br", "admin123")}
                className="p-2 rounded-lg bg-[#161d2d] border border-[#252e42] hover:border-[#00ddd7] text-left transition text-gray-300"
              >
                <div className="font-semibold text-[#00ddd7]">Super Admin</div>
                <div className="text-[10px] text-gray-500">Demo Switcher ativo</div>
              </button>

              <button
                type="button"
                onClick={() => setCredentials("auto@omni.com.br", "user123")}
                className="p-2 rounded-lg bg-[#161d2d] border border-[#252e42] hover:border-[#f59e0b] text-left transition text-gray-300"
              >
                <div className="font-semibold text-[#f59e0b]">🚗 Automotivo</div>
                <div className="text-[10px] text-gray-500">AutoPrime Motors</div>
              </button>

              <button
                type="button"
                onClick={() => setCredentials("seguros@omni.com.br", "user123")}
                className="p-2 rounded-lg bg-[#161d2d] border border-[#252e42] hover:border-[#3b82f6] text-left transition text-gray-300"
              >
                <div className="font-semibold text-[#3b82f6]">🛡️ Seguros</div>
                <div className="text-[10px] text-gray-500">Apex Corretora</div>
              </button>

              <button
                type="button"
                onClick={() => setCredentials("contabil@omni.com.br", "user123")}
                className="p-2 rounded-lg bg-[#161d2d] border border-[#252e42] hover:border-[#10b981] text-left transition text-gray-300"
              >
                <div className="font-semibold text-[#10b981]">📊 Contábil</div>
                <div className="text-[10px] text-gray-500">ContabFlow</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
