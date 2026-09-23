"use client";

import { useState } from "react";
import { Camera, Sparkles, Car, CheckCircle2, DollarSign, Upload, FileCheck2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface TradeInRecord {
  id: string;
  cliente: string;
  telefone: string;
  veiculo: string;
  ano: string;
  km: string;
  valorFipe: number;
  avarias: string[];
  ofertaSugerida: number;
  status: "ANALISADO" | "AGUARDANDO_LAUDO" | "OFERTA_ENVIADA";
}

export default function AvaliacaoUsadosPage() {
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("2021");
  const [km, setKm] = useState("45000");
  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const [records, setRecords] = useState<TradeInRecord[]>([
    {
      id: "1",
      cliente: "Mariana Costa",
      telefone: "+55 (11) 98844-2211",
      veiculo: "Jeep Renegade Longitude 1.8",
      ano: "2021",
      km: "38.500 km",
      valorFipe: 88500,
      avarias: ["Pequeno retoque no para-choque traseiro", "Pneus dianteiros meia-vida"],
      ofertaSugerida: 74200,
      status: "OFERTA_ENVIADA",
    },
    {
      id: "2",
      cliente: "Rodrigo Mendonça",
      telefone: "+55 (11) 97123-9988",
      veiculo: "Toyota Corolla XEi 2.0",
      ano: "2020",
      km: "52.000 km",
      valorFipe: 109800,
      avarias: ["Lataria 100% original", "Revisões em concessionária comprovadas"],
      ofertaSugerida: 93500,
      status: "ANALISADO",
    },
  ]);

  const handleSimularAvaliacao = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);

    setTimeout(() => {
      const fipeEstimado = 75000 + Math.floor(Math.random() * 50000);
      const oferta = Math.round(fipeEstimado * 0.84);
      const novo: TradeInRecord = {
        id: Date.now().toString(),
        cliente: cliente || "Lead WhatsApp",
        telefone: telefone || "(11) 99999-0000",
        veiculo: modelo || "Veículo Consultado (" + (placa.toUpperCase() || "ABC-1234") + ")",
        ano: ano,
        km: `${Number(km).toLocaleString()} km`,
        valorFipe: fipeEstimado,
        avarias: ["Inspeção de lataria aprovada", "Histórico de leilão limpo"],
        ofertaSugerida: oferta,
        status: "ANALISADO",
      };
      setRecords([novo, ...records]);
      setAnalyzing(false);
      setPlaca("");
      setModelo("");
      setCliente("");
      setTelefone("");
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF3D6] text-[#A15C00] text-xs font-bold border border-[#E8D5A8] mb-2">
          <Car className="w-3.5 h-3.5" /> Módulo Automotivo Especializado
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#171717]">
          Avaliação de Usados na Troca (Visão Computacional & FIPE)
        </h1>
        <p className="text-xs text-[#6F6F6F] mt-1">
          Triagem de seminovos enviados pelo WhatsApp com análise automática de tabela FIPE, margem de concessionária e proposta na hora.
        </p>
      </div>

      {/* Formulário de Nova Avaliação */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Simulação de Troca / Laudo Rápido</CardTitle>
          <CardDescription>
            Insira os dados da placa ou modelo para precificar e gerar proposta para envio imediato ao WhatsApp do lead.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSimularAvaliacao} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Placa do Veículo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: BRA2E19"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E7E4] rounded-xl text-xs font-mono font-bold text-[#171717] uppercase focus:outline-none focus:border-[#FF6A2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Marca / Modelo / Versão</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Honda Civic EXL 2.0"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E7E4] rounded-xl text-xs text-[#171717] focus:outline-none focus:border-[#FF6A2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Ano / Quilometragem</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Ano (2021)"
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E7E7E4] rounded-xl text-xs text-[#171717]"
                  />
                  <input
                    type="text"
                    placeholder="Km (45000)"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E7E7E4] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fernando Silva"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E7E4] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">WhatsApp de Contato</label>
                <input
                  type="text"
                  required
                  placeholder="(11) 98888-7777"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E7E4] rounded-xl text-xs text-[#171717]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" disabled={analyzing}>
                <Camera className="w-4 h-4" />
                {analyzing ? "Consultando FIPE & Analisando..." : "Calcular Oferta de Compra"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tabela de Avaliações em Andamento */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Veículos Avaliados ({records.length})</CardTitle>
          <CardDescription>Propostas geradas com margem comercial garantida</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-[#E7E7E4]">
            {records.map((rec) => (
              <div key={rec.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#171717]">{rec.veiculo}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F4F4F2] text-[#171717] font-bold">
                      {rec.ano} • {rec.km}
                    </span>
                  </div>
                  <p className="text-xs text-[#6F6F6F]">
                    Cliente: <strong>{rec.cliente}</strong> ({rec.telefone})
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rec.avarias.map((av, i) => (
                      <span key={i} className="text-[10px] bg-[#F4F4F2] border border-[#E7E7E4] px-2 py-0.5 rounded text-[#171717]">
                        ✓ {av}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <span className="text-[10px] text-[#8A8A84] uppercase font-mono block">Tabela FIPE</span>
                    <span className="text-xs font-mono text-[#6F6F6F] line-through">
                      R$ {rec.valorFipe.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-[10px] text-[#8A8A84] uppercase font-mono block mt-1">Oferta Concessionária</span>
                    <span className="text-base font-bold font-mono text-[#247A4A]">
                      R$ {rec.ofertaSugerida.toLocaleString("pt-BR")}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${rec.telefone.replace(/\D/g, "")}?text=Olá ${encodeURIComponent(
                      rec.cliente
                    )}! Avaliamos seu veículo ${encodeURIComponent(
                      rec.veiculo
                    )} e temos uma proposta especial de R$ ${rec.ofertaSugerida.toLocaleString("pt-BR")} na troca.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#FF6A2A] text-[#171717] font-bold text-xs hover:bg-[#EB5417] transition border border-[#A5DC60]"
                  >
                    Enviar Proposta
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
