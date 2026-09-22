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
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

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

    // Se for áudio PTT, simula "Gravando áudio..." por 2.2 segundos
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
    <div className="h-[calc(100vh-140px)] rounded-2xl bg-white border border-[#E0E3DE] flex overflow-hidden shadow-xs text-[#2C2E2A]">
      {/* 1. Coluna Esquerda: Lista de Conversas */}
      <div className="w-84 border-r border-[#E0E3DE] flex flex-col bg-[#F5F5F5]/70">
        <div className="p-3.5 border-b border-[#E0E3DE] space-y-2.5 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#2C2E2A]">
              Caixa de Entrada
            </h2>
            <span className="text-[10px] font-mono text-[#2D6A4F] bg-[#DDE8DE] px-2 py-0.5 rounded-full font-bold">
              {filteredConversations.length} conversas
            </span>
          </div>

          {/* Abas das 2 Caixas de Entrada */}
          <div className="grid grid-cols-3 gap-1 bg-[#E7EBE6] p-1 rounded-xl border border-[#D0D5CD] text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setChannelFilter("ALL")}
              className={`py-1.5 px-2 rounded-lg transition text-center ${
                channelFilter === "ALL"
                  ? "bg-white text-[#2C2E2A] shadow-xs font-bold"
                  : "text-[#63695B] hover:text-[#2C2E2A]"
              }`}
            >
              Todos ({conversations.length})
            </button>

            <button
              type="button"
              onClick={() => setChannelFilter("WHATSAPP")}
              className={`py-1.5 px-2 rounded-lg transition text-center flex items-center justify-center gap-1 ${
                channelFilter === "WHATSAPP"
                  ? "bg-[#C1ED84] text-[#2C2E2A] shadow-xs font-bold"
                  : "text-[#2D6A4F] hover:bg-white"
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
                  ? "bg-white text-[#2C2E2A] shadow-xs font-bold"
                  : "text-[#9B2226] hover:bg-white"
              }`}
            >
              <span>📸 Direct</span>
              <span className="text-[10px] opacity-80 font-mono">({instaCount})</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#E0E3DE]">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#7C8472] space-y-1">
              <div>Nenhuma conversa no canal selecionado.</div>
              <div className="text-[10px]">Alterne para a aba "Todos" para ver todas as mensagens.</div>
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
                      ? "bg-white border-l-4 border-[#C1ED84] shadow-2xs font-medium"
                      : "hover:bg-white"
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#EAE2CA] text-[#2C2E2A] flex items-center justify-center font-bold text-sm border border-[#D0D5CD]">
                      {conv.lead.nome.charAt(0)}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center text-[10px] border border-[#E0E3DE]">
                      {conv.canal === "INSTAGRAM" ? "📸" : "💬"}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#2C2E2A] truncate">
                        {conv.lead.nome}
                      </h4>
                      {conv.canal === "INSTAGRAM" ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9BEC4] text-[#9B2226] flex items-center gap-1 shrink-0">
                          <InstagramIcon className="w-3 h-3" /> Instagram
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DDE8DE] text-[#2D6A4F] flex items-center gap-1 shrink-0">
                          💬 WhatsApp
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#63695B] truncate mt-0.5">
                      {lastMsg
                        ? lastMsg.tipoConteudo === "AUDIO_PTT"
                          ? "🎙️ Mensagem de voz PTT"
                          : lastMsg.conteudo
                        : "Nova conversa iniciada"}
                    </p>

                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#E7EBE6] text-[#63695B] border border-[#D0D5CD]">
                        {conv.lead.origemCanal}
                      </span>
                      {conv.lead.directKeyword && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#E9BEC4] text-[#9B2226] border border-red-200">
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
        <div className="flex-1 flex flex-col bg-[#F5F5F5] min-w-0">
          {/* Header do Chat */}
          <div className="p-4 border-b border-[#E0E3DE] bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#EAE2CA] text-[#2C2E2A] flex items-center justify-center font-bold text-sm border border-[#D0D5CD]">
                {activeConv.lead.nome.charAt(0)}
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#2C2E2A] flex items-center gap-2">
                  <span>{activeConv.lead.nome}</span>
                  {activeConv.canal === "INSTAGRAM" ? (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#E9BEC4] text-[#9B2226] font-mono font-bold flex items-center gap-1">
                      <InstagramIcon className="w-3.5 h-3.5" /> Instagram Direct
                    </span>
                  ) : (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#DDE8DE] text-[#2D6A4F] font-mono font-bold flex items-center gap-1">
                      💬 WhatsApp Oficial
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-[#63695B] mt-0.5">
                  {activeConv.lead.telefone} • {activeConv.lead.ramoInteresse || "Interesse Geral"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${activeConv.lead.telefone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#C1ED84] hover:bg-[#B2E372] text-[#2C2E2A] text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Abrir no WA
              </a>
            </div>
          </div>

          {/* Área das Mensagens */}
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
                    className={`max-w-[75%] rounded-2xl p-3.5 text-xs shadow-2xs ${
                      isLead
                        ? "bg-white border border-[#E0E3DE] text-[#2C2E2A] rounded-tl-sm"
                        : "bg-[#C1ED84] text-[#2C2E2A] font-medium rounded-tr-sm border border-[#B2E372]"
                    }`}
                  >
                    {isAudio ? (
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <button
                          type="button"
                          onClick={() =>
                            setIsPlayingAudioId(
                              isPlayingAudioId === msg.id ? null : msg.id
                            )
                          }
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-2xs ${
                            isLead
                              ? "bg-[#7A8E75] text-white"
                              : "bg-[#2C2E2A] text-[#C1ED84]"
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
                            <span className="w-1 bg-[#2C2E2A] rounded-full h-3" />
                            <span className="w-1 bg-[#2C2E2A] rounded-full h-5" />
                            <span className="w-1 bg-[#2C2E2A] rounded-full h-2" />
                            <span className="w-1 bg-[#2C2E2A] rounded-full h-4" />
                            <span className="w-1 bg-[#2C2E2A] rounded-full h-3" />
                            <span className="w-1 bg-[#2C2E2A] rounded-full h-5" />
                            <span className="w-1 bg-[#2C2E2A] rounded-full h-2" />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-[#63695B] mt-1 font-mono">
                            <span>0:{msg.audioDuration || 14}</span>
                            <span className="uppercase text-[9px] font-bold">Áudio PTT</span>
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
                        isLead ? "text-[#7C8472]" : "text-[#2C2E2A]/70"
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

            {isSimulatingPresence && (
              <div className="flex justify-end">
                <div className="px-3 py-1.5 rounded-full bg-white border border-[#E0E3DE] text-xs text-[#2D6A4F] flex items-center gap-2 animate-pulse font-mono">
                  <span>{presenceText}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Barra de Input */}
          <div className="p-3 border-t border-[#E0E3DE] bg-white space-y-2">
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
                className="flex-1 bg-[#F5F5F5] border border-[#E0E3DE] rounded-xl px-4 py-2.5 text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75] transition"
              />

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSendMessage("TEXTO")}
                disabled={!inputText.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={simulatePttRecord}
                title="Simular Gravação de Áudio PTT"
              >
                <Mic className="w-4 h-4 text-[#7A8E75]" />
                <span>Áudio PTT</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-[#7C8472]">
          Nenhuma conversa selecionada.
        </div>
      )}
    </div>
  );
}
