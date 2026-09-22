"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Building2,
  Lock,
  Mail,
  User,
} from "lucide-react";

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

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const otpRes = await fetch("/api/auth/whatsapp-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefone, code: codigoOtp, action: "VERIFY_CODE" }),
      });

      const otpData = await otpRes.json();
      if (!otpData.success) {
        setErrorMsg(otpData.error || "Código de verificação incorreto.");
        setLoading(false);
        return;
      }

      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empresaNome, nome, email, telefone, senha }),
      });

      const regData = await regRes.json();
      if (regData.success) {
        router.push("/dashboard");
      } else {
        setErrorMsg(regData.error || "Falha ao criar conta da empresa.");
      }
    } catch {
      setErrorMsg("Erro ao finalizar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-2.5 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] focus:bg-white transition";

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center items-center p-4 selection:bg-[#C1ED84] selection:text-[#2C2E2A]">
      <div className="w-full max-w-md">
        {/* Header Visual */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#2C2E2A] items-center justify-center font-extrabold text-[#C1ED84] text-2xl mb-4 shadow-lg">
            Ω
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#2C2E2A]">Criar Conta Comercial</h1>
          <p className="text-xs text-[#63695B] mt-1">
            Plataforma de Atendimento com IA, CRM & Atribuição de Tráfego Pago
          </p>
        </div>

        {/* Barra de Progresso */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="flex-1 h-1.5 rounded-full bg-[#C1ED84] border border-[#A5DC60]" />
          <div className={`flex-1 h-1.5 rounded-full transition-all ${step === 2 ? "bg-[#C1ED84] border border-[#A5DC60]" : "bg-[#E0E3DE]"}`} />
        </div>

        {/* Card de Formulário */}
        <div className="bg-white border border-[#E0E3DE] rounded-2xl p-7 shadow-sm space-y-5">
          <div className="border-b-4 border-[#C1ED84] pb-4 mb-1">
            <h2 className="font-serif font-bold text-lg text-[#2C2E2A]">
              {step === 1 ? "Dados da Empresa & Responsável" : "Verificação 2FA via WhatsApp"}
            </h2>
            <p className="text-xs text-[#63695B] mt-0.5">
              {step === 1
                ? "Etapa 1 de 2 — Preencha o formulário abaixo"
                : `Etapa 2 de 2 — Código enviado para ${telefone}`}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#E9BEC4] border border-red-200 text-[#9B2226] text-xs">
              {errorMsg}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-3.5">
              <div>
                <label className="text-[11px] text-[#2C2E2A] font-bold uppercase font-mono block mb-1">
                  Nome da sua Empresa / Negócio
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#7C8472] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: AutoPrime Seminovos"
                    value={empresaNome}
                    onChange={(e) => setEmpresaNome(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#2C2E2A] font-bold uppercase font-mono block mb-1">
                  Seu Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7C8472] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#2C2E2A] font-bold uppercase font-mono block mb-1">
                  E-mail de Acesso
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7C8472] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="carlos@autoprime.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#2C2E2A] font-bold uppercase font-mono block mb-1">
                  Seu WhatsApp (Receberá o código 2FA)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#7C8472] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="+55 11 99999-8888"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#2C2E2A] font-bold uppercase font-mono block mb-1">
                  Crie sua Senha (min. 6 caracteres)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7C8472] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#C1ED84] hover:bg-[#B2E372] text-[#2C2E2A] font-bold text-xs transition border border-[#A5DC60] flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#2C2E2A] border-t-transparent rounded-full animate-spin" />
                    Enviando Código...
                  </>
                ) : (
                  <>
                    Avançar para Verificação WhatsApp
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <div className="p-4 rounded-xl bg-[#DDE8DE] border border-[#C4D7C4] text-xs text-[#2C2E2A] flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#2C2E2A] font-bold">Código 2FA Enviado!</strong>
                  <span className="text-[#63695B]">
                    Enviamos um código de segurança de 6 dígitos para o WhatsApp <strong>{telefone}</strong>.
                  </span>
                  {debugOtp && (
                    <span className="block text-[#7C8472] font-mono text-[11px] mt-1">
                      Código de teste: <strong className="text-[#2D6A4F]">{debugOtp}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#2C2E2A] font-bold uppercase font-mono block mb-1">
                  Digite o Código de 6 Dígitos
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="000000"
                  value={codigoOtp}
                  onChange={(e) => setCodigoOtp(e.target.value)}
                  className="w-full text-center tracking-widest text-xl font-mono py-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || codigoOtp.length < 6}
                className="w-full py-3 rounded-xl bg-[#C1ED84] hover:bg-[#B2E372] text-[#2C2E2A] font-bold text-xs transition border border-[#A5DC60] flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#2C2E2A] border-t-transparent rounded-full animate-spin" />
                    Verificando e Ativando...
                  </>
                ) : (
                  <>
                    Confirmar e Entrar no Sistema <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs text-[#7C8472] hover:text-[#2C2E2A] pt-1 cursor-pointer"
              >
                ← Corrigir número de telefone
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-[#E0E3DE] text-center text-xs text-[#7C8472]">
            Já tem uma conta cadastrada?{" "}
            <Link href="/login" className="text-[#2C2E2A] font-bold hover:underline">
              Fazer Login
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
