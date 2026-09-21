import { prisma } from "@/lib/prisma";

/**
 * Distribui um novo lead automaticamente para um vendedor da organização
 * utilizando fila circular ponderada (Round-Robin).
 */
export async function assignLeadToNextSeller(
  organizationId: string,
  leadId: string
): Promise<string | null> {
  try {
    // Busca vendedores e administradores da organização
    const sellers = await prisma.user.findMany({
      where: {
        organizationId,
        role: { in: ["VENDEDOR", "ADMIN_EMPRESA"] },
      },
      select: {
        id: true,
        nome: true,
        role: true,
        _count: {
          select: { assignedLeads: true },
        },
      },
      // Ordena pelo vendedor que tem menos leads atribuídos (Balanceamento de Carga)
      orderBy: {
        assignedLeads: {
          _count: "asc",
        },
      },
    });

    if (sellers.length === 0) {
      return null;
    }

    // Seleciona o vendedor com menor carga no momento
    const chosenSeller = sellers[0];

    // Atualiza o lead com o vendedor atribuído
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        assignedUserId: chosenSeller.id,
      },
    });

    console.log(`[Round-Robin] Lead ${leadId} atribuído ao vendedor: ${chosenSeller.nome} (${chosenSeller.id})`);
    return chosenSeller.id;
  } catch (error) {
    console.error("Falha ao distribuir lead no round-robin:", error);
    return null;
  }
}
