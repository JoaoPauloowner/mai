-- ==============================================================================
-- SUPABASE POSTGRESQL + PGVECTOR INITIALIZATION SCRIPT
-- Omnichannel B2B AI SDR SaaS
-- ==============================================================================

-- 1. Habilitar a extensão nativa de vetores (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Tabela de Organizações (Multi-Tenant)
CREATE TABLE IF NOT EXISTS "Organization" (
    "id" TEXT PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "segmento" TEXT NOT NULL DEFAULT 'GENERAL',
    "logoUrl" TEXT,
    "corPrimaria" TEXT DEFAULT '#00DDD7',
    "plano" TEXT NOT NULL DEFAULT 'pro',
    "statusPlano" TEXT NOT NULL DEFAULT 'ativo',
    "whatsappNumber" TEXT,
    "telefoneComercial" TEXT,
    "cnpj" TEXT,
    "emailNotificacoes" TEXT,
    "instagramHandle" TEXT,
    "whatsappTipoConexao" TEXT DEFAULT 'QR_CODE',
    "whatsappStatus" TEXT DEFAULT 'DISCONNECTED',
    "metaPhoneNumberId" TEXT,
    "metaWabaId" TEXT,
    "metaAccessToken" TEXT,
    "instagramConnected" BOOLEAN DEFAULT false,
    "instagramKeywordsJson" TEXT,
    "quizConfigJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Usuários com RBAC
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "senhaHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN_EMPRESA',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "idx_user_org" ON "User"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "User"("email");

-- 4. Tabela de Leads com Atribuição Total
CREATE TABLE IF NOT EXISTS "Lead" (
    "id" TEXT PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "assignedUserId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "telefoneHash" TEXT NOT NULL,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NOVO',
    "prioridade" TEXT NOT NULL DEFAULT 'WARM',
    "score" INTEGER NOT NULL DEFAULT 50,
    "scoreJustificativa" TEXT,
    "valorNegocio" DOUBLE PRECISION DEFAULT 0,
    "origemCanal" TEXT NOT NULL DEFAULT 'WHATSAPP',
    "utmSource" TEXT,
    "utmCampaign" TEXT,
    "utmMedium" TEXT,
    "directKeyword" TEXT,
    "quizAnswersJson" TEXT,
    "notasInternasJson" TEXT,
    "empresa" TEXT,
    "ramoInteresse" TEXT,
    "resumoIa" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "idx_lead_org" ON "Lead"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_lead_org_status" ON "Lead"("organizationId", "status");
CREATE INDEX IF NOT EXISTS "idx_lead_org_score" ON "Lead"("organizationId", "score");
CREATE INDEX IF NOT EXISTS "idx_lead_tel_hash" ON "Lead"("telefoneHash");

-- 5. Conversas e Mensagens (WhatsApp + Instagram Direct)
CREATE TABLE IF NOT EXISTS "Conversation" (
    "id" TEXT PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "leadId" TEXT NOT NULL REFERENCES "Lead"("id") ON DELETE CASCADE,
    "canal" TEXT NOT NULL DEFAULT 'WHATSAPP',
    "status" TEXT NOT NULL DEFAULT 'ABERTO',
    "ultimoContato" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "idx_conversation_org" ON "Conversation"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_conversation_lead" ON "Conversation"("leadId");

CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT PRIMARY KEY,
    "conversationId" TEXT NOT NULL REFERENCES "Conversation"("id") ON DELETE CASCADE,
    "remetenteTipo" TEXT NOT NULL,
    "tipoConteudo" TEXT NOT NULL DEFAULT 'TEXTO',
    "conteudo" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "audioDuration" INTEGER,
    "statusEnvio" TEXT NOT NULL DEFAULT 'ENVIADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "idx_message_conv" ON "Message"("conversationId");

-- 6. Agendamentos
CREATE TABLE IF NOT EXISTS "Appointment" (
    "id" TEXT PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "leadId" TEXT NOT NULL REFERENCES "Lead"("id") ON DELETE CASCADE,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "dataHorario" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AGENDADO',
    "tipo" TEXT NOT NULL DEFAULT 'VISITA',
    "lembreteEnviado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "idx_appointment_org" ON "Appointment"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_appointment_org_date" ON "Appointment"("organizationId", "dataHorario");

-- 7. Documentos e Chunks de RAG com Suporte a pgvector
CREATE TABLE IF NOT EXISTS "KnowledgeDocument" (
    "id" TEXT PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "urlOriginal" TEXT,
    "tamanhoBytes" INTEGER DEFAULT 0,
    "totalChunks" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "idx_knowledge_doc_org" ON "KnowledgeDocument"("organizationId");

CREATE TABLE IF NOT EXISTS "KnowledgeChunk" (
    "id" TEXT PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "documentId" TEXT NOT NULL REFERENCES "KnowledgeDocument"("id") ON DELETE CASCADE,
    "chunkIndex" INTEGER NOT NULL DEFAULT 0,
    "conteudoTexto" TEXT NOT NULL,
    "embeddingJson" TEXT,
    "embedding" vector(1536), -- Coluna nativa de pgvector (1536 dimensões OpenAI)
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "idx_knowledge_chunk_org" ON "KnowledgeChunk"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_knowledge_chunk_doc" ON "KnowledgeChunk"("documentId");

-- Índice HNSW de alta performance para busca por similaridade de cossenos
CREATE INDEX IF NOT EXISTS "idx_knowledge_chunk_vector_hnsw" 
ON "KnowledgeChunk" 
USING hnsw (embedding vector_cosine_ops);

-- 8. Função Stored Procedure de Busca Semântica em Alta Velocidade no PostgreSQL
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
    query_embedding vector(1536),
    match_threshold float,
    match_count int,
    p_organization_id text
)
RETURNS TABLE (
    id text,
    documento_titulo text,
    conteudo_texto text,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kc.id,
        kd.titulo AS documento_titulo,
        kc."conteudoTexto" AS conteudo_texto,
        (1 - (kc.embedding <=> query_embedding))::float AS similarity
    FROM "KnowledgeChunk" kc
    JOIN "KnowledgeDocument" kd ON kd.id = kc."documentId"
    WHERE kc."organizationId" = p_organization_id
      AND kc.embedding IS NOT NULL
      AND (1 - (kc.embedding <=> query_embedding)) > match_threshold
    ORDER BY kc.embedding <=> query_embedding ASC
    LIMIT match_count;
END;
$$;
