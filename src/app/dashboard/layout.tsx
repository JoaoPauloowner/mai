import { requireAuth } from "@/lib/session";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Header } from "@/components/navigation/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

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

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
