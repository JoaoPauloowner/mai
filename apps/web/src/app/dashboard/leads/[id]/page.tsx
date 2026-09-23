import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { LeadDetailClient } from "@/components/leads/LeadDetailClient";

export default async function LeadDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  const { id } = await props.params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      conversations: {
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
      appointments: {
        orderBy: { dataHorario: "desc" },
      },
    },
  });

  if (!lead || lead.organizationId !== session.organizationId) {
    notFound();
  }

  return <LeadDetailClient lead={lead} />;
}

