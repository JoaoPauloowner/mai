const DUMMY_HASH = "$2a$10$e8wZ3o.OcvG5zYm1K/8oGuH7Hn4C7x3q3rP7.g4OQjXbFhA5z7R8K";

export async function validateCredentials(email: string, passwordPlain: string) {
  const cleanEmail = (email || "").toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
    include: {
      organization: true,
    },
  });

  if (!user) {
    // Timing-attack prevention
    await bcrypt.compare(passwordPlain, DUMMY_HASH);
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
