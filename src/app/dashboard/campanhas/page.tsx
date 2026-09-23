import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Target, Compass } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

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
    <div className="space-y-6 max-w-6xl mx-auto text-[var(--text-main)]">
      <PageHeader
        title="Rastreamento de Campanhas & Atribuição"
        description="Monitore quais anúncios do Meta Ads, Google Ads e palavras-chave no Direct geram mais leads e receita."
        actions={
          <Link href="/quiz/captacao-geral" target="_blank">
            <Button variant="secondary" size="sm">
              <Compass className="w-3.5 h-3.5 text-[var(--accent-ink)]" />
              <span>Testar Quiz de Tráfego</span>
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campanhas UTM */}
        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[var(--accent-ink)]" /> Campanhas Tráfego Pago (UTMs)
            </span>
            <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Google & Meta Ads</span>
          </h3>

          <div className="space-y-2.5">
            {campaigns.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-subtle)] bg-[var(--bg-subtle)] rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
                Nenhuma campanha com UTM detectada ainda. Ao veicular links com ?utm_campaign=..., os dados aparecerão aqui em tempo real.
              </div>
            ) : (
              campaigns.map((c: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-[var(--radius-md)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[var(--text-main)]">{c.utmCampaign}</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
                      Fonte: {c.utmSource || "Direto"}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[var(--success-bg)] border border-[var(--success-border)] text-[var(--success-text)] font-mono font-bold text-[11px]">
                    {c._count.id} leads
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Palavras-chave Direct */}
        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <InstagramIcon className="w-4 h-4 text-[var(--accent-ink)]" /> Palavras-Chave Instagram Direct
            </span>
            <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Gatilhos Automáticos</span>
          </h3>

          <div className="space-y-2.5">
            {directKeywords.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-subtle)] bg-[var(--bg-subtle)] rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
                Nenhum lead capturado via palavra-chave do Direct ainda.
              </div>
            ) : (
              directKeywords.map((k: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-[var(--radius-md)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between text-xs"
                >
                  <div className="font-mono font-bold text-[var(--text-main)]">#{k.directKeyword}</div>
                  <span className="px-2.5 py-1 rounded-full bg-[var(--success-bg)] border border-[var(--success-border)] text-[var(--success-text)] font-mono font-bold text-[11px]">
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
