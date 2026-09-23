# 🚀 MAI — Motor de Atendimento & Inteligência (Omni Service SaaS)

> **Plataforma B2B Modular & Agnóstica de Pré-Vendas (SDR), Atendimento Multicanal e Atribuição de ROI com Inteligência Artificial.**

---

## 🌟 Visão Geral & Arquitetura Universal

O **MAI** opera sob a arquitetura **One Core Agnóstico**: um produto enxuto, rápido e universal que atende qualquer segmento comercial (Varejo, Automotivo, Seguros, Saúde, Serviços e B2B) sem necessidade de código ou telas engessadas.

A inteligência operacional é moldada dinamicamente no **painel de configurações** através de:

1. 📚 **Base de Conhecimento Dinâmica (RAG):** Upload de manuais, tabelas de preços, estoques e políticas da empresa para consulta instantânea da IA.
2. 📅 **Agendamentos & Anti No-Show:** Integração de agenda para marcação de visitas, test-drives, consultas e reuniões com régua de confirmação 24h e 2h antes.
3. 🎯 **Atribuição Ponta a Ponta:** Rastreamento completo do ROI (UTMs do tráfego pago até a venda fechada no CRM).

---

## 🛠️ Stack Tecnológica

* **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
* **Backend & APIs:** Next.js Route Handlers + Node.js + Microserviço WhatsApp (QR Code / Meta Cloud API).
* **Banco de Dados:** Prisma ORM com SQLite (local) ou PostgreSQL (produção) com isolamento multi-tenant via `organizationId`.
* **Segurança & Sessão:** `iron-session` criptografada com cookies HttpOnly, senhas em BCrypt e conformidade com LGPD.
* **Motores de IA:** GPT-4o-mini, Gemini 1.5 Flash (contexto longo/RAG), Vapi.ai (voz) e Whisper (áudio PTT).

---

## 📖 Documentações do Repositório

* 🏗️ [Arquitetura Modular & RAG (docs/ARCHITECTURE_MODULAR_RAG.md)](./docs/ARCHITECTURE_MODULAR_RAG.md)
* 📐 [Arquitetura de Dados e Multi-Tenancy (docs/ARCHITECTURE.md)](./docs/ARCHITECTURE.md)
* 🧠 [Engenharia de Prompts e Agentes (docs/AGENTS_AND_PROMPTS.md)](./docs/AGENTS_AND_PROMPTS.md)
* 🔒 [Segurança e LGPD (docs/CYBERSECURITY_LGPD.md)](./docs/CYBERSECURITY_LGPD.md)
* 🚢 [Guia de Deploy (docs/DEPLOYMENT_GUIDE.md)](./docs/DEPLOYMENT_GUIDE.md)

---

## ⚡ Como Rodar o Projeto Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Gerar banco e rodar seed de teste
npx prisma db push
npm run db:seed

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse em: `http://localhost:3000`  
**Credenciais de Acesso:** `admin@omni.com.br` / `admin123`
