# ⚙️ TRD (Technical Requirement Document) — OmniSDR B2B

---

## 1. Arquitetura Técnica do Sistema

O sistema é construído sobre uma arquitetura **Desacoplada Monorepo** orientada a microsserviços leves:

```text
               ┌────────────────────────────────────────────────────────┐
               │                     CLIENTE (BROWSER)                  │
               └───────────┬────────────────────────────────┬───────────┘
                           │                                │
            (Vercel: apps/landing)               (Vercel: apps/web)
                           │                                │
                           ▼                                ▼
               ┌───────────────────────┐        ┌───────────────────────┐
               │  Landing Page & Quiz  │        │  Dashboard B2B (Next) │
               └───────────┬───────────┘        └───────────┬───────────┘
                           │                                │
                           └───────────────┬────────────────┘
                                           │ API REST / JSON
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │        RAILWAY (apps/api - Express 24/7 Worker)        │
               │  - Webhook Receiver (Meta WhatsApp / Instagram)        │
               │  - Async Message Dispatcher & Retry Queue              │
               │  - Motor de IA (OpenAI GPT-4o / ElevenLabs TTS)        │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │              SUPABASE (POSTGRESQL + PGVECTOR)          │
               │  - Auth & Sessões de Usuário                           │
               │  - Extensão nativa 'vector' (1536 dimensões)           │
               │  - Stored Procedure: match_knowledge_chunks            │
               └────────────────────────────────────────────────────────┘
```

---

## 2. Tratamento Assíncrono de Webhooks (Prevenção de Timeout)

### O Problema da Meta (WhatsApp / Instagram):
A Meta exige resposta `200 OK` em menos de **15 segundos**; caso contrário, desativa a inscrição do webhook ou reenvia mensagens duplicadas.

### A Solução Implementada:
1. **Handshake e Ack Imediato:** O endpoint `/api/webhooks/whatsapp` responde com HTTP 200 nos primeiros 50ms.
2. **Processamento em Background:** O payload é encaminhado para execução assíncrona dentro da instância persistente no Railway:
   * Extração de texto e metadados;
   * Busca de contexto semântico via `pgvector`;
   * Chamada ao modelo OpenAI com Function Calling;
   * Envio da resposta de volta ao WhatsApp via Meta Graph API.

---

## 3. Especificação do RAG com pgvector

* **Modelo de Embeddings:** `text-embedding-3-small` (OpenAI) gerando vetores de **1536 dimensões**.
* **Estratégia de Chunking:** Janelas de 400 palavras com sobreposição (*overlap*) de 50 palavras para manter coerência semântica.
* **Índice Vetorial:** Índice **HNSW** (*Hierarchical Navigable Small World*) com operador de distância de cossenos (`vector_cosine_ops`).
* **Consulta SQL Otimizada:**
  ```sql
  SELECT kc.id, kd.titulo, kc."conteudoTexto", 1 - (kc.embedding <=> query_embedding) AS similarity
  FROM "KnowledgeChunk" kc
  JOIN "KnowledgeDocument" kd ON kd.id = kc."documentId"
  WHERE kc."organizationId" = p_organization_id
    AND 1 - (kc.embedding <=> query_embedding) > 0.15
  ORDER BY kc.embedding <=> query_embedding ASC
  LIMIT 4;
  ```

---

## 4. Segurança e Isolamento Multi-Tenant

1. **Isolamento em Nível de Linha (Tenant Boundary):**
   * Toda entidade no banco possui obrigatoriamente a chave estrangeira `organizationId`.
   * Qualquer query de leitura ou escrita via ORM exige a cláusula explícita `where: { organizationId: session.organizationId }`.
2. **Proteção de Rotas com Middleware:**
   * O middleware Next.js (`apps/web/src/middleware.ts`) intercepta todas as requisições em rotas protegidas antes de qualquer renderização de página.
3. **Criptografia e Armazenamento:**
   * Senhas com hash `bcrypt` (10 rounds).
   * Telefones armazenados em formato E.164 com coluna `telefoneHash` (SHA-256) para deduplicação instantânea.
