import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPhone(phone: string): string {
  return crypto.createHash("sha256").update(phone).digest("hex");
}

async function main() {
  console.log("🌱 Iniciando Seed do Omni Service SaaS...");

  // Limpar tabelas caso já existam dados
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.insurancePolicy.deleteMany();
  await prisma.taxGuide.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.organization.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 10);
  const userPasswordHash = await bcrypt.hash("user123", 10);

  // 1. Organização Mestre / Demo Geral
  const orgDemo = await prisma.organization.create({
    data: {
      nome: "Omni Growth Hub (Demonstração)",
      slug: "omni-demo",
      segmento: "GENERAL",
      corPrimaria: "#00DDD7",
      plano: "enterprise",
      statusPlano: "ativo",
      whatsappNumber: "+5511999990001",
      instagramHandle: "@omnigrowth",
    },
  });

  // 2. Organização Automotiva
  const orgAuto = await prisma.organization.create({
    data: {
      nome: "AutoPrime Seminovos & Blindados",
      slug: "autoprime",
      segmento: "AUTO",
      corPrimaria: "#F59E0B", // Amber
      plano: "pro",
      statusPlano: "ativo",
      whatsappNumber: "+5511988881111",
      instagramHandle: "@autoprimeseminovos",
    },
  });

  // 3. Organização Seguros
  const orgSeguros = await prisma.organization.create({
    data: {
      nome: "Apex Corretora & Gestão de Riscos",
      slug: "apex-seguros",
      segmento: "INSURANCE",
      corPrimaria: "#3B82F6", // Blue
      plano: "pro",
      statusPlano: "ativo",
      whatsappNumber: "+5511977772222",
      instagramHandle: "@apexseguros",
    },
  });

  // 4. Organização Clínica
  const orgClinica = await prisma.organization.create({
    data: {
      nome: "OdontoPrev & Estética Facial",
      slug: "odontoprev",
      segmento: "CLINIC",
      corPrimaria: "#EC4899", // Pink
      plano: "starter",
      statusPlano: "ativo",
      whatsappNumber: "+5511955554444",
      instagramHandle: "@odontoprevestetica",
    },
  });

  // Usuários do Sistema
  // Super Admin global (tem acesso a alternar demos a qualquer momento)
  const superAdmin = await prisma.user.create({
    data: {
      organizationId: orgDemo.id,
      nome: "Comandante Omni (Super Admin)",
      email: "admin@omni.com.br",
      senhaHash: passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  // Gerente Automotivo
  await prisma.user.create({
    data: {
      organizationId: orgAuto.id,
      nome: "Carlos Veículos (Gerente)",
      email: "auto@omni.com.br",
      senhaHash: userPasswordHash,
      role: "ADMIN_EMPRESA",
    },
  });

  // Gerente de Seguros
  await prisma.user.create({
    data: {
      organizationId: orgSeguros.id,
      nome: "Renata Seguros (Diretora)",
      email: "seguros@omni.com.br",
      senhaHash: userPasswordHash,
      role: "ADMIN_EMPRESA",
    },
  });

  console.log("🏢 Empresas e Usuários criados com sucesso.");

  // Inserção de Leads Realistas com Atribuição Multicanal
  // Leads da AutoPrime
  const phoneAuto1 = "+5511994112233";
  const leadAuto1 = await prisma.lead.create({
    data: {
      organizationId: orgAuto.id,
      nome: "Rodrigo Mendonça",
      telefone: phoneAuto1,
      telefoneHash: hashPhone(phoneAuto1),
      email: "rodrigo.mendonca@gmail.com",
      status: "QUALIFICADO",
      prioridade: "HOT",
      score: 95,
      scoreJustificativa: "Interesse no BMW 320i M Sport 2024. Entrada de R$ 90.000 à vista + seminovo na troca avaliado.",
      valorNegocio: 319000,
      origemCanal: "INSTAGRAM_DIRECT",
      directKeyword: "QUERO_BMW",
      utmSource: "instagram_reels",
      utmCampaign: "reels_lancamento_bmw",
      utmMedium: "organic_viral",
      ramoInteresse: "BMW 320i M Sport 2024",
      resumoIa: "Lead altamente aquecido. Deseja agendar test drive para amanhã às 15h. Tem Civic 2020 para dar na troca.",
    },
  });

  const phoneAuto2 = "+5511985443322";
  await prisma.lead.create({
    data: {
      organizationId: orgAuto.id,
      nome: "Mariana Alencar",
      telefone: phoneAuto2,
      telefoneHash: hashPhone(phoneAuto2),
      email: "mariana.alencar@empresa.com",
      status: "AGENDADO",
      prioridade: "HOT",
      score: 88,
      scoreJustificativa: "Aprovou simulação de financiamento com taxa 0.99%. Visita presencial agendada.",
      valorNegocio: 185000,
      origemCanal: "QUIZ",
      quizAnswersJson: JSON.stringify({
        modelo_desejado: "SUV Médio (Compass ou Corolla Cross)",
        orcamento: "R$ 150k a 200k",
        forma_pagamento: "Financiamento 50% + Entrada 50%",
        prazo_compra: "Esta semana",
      }),
      utmSource: "meta_ads",
      utmCampaign: "quiz_suv_familias",
      utmMedium: "stories_cpc",
      ramoInteresse: "Jeep Compass Longitude 2023",
      resumoIa: "Preencheu o mini-quiz via anúncio de Stories no Instagram. Conversou com IA e agendou visita.",
    },
  });

  const phoneAuto3 = "+5511976554411";
  await prisma.lead.create({
    data: {
      organizationId: orgAuto.id,
      nome: "Felipe Siqueira",
      telefone: phoneAuto3,
      telefoneHash: hashPhone(phoneAuto3),
      email: "felipe.siqueira@outlook.com",
      status: "NOVO",
      prioridade: "WARM",
      score: 68,
      scoreJustificativa: "Perguntou sobre condições de garantia e quilometragem do Corolla 2022.",
      valorNegocio: 135000,
      origemCanal: "WHATSAPP",
      utmSource: "google_ads",
      utmCampaign: "fundo_funil_seminovos_sp",
      utmMedium: "search_cpc",
      ramoInteresse: "Toyota Corolla XEi 2022",
      resumoIa: "Chegou pelo botão do WhatsApp no site institucional após buscar seminovos com garantia.",
    },
  });

  // Leads da Corretora de Seguros (Apex)
  const phoneSeg1 = "+5511981112233";
  const leadSeg1 = await prisma.lead.create({
    data: {
      organizationId: orgSeguros.id,
      nome: "Guilherme Bastos",
      telefone: phoneSeg1,
      telefoneHash: hashPhone(phoneSeg1),
      email: "guilherme@transportadorabastos.com.br",
      status: "QUALIFICADO",
      prioridade: "HOT",
      score: 96,
      scoreJustificativa: "Empresa de logística com frota de 18 caminhões. Apólice atual vence em 14 dias.",
      valorNegocio: 84000,
      origemCanal: "META_ADS",
      empresa: "Transportes Bastos Ltda",
      utmSource: "linkedin_ads",
      utmCampaign: "frota_pesada_renovacao_q1",
      utmMedium: "cpc_b2b",
      ramoInteresse: "Seguro Frota Pesada",
      resumoIa: "Recebeu ligação de IA ativa (Vapi). Confirmou CNPJ e enviou relação de chassis para cotação rápida.",
    },
  });

  const phoneSeg2 = "+5511972223344";
  await prisma.lead.create({
    data: {
      organizationId: orgSeguros.id,
      nome: "Juliana Peixoto",
      telefone: phoneSeg2,
      telefoneHash: hashPhone(phoneSeg2),
      email: "juliana.peixoto@uol.com.br",
      status: "NOVO",
      prioridade: "WARM",
      score: 74,
      scoreJustificativa: "Seguro Auto individual (Compass 2024). Deseja comparar Porto Seguro vs Allianz.",
      valorNegocio: 4200,
      origemCanal: "QUIZ",
      quizAnswersJson: JSON.stringify({
        tipo_seguro: "Seguro Auto Novo",
        veiculo: "Jeep Compass 2024",
        classe_bonus: "Classe 7",
        vencimento: "Em até 10 dias",
      }),
      utmSource: "meta_ads",
      utmCampaign: "quiz_simulador_seguro",
      utmMedium: "instagram_feed",
      ramoInteresse: "Seguro Automóvel",
      resumoIa: "Preencheu o simulador público e aguarda comparativo de franquias e carro reserva.",
    },
  });


  // Criar Conversas e Mensagens Realistas para o Chat Unificado
  const convAuto1 = await prisma.conversation.create({
    data: {
      organizationId: orgAuto.id,
      leadId: leadAuto1.id,
      canal: "INSTAGRAM",
      status: "ABERTO",
      ultimoContato: new Date(),
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: convAuto1.id,
        remetenteTipo: "LEAD",
        tipoConteudo: "TEXTO",
        conteudo: "QUERO_BMW",
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        conversationId: convAuto1.id,
        remetenteTipo: "AGENT_IA",
        tipoConteudo: "TEXTO",
        conteudo: "Fala Rodrigo! Excelente escolha na BMW 320i M Sport 2024. Essa unidade está impecável, com apenas 8.400 km e pacote M Sport completo com teto solar e som Harman Kardon.",
        createdAt: new Date(Date.now() - 1000 * 60 * 29),
      },
      {
        conversationId: convAuto1.id,
        remetenteTipo: "AGENT_IA",
        tipoConteudo: "AUDIO_PTT",
        conteudo: "Áudio enviado pelo assistente (simulação com presença humana)",
        audioDuration: 18,
        createdAt: new Date(Date.now() - 1000 * 60 * 28),
      },
      {
        conversationId: convAuto1.id,
        remetenteTipo: "LEAD",
        tipoConteudo: "TEXTO",
        conteudo: "Top demais! Tenho um Civic Touring 2020 com 45.000km, vocês pegam na troca? Quanto fica a volta?",
        createdAt: new Date(Date.now() - 1000 * 60 * 20),
      },
      {
        conversationId: convAuto1.id,
        remetenteTipo: "AGENT_IA",
        tipoConteudo: "TEXTO",
        conteudo: "Com certeza Rodrigo! Aceitamos seu Civic na troca com excelente avaliação FIPE. Se você me mandar 3 fotos do carro (frente, lateral e painel), consigo te adiantar uma prévia agora mesmo. Topa vir amanhã às 15h fazer o test-drive na BMW?",
        createdAt: new Date(Date.now() - 1000 * 60 * 18),
      },
      {
        conversationId: convAuto1.id,
        remetenteTipo: "LEAD",
        tipoConteudo: "TEXTO",
        conteudo: "Fechado! Amanhã às 15h estou aí no showroom. Guarda ela pra mim!",
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
      },
    ],
  });

  // Agendamento vinculado
  await prisma.appointment.create({
    data: {
      organizationId: orgAuto.id,
      leadId: leadAuto1.id,
      titulo: "Test Drive: BMW 320i M Sport + Avaliação Civic",
      dataHorario: new Date(Date.now() + 1000 * 60 * 60 * 24), // Amanhã
      tipo: "TEST_DRIVE",
      status: "CONFIRMADO",
    },
  });

  // Criar dados do showroom do módulo automotivo (pronto para visualização na Etapa 2)
  await prisma.vehicle.createMany({
    data: [
      {
        organizationId: orgAuto.id,
        modelo: "320i M Sport 2.0 Turbo",
        marca: "BMW",
        ano: 2024,
        preco: 319000,
        km: 8400,
        placa: "BRA-2E24",
        cor: "Branco Alpino",
        status: "DISPONIVEL",
      },
      {
        organizationId: orgAuto.id,
        modelo: "Compass Longitude 1.3 Turbo Flex",
        marca: "Jeep",
        ano: 2023,
        preco: 159900,
        km: 24500,
        placa: "RXX-8J99",
        cor: "Cinza Granite",
        status: "DISPONIVEL",
      },
      {
        organizationId: orgAuto.id,
        modelo: "Corolla XEi 2.0 Dynamic Force",
        marca: "Toyota",
        ano: 2022,
        preco: 128900,
        km: 39000,
        placa: "FDW-4A12",
        cor: "Prata Supernova",
        status: "DISPONIVEL",
      },
    ],
  });

  console.log("✅ Seed finalizado com sucesso!");
  console.log("-----------------------------------------");
  console.log("🔐 Credenciais de Acesso de Teste:");
  console.log("👤 Super Admin: admin@omni.com.br / admin123");
  console.log("🚗 Setor Automotivo: auto@omni.com.br / user123");
  console.log("🛡️ Setor Seguros: seguros@omni.com.br / user123");
  console.log("📊 Setor Contábil: contabil@omni.com.br / user123");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
