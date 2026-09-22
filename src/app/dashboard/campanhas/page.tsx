import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Target, Sparkles, Compass } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function CampanhasPage() {
  const session = await requireAuth();

  const campaigns = await prisma.lead.groupBy({
    by: ["utmCampaign", "utmSource"],
    where: {
      organizationId: session.organizationId,
      utmCampaign: { not: null },
    },
    _count: { id: true },
  });

  const directKeywords = await prisma.lead.groupBy({
    by: ["directKeyword"],
    where: {
      organizationId: session.organizationId,
      directKeyword: { not: null },
    },
    _count: { id: true },
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-[#171717]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#171717]">
            Rastreamento de Campanhas & Palavras-Chave Direct
          </h1>
          <p className="text-xs text-[#6F6F6F] mt-0.5">
            Monitore quais anúncios do Meta Ads, Google Ads e postagens no Instagram estão gerando mais leads e vendas.
          </p>
        </div>

        <Link href="/quiz/captacao-geral" target="_blank">
          <Button variant="secondary" size="sm">
            <Compass className="w-3.5 h-3.5 text-[#FF6A2A]" />
            <span>Testar Quiz de Tráfego</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campanhas UTM */}
        <div className="p-6 rounded-2xl bg-white border border-[#E7E7E4] space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#171717] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#FF6A2A]" /> Campanhas Tráfego Pago (UTMs)
            </span>
            <span className="text-[10px] font-mono text-[#8A8A84] uppercase">Google & Meta Ads</span>
          </h3>

          <div className="space-y-3">
            {campaigns.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8A8A84] bg-[#F4F4F2] rounded-xl border border-[#E7E7E4]">
                Nenhuma campanha com UTM detectada ainda. Ao anunciar usando links com ?utm_campaign=..., os dados aparecerão aqui em tempo real.
              </div>
            ) : (
              campaigns.map((c, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#F4F4F2] border border-[#E7E7E4] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#171717]">{c.utmCampaign}</div>
                    <div className="text-[10px] text-[#6F6F6F] font-mono mt-0.5">
                      Fonte: {c.utmSource || "Direto"}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#EAF7EF] text-[#247A4A] font-mono font-bold text-[11px]">
                    {c._count.id} leads
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Palavras-chave Direct */}
        <div className="p-6 rounded-2xl bg-white border border-[#E7E7E4] space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#171717] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <InstagramIcon className="w-4 h-4 text-[#FF6A2A]" /> Palavras-Chave Instagram Direct
            </span>
            <span className="text-[10px] font-mono text-[#8A8A84] uppercase">Gatilhos Automáticos</span>
          </h3>

          <div className="space-y-3">
            {directKeywords.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8A8A84] bg-[#F4F4F2] rounded-xl border border-[#E7E7E4]">
                Nenhum lead capturado via palavra-chave do Direct ainda.
              </div>
            ) : (
              directKeywords.map((k, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#F4F4F2] border border-[#E7E7E4] flex items-center justify-between text-xs"
                >
                  <div className="font-mono font-bold text-[#171717]">#{k.directKeyword}</div>
                  <span className="px-2.5 py-1 rounded-full bg-[#EAF7EF] text-[#247A4A] font-mono font-bold text-[11px]">
                    {k._count.id} acionamentos
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
