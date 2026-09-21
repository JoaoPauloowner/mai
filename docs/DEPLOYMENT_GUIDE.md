# 🚀 Guia de Deploy & Operação em Produção
### Omni Service SaaS — Vercel, Railway, Docker & VPS

---

## 1. Variáveis de Ambiente Necessárias (`.env`)

Crie o arquivo `.env` na raiz do projeto com as seguintes chaves de configuração:

```bash
# Banco de Dados (SQLite local ou PostgreSQL em produção)
DATABASE_URL="file:./dev.db"
# Para produção no Railway / Supabase / Neon:
# DATABASE_URL="postgresql://usuario:senha@host:5432/omni_saas?schema=public"

# Sessão e Criptografia
SESSION_SECRET="sua_chave_secreta_super_segura_de_no_minimo_32_caracteres"
JWT_SECRET="chave_jwt_para_tokens_de_api"

# Provedores de Inteligência Artificial
OPENAI_API_KEY="sk-proj-..."
GEMINI_API_KEY="AIzaSy..."
VAPI_API_KEY=""              # Opcional: Ligações de voz por IA
VAPI_ASSISTANT_ID=""

# WhatsApp Oficial (Meta Cloud API)
META_APP_ID=""
META_APP_SECRET=""
META_WHATSAPP_CONFIG_ID=""   # Config ID do Embedded Signup
META_WEBHOOK_VERIFY_TOKEN="token_personalizado_para_validar_webhook"

# WhatsApp Não Oficial (Baileys / Evolution API)
WHATSAPP_BRIDGE_URL="http://localhost:8085"
WHATSAPP_BRIDGE_APIKEY="chave_secreta_baileys"

# URLs da Aplicação
NEXT_PUBLIC_APP_URL="https://app.seusistema.com.br"
NEXT_PUBLIC_DEMO_URL="https://demo.seusistema.com.br"
```

---

## 2. Opções de Deploy em Produção

### Opção A: Railway (Recomendada — Tudo em um só lugar)
O Railway permite rodar o Frontend Next.js, o Banco PostgreSQL e o Microserviço Baileys na mesma infraestrutura com deploy contínuo via GitHub:

1. Crie um novo projeto no [Railway.app](https://railway.app/).
2. Adicione um serviço **PostgreSQL**.
3. Adicione o repositório GitHub e conecte a pasta raiz.
4. Adicione as variáveis de ambiente no painel do Railway.
5. O build command executará automaticamente: `npx prisma migrate deploy && npm run build`.

### Opção B: Vercel (Frontend) + Supabase (Postgres)
Ideal para máxima velocidade de carregamento global da interface:

1. Conecte o repositório na [Vercel](https://vercel.com/).
2. Configure a variável `DATABASE_URL` apontando para o seu banco PostgreSQL no **Supabase** (com pooling de conexões ativo na porta 6543).
3. Para o WhatsApp via QR Code (Baileys), hospede o microserviço `whatsapp-bridge` em uma VPS básica ou no Railway, já que o Baileys requer conexão WebSocket persistente.

---

## 3. Configuração de DNS & Subdomínios (Cloudflare ou Registro.br)

Para habilitar a estrutura de roteamento multi-tenant por subdomínio:

| Tipo | Nome | Destino | Propósito |
|---|---|---|---|
| **A / CNAME** | `app` | `cname.railway.app` ou `vercel.app` | Acesso oficial dos clientes pagantes |
| **A / CNAME** | `demo` | `cname.railway.app` ou `vercel.app` | Ambiente de demonstração com Demo Switcher |
| **A / CNAME** | `quiz` | `cname.railway.app` ou `vercel.app` | Links públicos de captação para anúncios |
| **CNAME** | `*` (Wildcard) | `cname.railway.app` | (Opcional) Subdomínios white-label de clientes |
