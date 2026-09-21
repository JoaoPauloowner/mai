import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CrmKanbanClient } from "@/components/crm/CrmKanbanClient";
import Link from "next/link";
import { Plus, Compass } from "lucide-react";

export default async function CrmPage() {
  const session = await requireAuth();

  const leads = await prisma.lead.findMany({
    where: { organizationId: session.organizationId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Pipeline CRM Inteligente (Lead Scored)
          </h1>
          <p className="text-xs text-gray-400">
            Acompanhamento das oportunidades por estágio com nota de qualificação automática por IA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/quiz/captacao-geral"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-[#161d2d] border border-[#2e3b54] hover:border-[#00ddd7] text-white text-xs font-medium transition flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#00ddd7]" /> Gerar Lead via Mini-Quiz
          </Link>
        </div>
      </div>

      <CrmKanbanClient initialLeads={leads as any} />
    </div>
  );
}
