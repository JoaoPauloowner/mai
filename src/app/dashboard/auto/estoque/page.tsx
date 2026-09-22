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
    <div className="space-y-6 max-w-6xl mx-auto text-[#171717]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FFF3D6] text-[#A15C00] border border-[#E8D5A8] font-bold">
              🚗 Módulo Automotivo Especializado
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#171717]">
            Pátio & Estoque de Seminovos
          </h1>
          <p className="text-xs text-[#6F6F6F]">
            Inventário conectado diretamente à IA para envio de fotos, fichas técnicas e propostas automáticas no WhatsApp.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicles.length === 0 ? (
          <div className="col-span-3 p-12 text-center text-xs text-[#8A8A84] bg-white rounded-2xl border border-[#E7E7E4]">
            Nenhum veículo cadastrado ainda. Use a demo da AutoPrime no seletor para visualizar o pátio completo.
          </div>
        ) : (
          vehicles.map((v) => (
            <div
              key={v.id}
              className="rounded-2xl bg-white border border-[#E7E7E4] overflow-hidden shadow-xs hover:border-[#FF6A2A] transition group"
            >
              <div className="h-40 bg-[#F4F4F2] flex items-center justify-center text-[#8A8A84] relative">
                <Car className="w-16 h-16 text-[#B0B0AA] group-hover:text-[#FF6A2A] transition" />
                <span className="absolute top-3 right-3">
                  <StatusBadge status={v.status} />
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-sm text-[#171717] group-hover:text-[#FF6A2A] transition">
                    {v.marca} {v.modelo}
                  </h3>
                  <p className="text-xs text-[#6F6F6F] mt-0.5">
                    Ano {v.ano} • {v.km.toLocaleString()} km • Cor {v.cor || "Padrão"}
                  </p>
                </div>
                <div className="text-lg font-extrabold text-[#171717] font-mono">
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
