import { requireAuth } from "@/lib/session";
import { ShopperSidebar } from "@/components/navigation/ShopperSidebar";
import { ShopperHeader } from "@/components/navigation/ShopperHeader";

export default async function ShoppersDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <ShopperSidebar segmento={session.organizationSegmento} orgNome={session.organizationNome} role={session.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <ShopperHeader
          userName={session.nome}
          userRole={session.role}
          orgSlug={session.organizationSlug}
          orgSegmento={session.organizationSegmento}
          orgNome={session.organizationNome}
          isDemoMode={Boolean(session.isDemoMode)}
        />
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-5 md:p-7">{children}</main>
      </div>
    </div>
  );
}
