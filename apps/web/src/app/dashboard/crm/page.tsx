import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CrmKanbanClient } from "@/components/crm/CrmKanbanClient";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function CrmPage() {
  const session = await requireAuth();

  const leads = await prisma.lead.findMany({
    where: { organizationId: session.organizationId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[var(--text-main)]">
      <PageHeader
        title="Pipeline CRM Inteligente"
        description="Acompanhamento das oportunidades por estágio com nota de qualificação automática por IA."
        actions={
          <Link href="/quiz/captacao-geral" target="_blank">
            <Button variant="secondary" size="sm">
              <Compass className="w-3.5 h-3.5 text-[var(--accent-ink)]" />
              <span>Gerar Lead via Mini-Quiz</span>
            </Button>
          </Link>
        }
      />

      <CrmKanbanClient initialLeads={leads as any} />
    </div>
  );
}
