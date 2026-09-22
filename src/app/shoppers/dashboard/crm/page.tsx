import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CrmKanbanClient } from "@/components/crm/CrmKanbanClient";
import Link from "next/link";
import { Plus, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function CrmPage() {
  const session = await requireAuth();

  const leads = await prisma.lead.findMany({
    where: { organizationId: session.organizationId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#0F172A]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">
            Pipeline CRM Inteligente (Lead Scored)
          </h1>
          <p className="text-xs text-[#64748B]">
            Acompanhamento das oportunidades por estágio com nota de qualificação automática por IA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/quiz/captacao-geral" target="_blank">
            <Button variant="secondary" size="sm">
              <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Gerar Lead via Mini-Quiz</span>
            </Button>
          </Link>
        </div>
      </div>

      <CrmKanbanClient initialLeads={leads as any} />
    </div>
  );
}
