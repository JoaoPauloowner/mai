"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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

      const callbackUrl = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("callbackUrl") : null;
      router.push(callbackUrl || "/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-neutral-300 rounded p-6 space-y-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900">Entrar na Plataforma</h1>
          <p className="text-xs text-neutral-500">Informe suas credenciais para acessar o workspace</p>
        </div>

        {error && (
          <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <Input
            id="email"
            type="email"
            label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@omni.com.br"
          />

          <Input
            id="password"
            type="password"
            label="Senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" className="w-full" disabled={loading} isLoading={loading}>
            Entrar
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-neutral-500">
          Não possui conta?{" "}
          <Link href="/cadastro" className="text-neutral-900 font-medium underline">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
