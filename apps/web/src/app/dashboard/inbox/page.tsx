import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { InboxClient } from "@/components/chat/InboxClient";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function InboxPage() {
  const session = await requireAuth();

  // Carrega as conversas da organização atual
  const conversations = await prisma.conversation.findMany({
    where: { organizationId: session.organizationId },
    include: {
      lead: true,
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { ultimoContato: "desc" },
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-[var(--text-main)]">
      <PageHeader
        title="Caixa de Entrada Unificada"
        description="WhatsApp Oficial & Instagram Direct com mensageria em tempo real e simulação de áudios PTT."
      />

      <InboxClient initialConversations={conversations as any} />
    </div>
  );
}
