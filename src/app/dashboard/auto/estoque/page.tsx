import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Car, Sparkles, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function EstoqueAutoPage() {
  const session = await requireAuth();

  const vehicles = await prisma.vehicle.findMany({
    where: { organizationId: session.organizationId },
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-[#2C2E2A]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#E1D6AF] text-[#8F5D18] border border-[#D0C496] font-bold">
              🚗 Módulo Automotivo Especializado
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#2C2E2A]">
            Pátio & Estoque de Seminovos
          </h1>
          <p className="text-xs text-[#63695B]">
            Inventário conectado diretamente à IA para envio de fotos, fichas técnicas e propostas automáticas no WhatsApp.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicles.length === 0 ? (
          <div className="col-span-3 p-12 text-center text-xs text-[#7C8472] bg-white rounded-2xl border border-[#E0E3DE]">
            Nenhum veículo cadastrado ainda. Use a demo da AutoPrime no seletor para visualizar o pátio completo.
          </div>
        ) : (
          vehicles.map((v) => (
            <div
              key={v.id}
              className="rounded-2xl bg-white border border-[#E0E3DE] overflow-hidden shadow-xs hover:border-[#7A8E75] transition group"
            >
              <div className="h-40 bg-[#F5F5F5] flex items-center justify-center text-[#7C8472] relative">
                <Car className="w-16 h-16 text-[#B5BBAE] group-hover:text-[#7A8E75] transition" />
                <span className="absolute top-3 right-3">
                  <StatusBadge status={v.status} />
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-sm text-[#2C2E2A] group-hover:text-[#7A8E75] transition">
                    {v.marca} {v.modelo}
                  </h3>
                  <p className="text-xs text-[#63695B] mt-0.5">
                    Ano {v.ano} • {v.km.toLocaleString()} km • Cor {v.cor || "Padrão"}
                  </p>
                </div>
                <div className="text-lg font-extrabold text-[#2C2E2A] font-mono">
                  {formatCurrency(v.preco)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
