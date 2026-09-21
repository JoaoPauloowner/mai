# 🚀 Omni Service SaaS — Plataforma Unificada de Service-as-a-Software com IA

> **Plataforma B2B Multi-Vertical & Multi-Tenant de Inteligência Comercial e Atendimento Autônomo.**  
> Unifica Marketing, Atendimento WhatsApp/Instagram, Qualificação de Leads (SDR) e Gestão Comercial em uma única torre de controle de alta conversão.

---

## 🌟 Visão Geral

O **Omni Service SaaS** resolve a fragmentação entre Marketing e Vendas através de uma arquitetura modular que se adapta instantaneamente ao nicho do cliente:

* 🚗 **Módulo Automotivo:** Catálogo de estoque no pátio, avaliação de carros usados na troca por foto (GPT-4o Vision) e agendamento de test-drives.
* 🛡️ **Módulo Corretora de Seguros:** Speed-to-lead agressivo (< 45s), chamadas ativas de voz por IA (Vapi.ai), extração de CNH por imagem e radar preditivo de renovações de apólices.
* 📊 **Módulo Contábil & Fiscal:** Emissão e cobrança de guias (DAS/DARF) com PIX copia e cola, auditoria de XMLs de NF-e e Helpdesk departamental (Fiscal, DP, Societário).
* 🏥 **Módulo Clínicas & Saúde:** Agendamento de consultas 24/7, confirmação automática para combate a faltas (anti no-show) e triagem de exames.
* 💼 **Módulo Geral B2B:** SDR de pré-vendas com simulação de presença de áudio gravado na hora (PTT) e Mini-Quiz de captação.

---

## 🎛️ Modos de Acesso & Subdomínios

A aplicação opera sob um único código-fonte na nuvem, roteando a experiência por permissões e subdomínio:

1. **Modo Demonstração Comercial (`demo.seusistema.com.br`):**
   * Acesso exclusivo para o administrador (`ROLE = SUPER_ADMIN`).
   * Permite alternar a visualização entre Automotivo, Seguros, Contábil e Clínicas em 1 segundo via **Demo Switcher**.
2. **Ambiente Oficial do Cliente (`app.seusistema.com.br`):**
   * Acesso do cliente (`ROLE = ADMIN_EMPRESA` ou `VENDEDOR`).
   * Interface limpa e restrita exclusivamente ao nicho contratado (o cliente nunca vê os outros módulos).
3. **Página Pública de Mini-Quiz (`quiz.seusistema.com.br/[slug]`):**
   * Formulário dinâmico de 3 perguntas para tráfego pago que alimenta o SDR com dados qualificados antes do chat.

---

## 🛠️ Stack Tecnológica

* **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Tipografia JetBrains Mono tabular.
* **Backend & APIs:** Next.js Route Handlers + Node.js + Microserviço Baileys (WhatsApp QR Code).
* **Banco de Dados:** Prisma ORM com SQLite (local) ou PostgreSQL (produção) com isolamento estrito via `organizationId`.
* **Segurança & Sessão:** `iron-session` criptografada com cookies HttpOnly, senhas em BCrypt, rate limiting e deduplicação SHA-256.
* **Motores de IA:** OpenAI GPT-4o-mini (raciocínio e visão), Gemini 1.5 Flash (contexto longo), Vapi.ai (ligações de voz) e Whisper (áudio).

---

## ⚡ Como Rodar o Projeto Localmente

```bash
# 1. Instalar as dependências
npm install

# 2. Configurar o arquivo de ambiente
cp .env.example .env

# 3. Gerar o banco e popular dados de demonstração
npx prisma db push
npm run db:seed

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse **`http://localhost:3000`** no seu navegador.

---

## 📚 Documentação Técnica Completa

Consulte os manuais técnicos detalhados na pasta [`docs/`](./docs/):
* 🏛️ [Arquitetura & Fluxos de Dados](./docs/ARCHITECTURE.md)
* 🧠 [Agentes de IA & Prompts por Nicho](./docs/AGENTS_AND_PROMPTS.md)
* 🔒 [Segurança, Multi-Tenancy & LGPD](./docs/CYBERSECURITY_LGPD.md)
* 🎨 [Design System & Padrões Visuais](./docs/DESIGN_SYSTEM.md)
* 🚀 [Guia de Deploy em Produção](./docs/DEPLOYMENT_GUIDE.md)
