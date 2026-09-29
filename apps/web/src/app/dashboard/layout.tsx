import { requireAuth } from "@/lib/session";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Header } from "@/components/navigation/Header";
import { prisma } from "@/lib/prisma";
import { AlertTriangle, CreditCard } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  const org = await prisma.organization.findUnique({
    where: { id: session.organizationId },
    select: { statusPlano: true, plano: true },
  });

  const isBlocked = org?.statusPlano === "inadimplente" || org?.statusPlano === "cancelado";

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar
        segmento={session.organizationSegmento}
        orgNome={session.organizationNome}
        role={session.role}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName={session.nome}
          userRole={session.role}
          orgSlug={session.organizationSlug}
          orgSegmento={session.organizationSegmento}
          orgNome={session.organizationNome}
          isDemoMode={Boolean(session.isDemoMode)}
        />

        {isBlocked && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-amber-900 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Atenção:</strong> Sua assinatura está com status{" "}
                <span className="uppercase font-bold text-amber-950">
                  {org?.statusPlano}
                </span>
                . As automações de atendimento por IA e campanhas ativas foram pausadas.
              </span>
            </div>
            <Link
              href="/dashboard/settings/geral"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shrink-0 transition"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Regularizar Fatura</span>
            </Link>
          </div>
        )}

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
