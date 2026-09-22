"use client";

import { useState } from "react";
import { PhoneCall, Sparkles, Volume2, PhoneOff, Mic, Play, CheckCircle2, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LigacoesVapiPage() {
  const [inCall, setInCall] = useState(false);
  const [seguradoTelefone, setSeguradoTelefone] = useState("+55 (11) 98877-6655");
  const [seguradoNome, setSeguradoNome] = useState("Eduardo Silveira");
  const [statusCall, setStatusCall] = useState<string>("Pronto para discar");
  const [transcricao, setTranscricao] = useState<Array<{ remetente: string; texto: string }>>([]);

  const handleIniciarLigacao = () => {
    setInCall(true);
    setStatusCall("Chamando segurado...");
    setTranscricao([]);

    setTimeout(() => {
      setStatusCall("Em chamada (IA conversando)");
      setTranscricao((prev) => [
        ...prev,
        {
          remetente: "IA Sofia (Vapi)",
          texto: `Olá ${seguradoNome}! Sou a Sofia da sua Corretora de Seguros. Estou ligando porque sua apólice do Honda Civic vence em 7 dias. Gostaria de manter as mesmas coberturas na renovação?`,
        },
      ]);
    }, 1500);

    setTimeout(() => {
      setTranscricao((prev) => [
        ...prev,
        {
          remetente: "Eduardo Silveira",
          texto: "Oi Sofia! Sim, quero manter sim, mas queria saber se o valor aumentou muito em relação ao ano passado.",
        },
      ]);
    }, 3500);

    setTimeout(() => {
      setTranscricao((prev) => [
        ...prev,
        {
          remetente: "IA Sofia (Vapi)",
          texto: "Conseguimos manter com a Porto Seguro exatamente com o mesmo desconto de classe de bônus! Vou te transferir agora para o corretor responsável finalizar a emissão.",
        },
      ]);
      setStatusCall("Transferindo para Corretor Humano...");
    }, 5500);
  };

  const handleEncerrar = () => {
    setInCall(false);
    setStatusCall("Chamada finalizada");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DDE8DE] text-[#2D6A4F] text-xs font-bold border border-[#C4D7C4] mb-2">
          <PhoneCall className="w-3.5 h-3.5" /> Módulo Corretora de Seguros
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2C2E2A]">
          Ligações Ativas com IA de Voz (Vapi.ai Engine)
        </h1>
        <p className="text-xs text-[#63695B] mt-1">
          Agente de voz que liga para o segurado no momento em que a apólice entra na janela crítica de renovação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Painel de Controle de Discagem */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Console de Discagem</CardTitle>
            <CardDescription>Configure o destinatário para chamada ativa de voz</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2C2E2A] mb-1">Nome do Segurado</label>
              <input
                type="text"
                value={seguradoNome}
                onChange={(e) => setSeguradoNome(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C2E2A] mb-1">Telefone com DDD</label>
              <input
                type="text"
                value={seguradoTelefone}
                onChange={(e) => setSeguradoTelefone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0E3DE] rounded-xl text-xs font-mono text-[#2C2E2A]"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs">
              <span className="text-[10px] text-[#7C8472] uppercase font-mono block">Status do Tronco SIP</span>
              <span className="font-bold text-[#2D6A4F]">{statusCall}</span>
            </div>

            {!inCall ? (
              <Button
                type="button"
                variant="primary"
                className="w-full"
                onClick={handleIniciarLigacao}
              >
                <PhoneCall className="w-4 h-4" /> Disparar Ligação IA
              </Button>
            ) : (
              <button
                type="button"
                onClick={handleEncerrar}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <PhoneOff className="w-4 h-4" /> Desligar Chamada
              </button>
            )}
          </CardContent>
        </Card>

        {/* Transcrição em Tempo Real */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transcrição da Chamada em Tempo Real</CardTitle>
              <CardDescription>Áudio processado e transcrito pelo pipeline Whisper / Vapi</CardDescription>
            </div>
            {inCall && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E9BEC4] text-[#9B2226] text-xs font-bold border border-red-200 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600" /> Gravação Ativa
              </span>
            )}
          </CardHeader>

          <CardContent>
            {transcricao.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#7C8472]">
                Inicie uma ligação para ver a transcrição ao vivo da conversa entre o robô de voz e o cliente.
              </div>
            ) : (
              <div className="space-y-3">
                {transcricao.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                      t.remetente.includes("IA")
                        ? "bg-[#DDE8DE] border border-[#C4D7C4] text-[#2C2E2A]"
                        : "bg-[#F5F5F5] border border-[#E0E3DE] text-[#2C2E2A]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className={t.remetente.includes("IA") ? "text-[#2D6A4F]" : "text-[#2C2E2A]"}>
                        {t.remetente}
                      </span>
                    </div>
                    <p className="leading-relaxed">{t.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
