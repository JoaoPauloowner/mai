"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [empresaNome, setEmpresaNome] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [codigoOtp, setCodigoOtp] = useState("");
  const [debugOtp, setDebugOtp] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/whatsapp-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefone, action: "REQUEST_CODE" }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.debugCode) setDebugOtp(data.debugCode);
        setStep(2);
      } else {
        setErrorMsg(data.error || "Falha ao enviar código");
      }
    } catch {
      setErrorMsg("Erro de conexão ao solicitar código.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresaNome,
          nome,
          email,
          telefone,
          senha,
          codigoOtp,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setErrorMsg(data.error || "Falha no cadastro.");
      }
    } catch {
      setErrorMsg("Erro ao processar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-neutral-300 rounded p-6 space-y-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900">Novo Cadastro</h1>
          <p className="text-xs text-neutral-500">Crie sua organização e inicie seu workspace</p>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-3">
            <Input
              id="empresa"
              label="Nome da Empresa / Workspace"
              required
              value={empresaNome}
              onChange={(e) => setEmpresaNome(e.target.value)}
              placeholder="Ex: Minha Empresa Ltda"
            />
            <Input
              id="nome"
              label="Seu Nome Completo"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João da Silva"
            />
            <Input
              id="email"
              type="email"
              label="Email Corporativo"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@empresa.com"
            />
            <Input
              id="telefone"
              label="WhatsApp com DDD"
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="+55 (11) 99999-9999"
            />
            <Input
              id="senha"
              type="password"
              label="Senha de Acesso"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />

            <Button type="submit" className="w-full" disabled={loading} isLoading={loading}>
              Verificar via WhatsApp &gt;
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-600">
              Código de confirmação enviado para <strong>{telefone}</strong>.
              {debugOtp && (
                <div className="mt-1 font-mono text-[11px] text-neutral-800">
                  Código de teste: <strong>{debugOtp}</strong>
                </div>
              )}
            </div>

            <Input
              id="codigoOtp"
              label="Código de 6 dígitos"
              required
              maxLength={6}
              value={codigoOtp}
              onChange={(e) => setCodigoOtp(e.target.value)}
              placeholder="000000"
            />

            <Button type="submit" className="w-full" disabled={loading} isLoading={loading}>
              Concluir Cadastro & Entrar
            </Button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-xs text-neutral-500 hover:text-neutral-900"
            >
              &larr; Voltar e alterar dados
            </button>
          </form>
        )}

        <div className="pt-2 text-center text-xs text-neutral-500">
          Já possui conta?{" "}
          <Link href="/login" className="text-neutral-900 font-medium underline">
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
