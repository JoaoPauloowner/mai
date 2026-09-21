"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  Smile,
  Paperclip,
  CheckCheck,
  Phone,
  Sparkles,
  Play,
  Pause,
  Clock,
  ExternalLink,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

// Sanitizador para garantir que caracteres corrompidos antigos sejam corrigidos na visualização
function cleanCorruptedText(text: string): string {
  if (!text) return "";
  return text
    .replace(/Aquisio|Aquisio|Aquisio/gi, "Aquisição")
    .replace(/condies|condies|condies/gi, "condições")
    .replace(/Deciso|Deciso|Deciso/gi, "Decisão")
    .replace(/Otimizao|Otimizao/gi, "Otimização")
    .replace(/Simulao|Simulao/gi, "Simulação")
    .replace(/Urgencia|Urgncia/gi, "Urgência")
    .replace(/\uFFFD/g, "");
}

interface MessageItem {
  id: string;
  remetenteTipo: string;
  tipoConteudo: string;
  conteudo: string;
  audioDuration?: number | null;
  createdAt: string | Date;
}

interface ConversationItem {
  id: string;
  canal: string;
  status: string;
  ultimoContato: string | Date;
  lead: {
    id: string;
    nome: string;
    telefone: string;
    email?: string | null;
    score: number;
    scoreJustificativa?: string | null;
    origemCanal: string;
    utmCampaign?: string | null;
    directKeyword?: string | null;
    ramoInteresse?: string | null;
  };
  messages: MessageItem[];
}

export function InboxClient({
  initialConversations,
}: {
  initialConversations: ConversationItem[];
}) {
  const [conversations, setConversations] = useState<ConversationItem[]>(
    initialConversations
  );
  const [activeId, setActiveId] = useState<string>(
    initialConversations[0]?.id || ""
  );
  const [inputText, setInputText] = useState("");
  const [isSimulatingPresence, setIsSimulatingPresence] = useState(false);
  const [presenceText, setPresenceText] = useState("");
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);

  const [channelFilter, setChannelFilter] = useState<"ALL" | "WHATSAPP" | "INSTAGRAM">("ALL");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const whatsCount = conversations.filter((c) => c.canal === "WHATSAPP").length;
  const instaCount = conversations.filter((c) => c.canal === "INSTAGRAM").length;

  const filteredConversations = conversations.filter((c) =>
    channelFilter === "ALL" ? true : c.canal === channelFilter
  );

  const activeConv =
    conversations.find((c) => c.id === activeId) || filteredConversations[0] || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages, isSimulatingPresence]);

  const handleSendMessage = async (
    tipo: "TEXTO" | "AUDIO_PTT",
    customContent?: string,
    audioDuration?: number
  ) => {
    const textToSend = customContent || inputText.trim();
    if (!textToSend && tipo === "TEXTO") return;

    if (!activeConv) return;

    // Se for áudio PTT, simula "Gravando áudio..." por 2.5 segundos
    if (tipo === "AUDIO_PTT") {
      setIsSimulatingPresence(true);
      setPresenceText("🎙️ Gravando áudio...");
      await new Promise((r) => setTimeout(r, 2200));
      setIsSimulatingPresence(false);
      setPresenceText("");
    }

    try {
      const res = await fetch(`/api/conversations/${activeConv.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conteudo: textToSend,
          tipoConteudo: tipo,
          audioDuration: audioDuration || 14,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const newMsg: MessageItem = data.message;
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === activeConv.id) {
              return {
                ...c,
                messages: [...c.messages, newMsg],
                ultimoContato: new Date(),
              };
            }
            return c;
          })
        );
        setInputText("");
      }
    } catch (e) {
      console.error("Erro ao enviar:", e);
    }
  };

  const simulatePttRecord = () => {
    handleSendMessage(
      "AUDIO_PTT",
      "Áudio de voz enviado (Simulação PTT humanizada)",
      16
    );
  };

  return (
    <div className="h-[calc(100vh-140px)] rounded-2xl bg-[#111622] border border-[#1e2638] flex overflow-hidden shadow-2xl">
      {/* 1. Coluna Esquerda: Lista de Conversas */}
      <div className="w-84 border-r border-[#1e2638] flex flex-col bg-[#0a0d14]/60">
        <div className="p-3.5 border-b border-[#1e2638] space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Caixa de Entrada
            </h2>
            <span className="text-[10px] font-mono text-[#00ddd7] bg-[#00ddd7]/10 px-2 py-0.5 rounded-full">
              {filteredConversations.length} conversas
            </span>
          </div>

          {/* Abas das 2 Caixas de Entrada */}
          <div className="grid grid-cols-3 gap-1 bg-[#0c101a] p-1 rounded-xl border border-[#1e2638] text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setChannelFilter("ALL")}
              className={`py-1.5 px-2 rounded-lg transition text-center ${
                channelFilter === "ALL"
                  ? "bg-[#1c2438] text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Todos ({conversations.length})
            </button>

            <button
              type="button"
              onClick={() => setChannelFilter("WHATSAPP")}
              className={`py-1.5 px-2 rounded-lg transition text-center flex items-center justify-center gap-1 ${
                channelFilter === "WHATSAPP"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-emerald-400 hover:bg-[#161d2d]"
              }`}
            >
              <span>💬 WA</span>
              <span className="text-[10px] opacity-80 font-mono">({whatsCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setChannelFilter("INSTAGRAM")}
              className={`py-1.5 px-2 rounded-lg transition text-center flex items-center justify-center gap-1 ${
                channelFilter === "INSTAGRAM"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm"
                  : "text-pink-400 hover:bg-[#161d2d]"
              }`}
            >
              <span>📸 Direct</span>
              <span className="text-[10px] opacity-80 font-mono">({instaCount})</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#1e2638]/50">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500 space-y-1">
              <div>Nenhuma conversa no canal selecionado.</div>
              <div className="text-[10px] text-gray-600">Alterne para a aba "Todos" para ver todas as mensagens.</div>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeId;
              const lastMsg = conv.messages[conv.messages.length - 1];

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition ${
                    isActive
                      ? "bg-[#1c2438] border-l-2 border-[#00ddd7]"
                      : "hover:bg-[#161d2d]"
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#1e2638] text-white flex items-center justify-center font-bold text-sm border border-[#2e3b54]">
                      {conv.lead.nome.charAt(0)}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#111622] flex items-center justify-center text-[10px]">
                      {conv.canal === "INSTAGRAM" ? "📸" : "💬"}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">
                        {conv.lead.nome}
                      </h4>
                      {conv.canal === "INSTAGRAM" ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center gap-1 shrink-0">
                          <InstagramIcon className="w-3 h-3" /> Instagram
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shrink-0">
                          💬 WhatsApp
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      {lastMsg
                        ? lastMsg.tipoConteudo === "AUDIO_PTT"
                          ? "🎙️ Mensagem de voz PTT"
                          : lastMsg.conteudo
                        : "Nova conversa iniciada"}
                    </p>

                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#161d2d] text-gray-400 border border-[#252e42]">
                        {conv.lead.origemCanal}
                      </span>
                      {conv.lead.directKeyword && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/30">
                          #{conv.lead.directKeyword}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Coluna Central: Thread de Mensagens */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-[#0c101a] min-w-0">
          {/* Header do Chat */}
          <div className="p-4 border-b border-[#1e2638] bg-[#111622]/80 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1c2438] text-[#00ddd7] flex items-center justify-center font-bold text-sm">
                {activeConv.lead.nome.charAt(0)}
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{activeConv.lead.nome}</span>
                  {activeConv.canal === "INSTAGRAM" ? (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/40 font-mono font-bold flex items-center gap-1">
                      <InstagramIcon className="w-3.5 h-3.5" /> Falando pelo Instagram Direct
                    </span>
                  ) : (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold flex items-center gap-1">
                      💬 Falando pelo WhatsApp Oficial
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {activeConv.lead.telefone} • {activeConv.lead.ramoInteresse || "Interesse Geral"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${activeConv.lead.telefone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Abrir no WA
              </a>
            </div>
          </div>

          {/* Área das Mensagens com Scroll */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {activeConv.messages.map((msg) => {
              const isLead = msg.remetenteTipo === "LEAD";
              const isAudio = msg.tipoConteudo === "AUDIO_PTT";

              return (
                <div
                  key={msg.id}
                  className={`flex ${isLead ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl p-3.5 text-xs shadow-md ${
                      isLead
                        ? "bg-[#161d2d] border border-[#252e42] text-gray-200 rounded-tl-sm"
                        : "bg-gradient-to-br from-[#00b4b0] to-[#00938f] text-black font-medium rounded-tr-sm"
                    }`}
                  >
                    {isAudio ? (
                      /* Reprodutor de Áudio PTT com Onda Sonora Estilo WhatsApp */
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <button
                          type="button"
                          onClick={() =>
                            setIsPlayingAudioId(
                              isPlayingAudioId === msg.id ? null : msg.id
                            )
                          }
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-sm ${
                            isLead
                              ? "bg-[#00ddd7] text-black"
                              : "bg-black/20 text-black hover:bg-black/30"
                          }`}
                        >
                          {isPlayingAudioId === msg.id ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center gap-1 h-5">
                            <span className="w-1 bg-current rounded-full animate-soundwave-1" />
                            <span className="w-1 bg-current rounded-full animate-soundwave-2" />
                            <span className="w-1 bg-current rounded-full animate-soundwave-3" />
                            <span className="w-1 bg-current rounded-full animate-soundwave-4" />
                            <span className="w-1 bg-current rounded-full animate-soundwave-5" />
                            <span className="w-1 bg-current rounded-full animate-soundwave-2" />
                            <span className="w-1 bg-current rounded-full animate-soundwave-1" />
                            <span className="w-1 bg-current rounded-full animate-soundwave-4" />
                            <span className="w-1 bg-current rounded-full animate-soundwave-3" />
                          </div>
                          <div className="flex justify-between items-center text-[10px] opacity-80 mt-1 font-mono">
                            <span>0:{msg.audioDuration || 14}</span>
                            <span className="uppercase text-[9px]">Áudio PTT</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {cleanCorruptedText(msg.conteudo)}
                      </p>
                    )}

                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        isLead ? "text-gray-400" : "text-black/70"
                      }`}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {!isLead && <CheckCheck className="w-3 h-3 ml-0.5" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Simulação de Presença Ativa */}
            {isSimulatingPresence && (
              <div className="flex justify-end">
                <div className="px-3 py-1.5 rounded-full bg-[#161d2d] border border-[#2e3b54] text-xs text-[#00ddd7] flex items-center gap-2 animate-pulse">
                  <span>{presenceText}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Barra Inferior de Input com Simulação PTT */}
          <div className="p-3 border-t border-[#1e2638] bg-[#111622] space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage("TEXTO");
                  }
                }}
                placeholder="Escreva uma mensagem ou simule áudio PTT..."
                className="flex-1 bg-[#0a0d14] border border-[#252e42] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00ddd7] transition"
              />

              <button
                type="button"
                onClick={() => handleSendMessage("TEXTO")}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black font-bold transition disabled:opacity-30"
                title="Enviar Texto"
              >
                <Send className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={simulatePttRecord}
                className="px-3 py-2.5 rounded-xl bg-[#161d2d] border border-[#2e3b54] hover:border-emerald-500 hover:text-emerald-400 text-gray-300 text-xs font-medium transition flex items-center gap-1.5 shadow-sm"
                title="Simular Gravação de Áudio PTT no WhatsApp"
              >
                <Mic className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Simular Áudio PTT</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 3. Coluna Direita: Ficha Expressa do Lead */}
      {activeConv && (
        <div className="w-72 border-l border-[#1e2638] p-5 overflow-y-auto bg-[#0a0d14]/40 hidden lg:block space-y-5">
          <div className="text-center pb-4 border-b border-[#1e2638]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00ddd7] to-[#3b82f6] text-black text-2xl font-black mx-auto flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,221,215,0.25)]">
              {activeConv.lead.nome.charAt(0)}
            </div>
            <h4 className="font-bold text-sm text-white">{activeConv.lead.nome}</h4>
            <p className="text-xs text-gray-400">{activeConv.lead.telefone}</p>
          </div>

          {/* Lead Score da IA */}
          <div className="p-3.5 rounded-xl bg-[#161d2d] border border-[#252e42] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">Lead Score (IA)</span>
              <span className="font-mono font-bold text-emerald-400">
                {activeConv.lead.score}/100
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#1c2438] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${activeConv.lead.score}%` }}
              />
            </div>
            {activeConv.lead.scoreJustificativa && (
              <p className="text-[10px] text-gray-400 leading-tight pt-1">
                &ldquo;{activeConv.lead.scoreJustificativa}&rdquo;
              </p>
            )}
          </div>

          {/* Metadados de Atribuição */}
          <div className="space-y-2.5 text-xs">
            <h5 className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
              Atribuição de Marketing
            </h5>

            <div className="p-2.5 rounded-lg bg-[#111622] border border-[#1e2638] space-y-1">
              <div className="text-[10px] text-gray-500">Canal de Origem</div>
              <div className="font-semibold text-white">{activeConv.lead.origemCanal}</div>
            </div>

            {activeConv.lead.utmCampaign && (
              <div className="p-2.5 rounded-lg bg-[#111622] border border-[#1e2638] space-y-1">
                <div className="text-[10px] text-gray-500">Campanha Tráfego Pago</div>
                <div className="font-mono text-[11px] text-[#00ddd7] truncate">
                  {activeConv.lead.utmCampaign}
                </div>
              </div>
            )}

            {activeConv.lead.directKeyword && (
              <div className="p-2.5 rounded-lg bg-[#111622] border border-[#1e2638] space-y-1">
                <div className="text-[10px] text-gray-500">Palavra Direct Instagram</div>
                <div className="font-mono text-[11px] text-pink-400">
                  #{activeConv.lead.directKeyword}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
