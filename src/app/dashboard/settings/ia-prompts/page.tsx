"use client";

import { useState } from "react";
import { Bot, Sparkles, Sliders, Volume2, Save, CheckCircle2 } from "lucide-react";

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
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#00ddd7]" /> Inteligência Artificial, Tom de Voz & Presença
        </h1>
        <p className="text-xs text-gray-400">
          Personalize a identidade da IA, a velocidade de simulação humana (&ldquo;Digitando...&rdquo; e &ldquo;Gravando áudio...&rdquo;) e as regras de transbordo.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-6 shadow-xl">
        {saved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Configurações de IA salvas com sucesso!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nome do Agente */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Nome do Assistente Virtual</label>
            <input
              type="text"
              value={nomeAgente}
              onChange={(e) => setNomeAgente(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-[#00ddd7]"
            />
            <p className="text-[10px] text-gray-500 mt-1">Ex: &ldquo;Olá, sou a Aria, especialista da empresa...&rdquo;</p>
          </div>

          {/* Tom de Voz */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Tom de Voz</label>
            <select
              value={tomVoz}
              onChange={(e) => setTomVoz(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0a0d14] border border-[#252e42] rounded-xl text-xs text-white focus:outline-none focus:border-[#00ddd7]"
            >
              <option value="consultivo">Consultivo & Especialista (Recomendado)</option>
              <option value="persuasivo">Comercial & Foco em Fechamento</option>
              <option value="formal">Corporativo & Formal</option>
              <option value="descontraido">Amigável & Descontraído</option>
            </select>
          </div>
        </div>

        {/* Simulação de Presença Humana */}
        <div className="p-4 rounded-xl bg-[#161d2d] border border-[#252e42] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-400" /> Simulação de Áudio de Voz (PTT)
              </h4>
              <p className="text-[11px] text-gray-400">
                A IA envia áudios gravados na hora com status &ldquo;Gravando áudio...&rdquo; para aumentar a conversão.
              </p>
            </div>
            <input
              type="checkbox"
              checked={enviarAudioPtt}
              onChange={(e) => setEnviarAudioPtt(e.target.checked)}
              className="w-4 h-4 rounded text-[#00ddd7] focus:ring-0 bg-[#0a0d14] border-gray-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Delay Médio de Digitação / Gravação</span>
              <span className="font-mono text-[#00ddd7] font-bold">{delaySegundos} segundos</span>
            </div>
            <input
              type="range"
              min={3}
              max={25}
              value={delaySegundos}
              onChange={(e) => setDelaySegundos(Number(e.target.value))}
              className="w-full h-1.5 bg-[#0a0d14] rounded-lg appearance-none cursor-pointer accent-[#00ddd7]"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>3s (Instantâneo)</span>
              <span>12s (Natural)</span>
              <span>25s (Ultra Humanizado)</span>
            </div>
          </div>
        </div>

        {/* Transbordo Humano */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-300">
            Gatilho de Transbordo para Vendedor Humano
          </label>
          <div className="p-3 rounded-xl bg-[#0a0d14] border border-[#1e2638] text-xs text-gray-300 flex items-center justify-between">
            <span>Transferir automaticamente quando o Lead Score atingir:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">Score &gt;= {scoreTransbordo}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1e2638] flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black font-bold text-xs transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Salvar Regras de IA
          </button>
        </div>
      </form>
    </div>
  );
}
