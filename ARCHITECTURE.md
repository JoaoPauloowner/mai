# 🏛️ ARCHITECTURE.md — Arquitetura Canônica do OmniSDR

---

## 1. Visão Geral da Topologia Monorepo

```text
21-mai-sdrai/
├── apps/
│   ├── landing/                  ← (Vercel $0) Site Institucional + Quiz (/quiz/[slug])
│   ├── web/                      ← (Vercel $0) Painel B2B (Next.js SSR + Supabase Auth)
│   └── api/                      ← (Railway ~$5) Servidor Express 24/7 de Webhooks e IA
├── packages/
│   └── database/                 ← Prisma Schema, Migrations Supabase & pgvector
└── docs/                         ← Documentação técnica complementar
```

---

## 2. Diagrama de Fluxo de Dados e Automação

```mermaid
graph TD
    subgraph Canais_Externos[Canais de Entrada]
        MetaWA[WhatsApp Meta Cloud API]
        MetaIG[Instagram Direct & Posts]
        QuizLead[Mini-Quiz Público de Diagnóstico]
    end

    subgraph Plataforma_SaaS[Arquitetura do SaaS]
        VercelLP[apps/landing - Vercel]
        VercelWeb[apps/web - Vercel]
        RailwayAPI[apps/api - Railway Worker 24/7]
        SupabaseDB[(Supabase PostgreSQL + pgvector)]
    end

    subgraph Provedores_IA[Motores de Inteligência]
        OpenAI[OpenAI GPT-4o & Embeddings]
        ElevenLabs[ElevenLabs Audio PTT]
        Vapi[Vapi Voice Calling]
    end

    QuizLead -->|Submit HTTP| VercelLP
    VercelLP -->|Forward Lead| RailwayAPI
    MetaWA -->|Webhook HTTP 200| RailwayAPI
    MetaIG -->|Webhook HTTP 200| RailwayAPI

    RailwayAPI -->|Busca Semântica HNSW| SupabaseDB
    RailwayAPI -->|Geração de Resposta| OpenAI
    OpenAI -->|Texto / Function Call| RailwayAPI
    RailwayAPI -->|Gera Áudio OGG| ElevenLabs
    RailwayAPI -->|Grava Lead / Chat| SupabaseDB
    RailwayAPI -->|Responde Mensagem| MetaWA

    VercelWeb -->|Consome Dados / Auth| SupabaseDB
```

---

## 3. Esquema de Entidades no Supabase PostgreSQL

```mermaid
erDiagram
    Organization ||--o{ User : "possui"
    Organization ||--o{ Lead : "possui"
    Organization ||--o{ Conversation : "possui"
    Organization ||--o{ KnowledgeDocument : "possui"
    KnowledgeDocument ||--o{ KnowledgeChunk : "fatiado em"
    Lead ||--o{ Conversation : "tem"
    Conversation ||--o{ Message : "contém"
    Lead ||--o{ Appointment : "agenda"

    Organization {
        string id PK
        string nome
        string slug UK
        string segmento
        string plano
        string whatsappNumber
    }

    Lead {
        string id PK
        string organizationId FK
        string nome
        string telefone
        string status
        int score
        string utmSource
        string utmCampaign
        string directKeyword
    }

    KnowledgeChunk {
        string id PK
        string organizationId FK
        string documentId FK
        text conteudoTexto
        vector_1536 embedding
    }
```

---

## 4. Lógica de Autenticação e Segurança
1. **Frontend (Next.js):** Utiliza `@supabase/ssr` para gerenciar tokens JWT através de cookies seguros `httpOnly`.
2. **Middleware:** A rota `/dashboard/*` verifica a existência do usuário logado antes de qualquer renderização visual.
3. **Multi-Tenancy:** Cada consulta ao banco obrigatoriamente aplica o filtro `organizationId`, assegurando isolamento rigoroso entre clientes B2B.
