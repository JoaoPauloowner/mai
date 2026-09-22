"use client";

import { useState } from "react";
import { Bot, Sparkles, Sliders, Volume2, Save, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SettingsIaPromptsPage() {
  const [nomeAgente, setNomeAgente] = useState("Aria");
  const [tomVoz, setTomVoz] = useState("consultivo");
  const [delaySegundos, setDelaySegundos] = useState(8);
  const [enviarAudioPtt, setEnviarAudioPtt] = useState(true);
  const [scoreTransbordo, setScoreTransbordo] = useState(80);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E7EBE6] text-[#2C2E2A] text-xs font-medium border border-[#D0D5CD] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#7A8E75]" /> Regras de Atendimento Inteligente
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2C2E2A]">
          Inteligência Artificial, Tom de Voz & Presença
        </h1>
        <p className="text-xs text-[#63695B] mt-1">
          Personalize a identidade da IA, a velocidade de simulação humana (&ldquo;Digitando...&rdquo; e &ldquo;Gravando áudio...&rdquo;) e os gatilhos de transbordo.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Personalidade & Conduta</CardTitle>
            <CardDescription>
              Ajuste como a assistente virtual interage com os leads no WhatsApp e Instagram Direct.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {saved && (
              <div className="p-4 rounded-xl bg-[#DDE8DE] border border-[#C4D7C4] text-[#2D6A4F] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Configurações de IA salvas com sucesso!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nome do Agente */}
              <div>
                <label className="block text-xs font-bold text-[#2C2E2A] mb-1.5">
                  Nome do Assistente Virtual
                </label>
                <input
                  type="text"
                  value={nomeAgente}
                  onChange={(e) => setNomeAgente(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] focus:ring-1 focus:ring-[#7A8E75] transition"
                />
                <p className="text-[10px] text-[#7C8472] mt-1">
                  Ex: &ldquo;Olá, sou a Aria, especialista da empresa...&rdquo;
                </p>
              </div>

              {/* Tom de Voz */}
              <div>
                <label className="block text-xs font-bold text-[#2C2E2A] mb-1.5">
                  Tom de Voz Predominante
                </label>
                <select
                  value={tomVoz}
                  onChange={(e) => setTomVoz(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E0E3DE] rounded-xl text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] focus:ring-1 focus:ring-[#7A8E75] transition"
                >
                  <option value="consultivo">Consultivo & Especialista (Recomendado)</option>
                  <option value="persuasivo">Comercial & Foco em Fechamento</option>
                  <option value="formal">Corporativo & Formal</option>
                  <option value="descontraido">Amigável & Descontraído</option>
                </select>
              </div>
            </div>

            {/* Simulação de Presença Humana */}
            <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-[#E0E3DE] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#2C2E2A] flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-[#7A8E75]" /> Simulação de Áudio de Voz (PTT Humanizado)
                  </h4>
                  <p className="text-[11px] text-[#63695B]">
                    A IA envia áudios gravados na hora com status &ldquo;Gravando áudio...&rdquo; para aumentar a conversão.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enviarAudioPtt}
                  onChange={(e) => setEnviarAudioPtt(e.target.checked)}
                  className="w-4 h-4 rounded text-[#7A8E75] focus:ring-0 accent-[#7A8E75] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#2C2E2A] font-medium mb-1">
                  <span>Delay Médio de Digitação / Gravação</span>
                  <span className="font-mono text-[#2D6A4F] font-bold">{delaySegundos} segundos</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={25}
                  value={delaySegundos}
                  onChange={(e) => setDelaySegundos(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#E0E3DE] rounded-lg appearance-none cursor-pointer accent-[#7A8E75]"
                />
                <div className="flex justify-between text-[10px] text-[#7C8472] font-mono mt-1">
                  <span>3s (Instantâneo)</span>
                  <span>12s (Natural)</span>
                  <span>25s (Ultra Humanizado)</span>
                </div>
              </div>
            </div>

            {/* Transbordo Humano */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#2C2E2A]">
                Gatilho de Transbordo para Vendedor Humano
              </label>
              <div className="p-3.5 rounded-xl bg-[#F5F5F5] border border-[#E0E3DE] text-xs text-[#2C2E2A] flex items-center justify-between">
                <span>Transferir automaticamente para a equipe comercial quando o Lead Score atingir:</span>
                <span className="font-mono font-bold text-[#2D6A4F] text-sm bg-white px-2.5 py-1 rounded-lg border border-[#E0E3DE]">
                  Score &gt;= {scoreTransbordo}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E0E3DE] flex justify-end">
              <Button type="submit" variant="primary">
                <Save className="w-4 h-4" /> Salvar Regras de IA
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
