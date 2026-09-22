import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { InboxClient } from "@/components/chat/InboxClient";

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
    <div className="space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Caixa de Entrada Unificada (Omnichannel)
        </h1>
        <p className="text-xs text-gray-400">
          WhatsApp & Instagram Direct com simulação de presença e envio de áudios gravados na hora.
        </p>
      </div>

      <InboxClient initialConversations={conversations as any} />
    </div>
  );
}
