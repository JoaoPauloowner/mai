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
    <div className="flex min-h-screen bg-[#F4F4F2] text-[#171717]">
      {/* Sidebar WAct Lateral */}
      <Sidebar
        segmento={session.organizationSegmento}
        orgNome={session.organizationNome}
        role={session.role}
      />

      {/* Conteúdo Principal com Top Header */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName={session.nome}
          userRole={session.role}
          orgSlug={session.organizationSlug}
          orgSegmento={session.organizationSegmento}
          orgNome={session.organizationNome}
          isDemoMode={Boolean(session.isDemoMode)}
        />

        <main className="flex-1 p-5 md:p-7 overflow-y-auto bg-[#F4F4F2]">
          {children}
        </main>
      </div>
    </div>
  );
}
