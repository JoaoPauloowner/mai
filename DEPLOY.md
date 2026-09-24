# 🚀 DEPLOY.md — Manual de Publicação Passo a Passo (Sem Complicações)

Este manual foi escrito para que qualquer pessoa consiga publicar o SaaS em menos de **15 minutos**, mesmo sem experiência prévia em DevOps ou servidores.

---

## 📋 Pré-requisitos
* Uma conta gratuita no [GitHub](https://github.com);
* Uma conta gratuita na [Vercel](https://vercel.com);
* Uma conta no [Railway](https://railway.app);
* Uma conta gratuita no [Supabase](https://supabase.com).

---

## 🟢 Passo 1: Configurar o Banco de Dados no Supabase (5 minutos)

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto (ex: `omnisdr-db`).
2. Defina uma senha forte para o banco e selecione a região `sa-east-1` (São Paulo) ou `us-east-1`.
3. Vá no menu lateral esquerdo em **SQL Editor** (ícone de terminal `>_`) e clique em **New Query**.
4. Abra o arquivo [`packages/database/prisma/migrations_supabase/init_supabase_pgvector.sql`](./packages/database/prisma/migrations_supabase/init_supabase_pgvector.sql), copie todo o texto, cole no editor do Supabase e clique no botão verde **Run**.
5. Vá em **Project Settings** $\rightarrow$ **Database** e anote a sua **Connection String** (Transaction Pooler - porta 6543).

---

## 🟢 Passo 2: Publicar a Landing Page na Vercel (3 minutos)

1. Acesse [vercel.com/new](https://vercel.com/new) e clique em **Import** ao lado do seu repositório.
2. Na tela de configuração:
   * **Project Name:** `omnisdr-landing`
   * **Framework Preset:** `Next.js`
   * **Root Directory:** Clique em **Edit** e selecione a pasta `apps/landing`.
3. Em **Environment Variables**, adicione:
   * `NEXT_PUBLIC_APP_URL` = `https://app.seusite.com`
4. Clique em **Deploy**.

---

## 🟢 Passo 3: Publicar o Painel B2B na Vercel (3 minutos)

1. Na Vercel, clique em **Add New...** $\rightarrow$ **Project** e selecione o **mesmo repositório**.
2. Na tela de configuração:
   * **Project Name:** `omnisdr-dashboard`
   * **Framework Preset:** `Next.js`
   * **Root Directory:** Clique em **Edit** e selecione a pasta `apps/web`.
3. Em **Environment Variables**, adicione:
   * `DATABASE_URL` = *(Sua connection string do Supabase na porta 6543)*
   * `DIRECT_URL` = *(Sua connection string do Supabase na porta 5432)*
   * `NEXT_PUBLIC_SUPABASE_URL` = *(Sua URL do Supabase)*
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *(Sua Anon Key do Supabase)*
   * `SUPABASE_SERVICE_ROLE_KEY` = *(Sua Service Role Key do Supabase)*
   * `SESSION_SECRET` = `omni_saas_ultra_secure_secret_key_change_in_production_2026_at_least_32_bytes`
4. Clique em **Deploy**.

---

## 🟢 Passo 4: Publicar o Motor de IA no Railway (4 minutos)

1. Acesse [railway.app](https://railway.app) e clique em **New Project** $\rightarrow$ **Deploy from GitHub repo**.
2. Selecione o seu repositório.
3. Clique nas configurações do serviço (**Settings**):
   * **Root Directory:** `apps/api`
   * **Build Command:** `npm run build`
   * **Start Command:** `npm run start`
4. Na aba **Variables**, adicione:
   * `PORT` = `8080`
   * `DATABASE_URL` = *(Sua connection string do Supabase)*
   * `OPENAI_API_KEY` = `sk-proj-...`
   * `META_WEBHOOK_VERIFY_TOKEN` = `omni_verify_token_2026`
5. Na aba **Networking**, clique em **Generate Domain** (ex: `omni-api-production.up.railway.app`) ou adicione seu subdomínio `api.seusite.com`.

---

## 🎯 Tabela Resumo das Variáveis

| Variável | Onde vai? (Vercel Web / Railway API) | Onde pegar? |
| :--- | :---: | :--- |
| `DATABASE_URL` | **Vercel Web** e **Railway API** | Supabase $\rightarrow$ Settings $\rightarrow$ Database (porta 6543) |
| `NEXT_PUBLIC_SUPABASE_URL` | **Vercel Web** | Supabase $\rightarrow$ Settings $\rightarrow$ API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Vercel Web** | Supabase $\rightarrow$ Settings $\rightarrow$ API (`anon`) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Vercel Web** e **Railway API** | Supabase $\rightarrow$ Settings $\rightarrow$ API (`service_role`) |
| `OPENAI_API_KEY` | **Railway API** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `META_WEBHOOK_VERIFY_TOKEN` | **Railway API** | Você escolhe qualquer senha segura |
