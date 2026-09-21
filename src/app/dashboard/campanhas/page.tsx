import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Target, Sparkles, Compass } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import Link from "next/link";

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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Rastreamento de Campanhas & Palavras-Chave Direct
          </h1>
          <p className="text-xs text-gray-400">
            Monitore quais anúncios do Meta Ads, Google Ads e postagens no Instagram estão gerando mais leads e vendas.
          </p>
        </div>

        <Link
          href="/quiz/captacao-geral"
          target="_blank"
          className="px-4 py-2 rounded-xl bg-[#161d2d] border border-[#2e3b54] hover:border-[#00ddd7] text-white text-xs font-medium transition flex items-center gap-2"
        >
          <Compass className="w-3.5 h-3.5 text-[#00ddd7]" /> Testar Quiz de Tráfego
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campanhas UTM */}
        <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#00ddd7]" /> Campanhas Tráfego Pago (UTMs)
            </span>
            <span className="text-[10px] font-mono text-gray-500 uppercase">Google & Meta Ads</span>
          </h3>

          <div className="space-y-3">
            {campaigns.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">Nenhuma campanha com UTM capturada ainda.</p>
            ) : (
              campaigns.map((c) => (
                <div
                  key={`${c.utmCampaign}-${c.utmSource}`}
                  className="p-3.5 rounded-xl bg-[#161d2d] border border-[#252e42] flex items-center justify-between"
                >
                  <div>
                    <div className="font-mono text-xs font-bold text-white">{c.utmCampaign}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Origem: {c.utmSource || "meta_ads"}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#00ddd7]/10 text-[#00ddd7] border border-[#00ddd7]/30">
                    {c._count.id} leads
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Palavras-Chave do Instagram Direct */}
        <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <InstagramIcon className="w-4 h-4 text-pink-400" /> Gatilhos de Direct (Keywords)
            </span>
            <span className="text-[10px] font-mono text-pink-400 uppercase">Auto-Direct IA</span>
          </h3>

          <div className="space-y-3">
            {directKeywords.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">Nenhuma palavra-chave capturada ainda.</p>
            ) : (
              directKeywords.map((k) => (
                <div
                  key={k.directKeyword}
                  className="p-3.5 rounded-xl bg-[#161d2d] border border-[#252e42] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-lg border border-pink-500/30">
                      #{k.directKeyword}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/5 text-white border border-white/10">
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
