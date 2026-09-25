"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react";

export default function PublicQuizPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || "omni-demo";

  const utmSource = searchParams.get("utm_source") || "instagram_ads";
  const utmCampaign = searchParams.get("utm_campaign") || "campanha_trafego_pago";
  const utmMedium = searchParams.get("utm_medium") || "stories";

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ interessePrincipal: "", urgencia: "" });

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
        body: JSON.stringify({ slug, nome, telefone, email, answers, utmSource, utmCampaign, utmMedium }),
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

  const inputClass =
    "w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition";

  const progressPct = completed ? 100 : Math.round((step / 3) * 100);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg">
        {/* Header Visual */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-zinc-900 items-center justify-center font-bold text-white text-lg mb-4 shadow-sm">
            Q
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{quizConfig.titulo}</h1>
          <p className="text-sm text-zinc-600 mt-1 max-w-sm mx-auto">{quizConfig.subtitulo}</p>
        </div>

        {/* Card do Quiz */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Barra de Progresso */}
          <div className="h-1.5 bg-zinc-100">
            <div
              className="h-full bg-zinc-900 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="p-7">
            {!completed ? (
              <div>
                {/* Etapa 1 */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                        Etapa 1 de 3: Objetivo Principal
                      </span>
                      <h2 className="text-lg font-bold text-zinc-900">
                        {quizConfig.step1.titulo}
                      </h2>
                    </div>

                    <div className="space-y-2.5">
                      {quizConfig.step1.opcoes.map((opcao) => (
                        <button
                          key={opcao}
                          type="button"
                          onClick={() => {
                            setAnswers({ ...answers, interessePrincipal: opcao });
                            setStep(2);
                          }}
                          className="w-full p-4 rounded-xl border text-left text-sm font-medium transition-all hover:border-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 border-zinc-200 text-zinc-900"
                        >
                          {opcao}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Etapa 2 */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                        Etapa 2 de 3: Prazo & Urgência
                      </span>
                      <h2 className="text-lg font-bold text-zinc-900">
                        {quizConfig.step2.titulo}
                      </h2>
                    </div>

                    <div className="space-y-2.5">
                      {quizConfig.step2.opcoes.map((opcao) => (
                        <button
                          key={opcao}
                          type="button"
                          onClick={() => {
                            setAnswers({ ...answers, urgencia: opcao });
                            setStep(3);
                          }}
                          className="w-full p-4 rounded-xl border text-left text-sm font-medium transition-all hover:border-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 border-zinc-200 text-zinc-900"
                        >
                          {opcao}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Etapa 3 */}
                {step === 3 && (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                        Etapa 3 de 3: Finalização
                      </span>
                      <h2 className="text-lg font-bold text-zinc-900">
                        Onde devemos enviar o seu atendimento personalizado?
                      </h2>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-zinc-900 mb-1.5">Seu Nome Completo</label>
                        <input
                          type="text"
                          required
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          placeholder="Ex: Amanda Silva"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-900 mb-1.5">WhatsApp com DDD</label>
                        <input
                          type="tel"
                          required
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          placeholder="(11) 99999-8888"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-900 mb-1.5">E-mail (opcional)</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu@email.com"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Calculando diagnóstico...
                        </>
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
              <div className="text-center py-6 space-y-5">
                <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-zinc-900">
                    Solicitação Recebida!
                  </h2>
                  <p className="text-sm text-zinc-600 max-w-sm mx-auto mt-2 leading-relaxed">
                    {quizConfig.mensagemSucesso}
                  </p>
                </div>

                <a
                  href={`https://wa.me/${companyWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá! Sou ${nome} e acabei de concluir o diagnóstico no site. Gostaria de dar andamento no atendimento.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" /> Conversar no WhatsApp Agora
                </a>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-center gap-2 text-[10px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Dados 100% protegidos e confidenciais conforme a LGPD.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
