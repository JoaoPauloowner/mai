import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Car, Sparkles, Plus } from "lucide-react";

export default async function EstoqueAutoPage() {
  const session = await requireAuth();

  const vehicles = await prisma.vehicle.findMany({
    where: { organizationId: session.organizationId },
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              🚗 Módulo Automotivo Especializado
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Pátio & Estoque de Seminovos
          </h1>
          <p className="text-xs text-gray-400">
            Inventário conectado diretamente à IA para envio de fotos, fichas técnicas e propostas automáticas no WhatsApp.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicles.length === 0 ? (
          <div className="col-span-3 p-12 text-center text-xs text-gray-500 bg-[#111622] rounded-2xl border border-[#1e2638]">
            Nenhum veículo cadastrado ainda. Use a demo da AutoPrime no seletor para visualizar o pátio completo.
          </div>
        ) : (
          vehicles.map((v) => (
            <div
              key={v.id}
              className="rounded-2xl bg-[#111622] border border-[#1e2638] overflow-hidden shadow-lg hover:border-amber-500/40 transition group"
            >
              <div className="h-40 bg-[#161d2d] flex items-center justify-center text-gray-500 relative">
                <Car className="w-16 h-16 text-gray-600 group-hover:text-amber-400 transition" />
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {v.status}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition">
                    {v.marca} {v.modelo}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Ano {v.ano} • {v.km.toLocaleString()} km • Cor {v.cor || "Padrão"}
                  </p>
                </div>
                <div className="text-lg font-black text-white font-mono">
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
