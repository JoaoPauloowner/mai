"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-verificação se o usuário clicou no link recebido por e-mail com ?token=...
  useEffect(() => {
    if (tokenParam) {
      handleAutoVerify(tokenParam);
    }
  }, [tokenParam]);

  const handleAutoVerify = async (token: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("E-mail verificado com sucesso! Redirecionando para o painel...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 2000);
      } else {
        setErrorMsg(data.error || "Link de ativação inválido ou expirado.");
      }
    } catch {
      setErrorMsg("Erro de conexão ao validar e-mail.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) {
      setErrorMsg("Preencha seu e-mail e o código de 6 dígitos.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("E-mail verificado com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(data.error || "Código incorreto ou expirado.");
      }
    } catch {
      setErrorMsg("Erro ao verificar código.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setErrorMsg("Informe seu e-mail para reenviar o código.");
      return;
    }
    setResending(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Novo código enviado para sua caixa de entrada!");
      } else {
        setErrorMsg(data.error || "Falha ao reenviar código.");
      }
    } catch {
      setErrorMsg("Erro ao solicitar reenvio.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-neutral-300 rounded p-6 space-y-4 shadow-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
            ✉️
          </div>
          <h1 className="text-lg font-bold text-neutral-900">Verifique seu E-mail</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Enviamos um código de confirmação para validar a veracidade da sua conta.
          </p>
        </div>

        {successMsg && (
          <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-center font-medium">
            ✅ {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 text-center">
            ❌ {errorMsg}
          </div>
        )}

        <form onSubmit={handleManualVerify} className="space-y-3">
          <Input
            id="email"
            type="email"
            label="Seu E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@empresa.com"
          />

          <Input
            id="code"
            label="Código de 6 dígitos"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
          />

          <Button type="submit" className="w-full" disabled={loading} isLoading={loading}>
            Confirmar E-mail & Acessar
          </Button>
        </form>

        <div className="pt-2 border-t border-neutral-200 flex flex-col space-y-2 text-center text-xs text-neutral-500">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-teal-700 font-medium hover:underline disabled:opacity-50"
          >
            {resending ? "Reenviando..." : "Não recebeu? Reenviar código"}
          </button>

          <Link href="/dashboard" className="text-neutral-500 hover:text-neutral-900">
            Ir para o painel de controle &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-neutral-500">Carregando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
