# ⚡ OmniSDR — SaaS B2B de SDR com IA & Atendimento Omnichannel

> Plataforma B2B para qualificação automática de leads, atendimento 24/7 e agendamento comercial com Inteligência Artificial via WhatsApp, Instagram Direct e Voz.

---

## 🏛️ Arquitetura de Produção Desacoplada

O projeto é estruturado como um **Monorepo** com NPM Workspaces para permitir deploys independentes e econômicos:

* **`apps/landing`** $\rightarrow$ Site institucional e Quiz público de diagnóstico ([Vercel](https://vercel.com) — Plano Gratuito $0).
* **`apps/web`** $\rightarrow$ Painel B2B com CRM Kanban, Inbox Unificado, RAG e Supabase Auth ([Vercel](https://vercel.com) — Plano Gratuito $0).
* **`apps/api`** $\rightarrow$ Motor de IA, Webhooks assíncronos da Meta e background workers ([Railway](https://railway.app) — ~$5/mês).
* **`packages/database`** $\rightarrow$ Esquema centralizado do Prisma com PostgreSQL e extensão `pgvector` ([Supabase](https://supabase.com)).

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
* Node.js 20+
* NPM 10+

### Instalação
```bash
# 1. Clonar o repositório
git clone https://github.com/JoaoPauloowner/mai.git
cd mai

# 2. Instalar todas as dependências do monorepo
npm install

# 3. Gerar o cliente do banco de dados
npm run db:generate
```

### Comandos de Desenvolvimento
```bash
# Rodar o Painel B2B (Porta 3000)
npm run dev:web

# Rodar a Landing Page (Porta 3001)
npm run dev:landing

# Rodar a API / Webhooks no Railway (Porta 8080)
npm run dev:api
```

---

## 📚 Documentação do Projeto

| Documento | Descrição |
| :--- | :--- |
| **[`PRD.md`](./PRD.md)** | Documento de Requisitos de Produto (Regras de negócio, personas e jornadas). |
| **[`TRD.md`](./TRD.md)** | Documento de Requisitos Técnicos (Arquitetura, pgvector, SSE e APIs). |
| **[`DEPLOY.md`](./DEPLOY.md)** | Manual passo a passo para deploy na Vercel, Railway e Supabase. |
| **[`INTEGRATIONS.md`](./INTEGRATIONS.md)** | Mapa de integração com Meta (WhatsApp/Instagram), OpenAI, ElevenLabs, Vapi e Stripe. |
| **[`ARCHITECTURE.md`](./ARCHITECTURE.md)** | Diagrama de fluxo de dados, estrutura de pastas e modelo de entidades. |
| **[`PROMPTS.md`](./PROMPTS.md)** | Engenharia de Prompts do SDR IA, System Prompts e Function Calling. |
| **[`LEGAL.md`](./LEGAL.md)** | Termos de Uso e Política de Privacidade compatíveis com a LGPD. |
| **[`TESTING.md`](./TESTING.md)** | 5 cenários de estresse e auditoria de respostas da IA. |

---

## 🔒 Segurança e Conformidade
* Criptografia de senhas com **bcrypt** e isolamento estrito multi-tenant por `organizationId`.
* Sanitização de entradas contra Prompt Injection e SQL Injection parametrizado.
* Em conformidade com a **LGPD (Lei Geral de Proteção de Dados)**.

---

© 2026 OmniSDR Technologies. Todos os direitos reservados.
