# 🚀 Guia de Deploy Desacoplado: Vercel ($0) + Railway + Supabase

Este guia documenta como fazer o deploy profissional de cada parte do sistema usando o mesmo repositório do GitHub.

---

## 🗺️ Mapa de Deploy

| Serviço | Pasta no Repositório | Plataforma | Custo Estimado | Domínio Sugerido |
| :--- | :--- | :--- | :--- | :--- |
| **Landing Page + Quiz** | `apps/landing` | **Vercel** | **$0** (Hobby) | `seusite.com` |
| **Painel B2B (Dashboard)** | `apps/web` | **Vercel** | **$0** (Hobby) | `app.seusite.com` |
| **API & Webhooks da IA** | `apps/api` | **Railway** | **~$5/mês** | `api.seusite.com` |
| **Banco de Dados & RAG** | `packages/database` | **Supabase** | **$0** (Free Tier) | Centralizado |

---

## 1. Deploy da Landing Page na Vercel (`seusite.com`)

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório do GitHub.
2. Na tela de configuração:
   * **Project Name:** `omni-sdr-landing`
   * **Framework Preset:** `Next.js`
   * **Root Directory:** Clique em **Edit** e selecione `apps/landing`.
3. Em **Environment Variables**, adicione:
   ```env
   NEXT_PUBLIC_APP_URL="https://app.seusite.com"
   NEXT_PUBLIC_API_URL="https://api.seusite.com"
   ```
4. Clique em **Deploy**.

---

## 2. Deploy do Painel B2B na Vercel (`app.seusite.com`)

1. No painel da Vercel, clique em **Add New...** $\rightarrow$ **Project**.
2. Selecione o **mesmo repositório** do GitHub.
3. Na tela de configuração:
   * **Project Name:** `omni-sdr-dashboard`
   * **Framework Preset:** `Next.js`
   * **Root Directory:** Clique em **Edit** e selecione `apps/web`.
4. Em **Environment Variables**, adicione:
   ```env
   DATABASE_URL="postgresql://postgres.[REF]:[SENHA]@aws-0-[REGIAO].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[REF]:[SENHA]@aws-0-[REGIAO].pooler.supabase.com:5432/postgres"
   NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_anon_key"
   SUPABASE_SERVICE_ROLE_KEY="sua_service_role_key"
   SESSION_SECRET="sua_chave_secreta_minimo_32_caracteres"
   NEXT_PUBLIC_APP_URL="https://app.seusite.com"
   ```
5. Clique em **Deploy**.

---

## 3. Deploy do Backend da IA no Railway (`api.seusite.com`)

1. Acesse [railway.app](https://railway.app) e clique em **New Project** $\rightarrow$ **Deploy from GitHub repo**.
2. Selecione o repositório.
3. Nas configurações do serviço no Railway (**Settings**):
   * **Root Directory:** `apps/api`
   * **Build Command:** `npm run build`
   * **Start Command:** `npm run start`
4. Em **Variables** no Railway, adicione:
   ```env
   PORT=8080
   DATABASE_URL="postgresql://postgres.[REF]:[SENHA]@aws-0-[REGIAO].pooler.supabase.com:6543/postgres?pgbouncer=true"
   OPENAI_API_KEY="sk-proj-..."
   META_WEBHOOK_VERIFY_TOKEN="omni_verify_token_2026"
   ELEVENLABS_API_KEY=""
   VAPI_API_KEY=""
   ```
5. No Railway, vá em **Networking** $\rightarrow$ **Generate Domain** ou conecte seu subdomínio customizado `api.seusite.com`.

---

## 4. Configurar os Webhooks na Meta (WhatsApp / Instagram)

No [Meta for Developers](https://developers.facebook.com):
1. **Callback URL:** `https://api.seusite.com/api/webhooks/whatsapp`
2. **Verify Token:** O mesmo valor definido em `META_WEBHOOK_VERIFY_TOKEN` (ex: `omni_verify_token_2026`).
3. **Campos Assinados:** Selecione `messages`.
