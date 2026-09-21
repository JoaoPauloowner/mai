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

  // Etapa 1: Dados da Empresa e Dono | Etapa 2: Código 2FA WhatsApp
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form
  const [empresaNome, setEmpresaNome] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [codigoOtp, setCodigoOtp] = useState("");
  const [debugOtp, setDebugOtp] = useState("");

  // Submissão da Etapa 1 (Disparo do Código OTP WhatsApp)
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/whatsapp-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telefone,
          action: "REQUEST_CODE",
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.debugCode) setDebugOtp(data.debugCode);
        setStep(2);
      } else {
        setErrorMsg(data.error || "Falha ao enviar código");
      }
    } catch (e) {
      setErrorMsg("Erro de conexão ao solicitar código.");
    } finally {
      setLoading(false);
    }
  };

  // Submissão da Etapa 2 (Validação do OTP + Criação do Tenant)
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1. Valida o código OTP
      const otpRes = await fetch("/api/auth/whatsapp-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telefone,
          code: codigoOtp,
          action: "VERIFY_CODE",
        }),
      });

      const otpData = await otpRes.json();
      if (!otpData.success) {
        setErrorMsg(otpData.error || "Código de verificação incorreto.");
        setLoading(false);
        return;
      }

      // 2. Cria a Organização e o Usuário Administrador
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresaNome,
          nome,
          email,
          telefone,
          senha,
        }),
      });

      const regData = await regRes.json();
      if (regData.success) {
        router.push("/dashboard");
      } else {
        setErrorMsg(regData.error || "Falha ao criar conta da empresa.");
      }
    } catch (e) {
      setErrorMsg("Erro ao finalizar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col justify-center items-center p-4 selection:bg-[#00ddd7] selection:text-black">
      <div className="w-full max-w-md">
        {/* Header Visual */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00ddd7] to-[#3b82f6] items-center justify-center font-bold text-black text-2xl mb-3 shadow-[0_0_25px_rgba(0,221,215,0.3)]">
            Ω
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Criar Conta Comercial</h1>
          <p className="text-xs text-gray-400 mt-1">
            Plataforma de Atendimento com IA, CRM & Atribuição de Tráfego Pago
          </p>
        </div>

        {/* Card de Formulário */}
        <div className="bg-[#111622] border border-[#1e2638] rounded-2xl p-7 shadow-2xl space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {errorMsg}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                  Nome da sua Empresa / Negócio
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: AutoPrime Seminovos"
                    value={empresaNome}
                    onChange={(e) => setEmpresaNome(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                  Seu Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                  E-mail de Acesso
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="carlos@autoprime.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                  Seu WhatsApp (Receberá o código 2FA)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="+55 11 99999-8888"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                  Crie sua Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-[#00ddd7]/20 disabled:opacity-50"
              >
                {loading ? "Enviando Código..." : "Avançar para Verificação WhatsApp"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Código 2FA Enviado!</strong>
                  Enviamos um código de segurança de 6 dígitos para o WhatsApp <strong>{telefone}</strong>.
                  {debugOtp && (
                    <span className="block text-gray-400 font-mono text-[11px] mt-1">
                      Código de teste: <strong className="text-emerald-400">{debugOtp}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                  Digite o Código de 6 Dígitos
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="000000"
                  value={codigoOtp}
                  onChange={(e) => setCodigoOtp(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono py-2.5 rounded-xl bg-[#161d2d] border border-[#252e42] text-white focus:outline-none focus:border-[#00ddd7]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || codigoOtp.length < 6}
                className="w-full py-3 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-[#00ddd7]/20 disabled:opacity-50"
              >
                {loading ? "Verificando e Ativando..." : "Confirmar e Entrar no Sistema"}
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs text-gray-400 hover:text-white pt-1"
              >
                ← Corrigir número de telefone
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-[#1e2638] text-center text-xs text-gray-400">
            Já tem uma conta cadastrada?{" "}
            <Link href="/login" className="text-[#00ddd7] hover:underline font-semibold">
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
