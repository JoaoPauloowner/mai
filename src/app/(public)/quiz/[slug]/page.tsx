"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Sparkles, ArrowRight, CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react";

export default function PublicQuizPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || "omni-demo";

  const utmSource = searchParams.get("utm_source") || "instagram_ads";
  const utmCampaign = searchParams.get("utm_campaign") || "campanha_trafego_pago";
  const utmMedium = searchParams.get("utm_medium") || "stories";

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    interessePrincipal: "",
    urgencia: "",
  });

  const [quizConfig, setQuizConfig] = useState({
    titulo: "Diagnóstico Especializado",
    subtitulo: "Responda em 1 minuto para receber uma proposta e simulação personalizada.",
    step1: {
      titulo: "Qual a sua principal necessidade no momento?",
      opcoes: [
        "Aquisição / Compra com as melhores condições",
        "Redução de custos e otimização fiscal/seguros",
        "Consultoria ou agendamento para esta semana",
        "Comparativo completo de propostas de mercado",
      ],
    },
    step2: {
      titulo: "Qual é a urgência para a sua decisão?",
      opcoes: [
        "Urgente: Quero resolver ainda nesta semana",
        "Próximos 15 a 30 dias",
        "Apenas pesquisando e comparando valores",
      ],
    },
    botaoCta: "Receber Atendimento Prioritário",
    mensagemSucesso: "Nossa equipe e assistente de IA já estão preparando seu atendimento.",
  });

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [companyWhatsapp, setCompanyWhatsapp] = useState("");

  useEffect(() => {
    fetch(`/api/quiz/config?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.config) setQuizConfig(data.config);
        if (data.whatsappNumber) setCompanyWhatsapp(data.whatsappNumber);
      })
      .catch(() => {});
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          nome,
          telefone,
          email,
          answers,
          utmSource,
          utmCampaign,
          utmMedium,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.whatsappNumber) setCompanyWhatsapp(data.whatsappNumber);
        setCompleted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col justify-center items-center p-4 selection:bg-[#00ddd7] selection:text-black">
      <div className="w-full max-w-lg">
        {/* Header Visual */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00ddd7] to-[#3b82f6] items-center justify-center font-bold text-black text-2xl mb-3 shadow-[0_0_25px_rgba(0,221,215,0.3)]">
            Ω
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{quizConfig.titulo}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {quizConfig.subtitulo}
          </p>
        </div>

        {/* Card do Quiz */}
        <div className="bg-[#111622] border border-[#1e2638] rounded-2xl p-7 shadow-2xl relative overflow-hidden">
          {/* Barra de Progresso */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#161d2d]">
            <div
              className="h-full bg-gradient-to-r from-[#00ddd7] to-[#3b82f6] transition-all duration-300"
              style={{
                width: completed ? "100%" : `${(step / 3) * 100}%`,
              }}
            />
          </div>

          {!completed ? (
            <div>
              {/* Etapa 1 */}
              {step === 1 && (
                <div className="space-y-4 pt-2">
                  <span className="text-[10px] font-mono text-[#00ddd7] uppercase tracking-wider block">
                    Etapa 1 de 3: Objetivo Principal
                  </span>
                  <h2 className="text-lg font-bold text-white">
                    {quizConfig.step1.titulo}
                  </h2>

                  <div className="space-y-2.5 pt-2">
                    {quizConfig.step1.opcoes.map((opcao) => (
                      <button
                        key={opcao}
                        type="button"
                        onClick={() => {
                          setAnswers({ ...answers, interessePrincipal: opcao });
                          setStep(2);
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition ${
                          answers.interessePrincipal === opcao
                            ? "bg-[#1c2438] border-[#00ddd7] text-white"
                            : "bg-[#161d2d] border-[#252e42] text-gray-300 hover:border-[#00ddd7]"
                        }`}
                      >
                        {opcao}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Etapa 2 */}
              {step === 2 && (
                <div className="space-y-4 pt-2">
                  <span className="text-[10px] font-mono text-[#00ddd7] uppercase tracking-wider block">
                    Etapa 2 de 3: Prazo & Urgência
                  </span>
                  <h2 className="text-lg font-bold text-white">
                    {quizConfig.step2.titulo}
                  </h2>

                  <div className="space-y-2.5 pt-2">
                    {quizConfig.step2.opcoes.map((opcao) => (
                      <button
                        key={opcao}
                        type="button"
                        onClick={() => {
                          setAnswers({ ...answers, urgencia: opcao });
                          setStep(3);
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition ${
                          answers.urgencia === opcao
                            ? "bg-[#1c2438] border-[#00ddd7] text-white"
                            : "bg-[#161d2d] border-[#252e42] text-gray-300 hover:border-[#00ddd7]"
                        }`}
                      >
                        {opcao}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Etapa 3 */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <span className="text-[10px] font-mono text-[#00ddd7] uppercase tracking-wider block">
                    Etapa 3 de 3: Finalização
                  </span>
                  <h2 className="text-lg font-bold text-white">
                    Onde devemos enviar o seu atendimento personalizado?
                  </h2>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Seu Nome Completo</label>
                      <input
                        type="text"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: Amanda Silva"
                        className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">WhatsApp com DDD</label>
                      <input
                        type="tel"
                        required
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="(11) 99999-8888"
                        className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">E-mail (opcional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-4 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      "Calculando diagnóstico..."
                    ) : (
                      <>
                        {quizConfig.botaoCta} <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Tela de Sucesso */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <h2 className="text-xl font-bold text-white">Solicitação Recebida com Sucesso!</h2>
              <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                {quizConfig.mensagemSucesso}
              </p>

              <div className="pt-4">
                <a
                  href={`https://wa.me/${companyWhatsapp.replace(/\D/g, "")}?text=Olá! Acabei de preencher o diagnóstico pelo site e gostaria de falar com um especialista.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" /> Abrir Conversa no WhatsApp Agora
                </a>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[#1e2638] flex items-center justify-center gap-2 text-[10px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dados 100% protegidos e confidenciais conforme a LGPD.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
