import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function validateCredentials(email: string, passwordPlain: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: {
      organization: true,
    },
  });

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(passwordPlain, user.senhaHash);
  if (!isValid) {
    return null;
  }

  return {
    userId: user.id,
    organizationId: user.organizationId,
    organizationNome: user.organization.nome,
    organizationSlug: user.organization.slug,
    organizationSegmento: user.organization.segmento,
    nome: user.nome,
    email: user.email,
    role: user.role,
  };
}

export async function getTargetDemoOrganization(slug: string) {
  return await prisma.organization.findUnique({
    where: { slug },
  });
}
