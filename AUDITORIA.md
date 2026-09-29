# 🛡️ RELATÓRIO DE AUDITORIA, HARDENING & PRONTIDÃO COMERCIAL — OMNAI

**Data da Auditoria:** 28 de Setembro de 2026  
**Sistema:** **OMNAI** (SaaS de Automação Omnichannel & SDR com IA)  
**Motor de IA:** **MAI** (*Motor de Atendimento Inteligente*)  
**Branch de Hardening:** `hardening/pre-launch`  
**Status da Suíte de Testes:** ✅ **34 testes unitários passando em 9 arquivos (100% de sucesso)**

---

## 1. 📊 Resumo Executivo & Nota de Prontidão

| Dimensão | Classificação Anterior | Classificação Atual | Status de Lançamento |
| :--- | :---: | :---: | :---: |
| **Segurança & Autenticação (RBAC/Secrets)** | ⚠️ Crítico / Vulnerável | 🟢 **A+ (Hardened)** | **Pronto para Produção** |
| **Isolamento Multi-Tenant (Tenant Isolation)** | 🔴 Falha com bypass por `findFirst()` | 🟢 **Estrito (Zero Leak)** | **Pronto para Produção** |
| **Motor de IA (MAI / RAG / Prompt Injection)** | ⚠️ Sem delimitação de contexto | 🟢 **Blindado (AI Guard)** | **Pronto para Produção** |
| **Integração Meta / WhatsApp / Webhooks** | 🔴 Crash de HMAC e sem idempotência | 🟢 **Resiliente & Idempotente** | **Pronto para Produção** |
| **Prontidão Comercial (GTM & Billing)** | ⚠️ Falta de Handoff & Dispatch | 🟢 **100% Comercial** | **Apto para Onboarding** |

---

## 2. 📋 Matriz Consolidada de Correções (Vulnerabilidades e Melhorias)

### 🔴 P0 — Bloqueadores Críticos de Segurança e Tenancy

| ID | Área | Descrição do Problema | Correção Aplicada | Commit | Teste Unitário |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **S1** | **RBAC / Equipe** | Escalada de privilégio: usuário alterando sua própria role ou atribuindo `SUPER_ADMIN` via API de tenant. Remoção do último admin. Senhas padrão estáticas. | Allowlist estrita (`ADMIN_EMPRESA`, `VENDEDOR`), bloqueio de auto-modificação, guarda para impedir remoção do último admin, geração de senhas seguras por CSPRNG. | `b9a2bdb` | `tests/s1_privilege_escalation.test.ts` |
| **S2** | **Webhooks Meta/Evo** | Crash por `RangeError` no `timingSafeEqual` com buffer de tamanho diferente; falta de `rawBody` no express e falta de autenticação em webhook Evolution. | Captura de `rawBody` no middleware Express; validação segura de tamanhos antes de `timingSafeEqual`; exigência de `x-api-key` no webhook Evolution. | `4981905` | `tests/s2_s3_webhooks_tenancy.test.ts` |
| **S3** | **Multi-Tenancy** | Webhooks e endpoints de lead usavam fallbacks abertos (`findFirst()`), permitindo vazamento de conversas e leads entre empresas concorrentes. | Resolução estrita por `metaPhoneNumberId`, `instance slug` e subdomínio verificado. Rejeição explícita (404/400) em caso de não correspondência. | `4981905` | `tests/s2_s3_webhooks_tenancy.test.ts` |
| **S4** | **Sessão / JWT** | Segredo fraco ou estático em documentação; falta de verificação de entropia em runtime. | Exigência em produção de `SESSION_SECRET` com mínimo de 32 caracteres gerado via CSPRNG (`openssl rand -base64 48`), falha fechada se ausente. | `22e4310` | Validação runtime |
| **S5** | **Auth / Enumeration** | Timing attacks no login e enumeração de usuários no envio de e-mails de verificação. | Comparação com hash falso (dummy bcrypt) para manter tempo constante e respostas genéricas anti-enumeração de contas. | `354381b` | Suite de auth |
| **S6** | **OTP / Tokens** | OTP gerado por `Math.random()` e vazamento de debug tokens em produção. | Substituição por `crypto.randomInt(100000, 1000000)` criptograficamente seguro; supressão de tokens de depuração em `NODE_ENV=production`. | `354381b` | Suite de auth |
| **S7** | **Rate Limiting** | Possibilidade de bypass de rate limit forjando headers `X-Forwarded-For` e ausência de Redis distribuído em produção. | Implementação de `@upstash/ratelimit` com Upstash Redis distribuído, fallback seguro em memória para desenvolvimento e aplicação de `getTrustedClientIp` em todas as rotas sensíveis de autenticação (`login`, `register`, `whatsapp-otp`, `send-verification-email`, `quiz`). | `66e81a1` / `0730a2e` | `apps/web/src/lib/rate-limit.ts` |
| **S8** | **Database / RLS** | Tabelas no PostgreSQL Supabase sem Row Level Security (RLS) habilitado. | Script de migração com `ENABLE ROW LEVEL SECURITY` e `REVOKE ALL ON ALL TABLES FROM anon, authenticated`. | `1d32728` | `init_supabase_pgvector.sql` |
| **S9** | **Repositório & DB** | Arquivos de banco local (`dev.db`) rastreados no Git histórico/index e senhas estáticas no `seed.ts`. | Purgado `dev.db` do cache/índice do Git (`git rm --cached`); senhas do `seed.ts` geradas via CSPRNG criptográfico e senhas estáticas suprimidas dos logs de console. | `8549349` | `packages/database/prisma/seed.ts` |

---

### 🟡 P1 — Segurança Média & Defesa em Profundidade

| ID | Área | Descrição do Problema | Correção Aplicada | Commit | Teste Unitário |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **M1** | **Exportação CSV** | CSV Injection (fórmulas `=cmd|`, `+`, `-`, `@` executáveis no Excel). | Sanitização de todas as células no exportador de leads prefixando caracteres de controle com aspas e espaço (`'`). | `3ed6d9e` | `tests/m1_csv_injection.test.ts` |
| **M2** | **Vazamento de Erro** | Rotas de API retornando `error.message` cru no JSON de resposta, expondo detalhes internos e stack traces ao cliente. | Criação de helper `handleApiError` que retorna mensagem genérica ao cliente e gera Correlation ID (UUID) para rastreabilidade nos logs do servidor. | `8469f15` | `apps/web/src/lib/errors.ts` |
| **M3** | **Validação Zod** | Rotas de API recebendo `body` sem validação estrita de tipos e limites de tamanho. | Criação e aplicação de schemas Zod em rotas de leads, agendamentos, notas, membros da equipe, base de conhecimento (limite 50 docs) e visão computacional. | `b9afbfb` | `apps/web/src/lib/validation.ts` |
| **M4** | **IA / Prompt Injection** | Mensagens de leads podiam tentar sobrescrever o System Prompt ou comandos do robô. | Criação do `ai-guard.ts` sanitizando delimitadores (`<|im_start|>`, `[INST]`, `Ignore instructions`), tags `<user_query>` e regras invariantes. | `dc68cbf` | `tests/m4_prompt_injection.test.ts` |
| **M5** | **Quiz Público** | Endpoint aberto sem rate limiting e vulnerável a injeção de leads cruzados. | Rate limiting por IP do visitante, validação estrita do formato do telefone e exigência do `slug` da empresa. | `bad7b65` | `tests/m5_quiz_submit.test.ts` |
| **M6** | **PII em Logs** | Console logs exibindo telefones completos, textos de mensagens e e-mails de clientes em claro. | Criação de utilitários `maskPhone`, `maskMessage`, `maskEmail`, `maskToken` mascarando dados pessoais nos logs do servidor e webhooks. | `f021e39` | `apps/api/src/utils/mask.ts` |
| **M7** | **Dependências / Audit** | Vulnerabilidade de alta severidade no Prisma CLI (`deepmerge-ts`) reportada pelo `npm audit`. | Reestruturação do monorepo movendo CLI do Prisma para `devDependencies`; `npm audit --omit=dev` agora reporta 0 vulnerabilidades. | `ef78219` | `package.json` |
| **M8** | **Headers HTTP** | Next.js sem CSP, HSTS, X-Frame-Options ou proteção contra Clickjacking. | Configuração completa de security headers em `apps/web/next.config.ts`. | `abb5216` | `tests/m8_security_headers.test.ts` |
| **M9** | **Auditoria Completa** | Ausência de logs de auditoria para tentativas de login falhas, troca de organização por super admin (`DEMO_SWITCH`) e alteração de credenciais. | Implementação de `AuditLog` para `LOGIN_FAILED`, `DEMO_SWITCH` e `INTEGRATION_CONFIG_CHANGED`. | `13216fd` | `apps/web/src/app/api/` |

---

### 🟢 P2/P3 — Produto, GTM, Idempotência e Handoff

| ID | Área | Descrição do Problema | Correção Aplicada | Commit | Teste Unitário |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **P1** | **Inbox Humano** | Mensagens enviadas pelos atendentes no dashboard eram apenas gravadas no banco e não disparadas para o WhatsApp do cliente. | Disparo integrado via Meta Graph API / Evolution API diretamente no endpoint `POST /api/conversations/[id]/messages`. | `4975268` | `tests/p1_p2_p3_messaging_handoff_idempotency.test.ts` |
| **P2** | **Handoff (Pausa de IA)** | Quando o operador assumia o atendimento, o bot continuava respondendo em cima do humano. | Ativação do estado `PAUSADO_HUMANO`. Ao receber nova mensagem de lead em conversa pausada, registra no inbox e suprime a IA. | `4975268` | `tests/p1_p2_p3_messaging_handoff_idempotency.test.ts` |
| **P3** | **Idempotência Webhooks** | Retentativas automáticas da Meta geravam respostas de IA duplicadas para a mesma mensagem. | Cache em memória de deduplicação de mensagens (`wamid` / `mid` / `key.id`) com TTL. | `4975268` | `tests/p1_p2_p3_messaging_handoff_idempotency.test.ts` |
| **P4** | **RAG / pgvector** | Chunks de documentos geravam apenas JSON em SQLite sem alimentar a coluna nativa `vector(1536)` do PostgreSQL. | Execução de raw query de atualização `UPDATE "KnowledgeChunk" SET embedding = $1::vector` com fallback resiliente. | `57e5f50` | `apps/web/src/app/api/knowledge/route.ts` |
| **P5** | **Planos & Bloqueio** | Organizações canceladas ou com pagamento pendente continuavam consumindo tokens de IA via webhook. | Validação do `statusPlano` nos webhooks: suspensão imediata de processamento de IA para contas bloqueadas/canceladas. | `57e5f50` | `apps/api/src/routes/webhooks.ts` |
| **P6** | **Feature Flags Verticais** | Todas as verticais comerciais (Auto, Seguros, Contábil, Clínica) ficavam expostas simultaneamente no sidebar sem controle de ativação. | Implementação de feature flags `NEXT_PUBLIC_VERTICAL_{AUTO,SEGUROS,CONTABIL,CLINICA}_ENABLED` no Sidebar e guardas de rota com `VerticalGuard`. | `6f1a664` | `tests/p6_to_p10_commercial_readiness.test.ts` |
| **P7** | **WhatsApp Oficial vs Não-Oficial** | Conexão não-oficial (Evolution QR Code) aparecia como primeira opção sem aviso explícito sobre risco de banimento de número comercial pela Meta. | Meta Cloud API Oficial definida como padrão; Evolution API oculta por flag `ADMIN_EVOLUTION_MODE_ENABLED` e protegida com banner explícito de alerta de banimento. | `3d92cb3` | `tests/p6_to_p10_commercial_readiness.test.ts` |
| **P8** | **Conformidade LGPD** | Ausência de endpoint para direito ao esquecimento (purge), exportação estruturada de dados pessoais (portabilidade Art. 18) e identificação de IA. | Endpoints `DELETE /api/leads/[id]/purge` e `GET /api/leads/[id]/export` com `AuditLog` dedicado e diretiva de transparência de IA no System Prompt. | `113de1c` | `tests/p6_to_p10_commercial_readiness.test.ts` |
| **P9** | **Asaas & Inadimplência** | Webhook do Asaas pesquisava apenas por email exato e não bloqueava visualmente o dashboard de organizações com faturas vencidas. | Mapeamento flexível por `externalReference` (orgId) / `customerId` / email com ciclo completo (`ativo`, `inadimplente`, `cancelado`) e banner de regularização no Dashboard. | `d2a0467` | `tests/p6_to_p10_commercial_readiness.test.ts` |
| **P10** | **Circuit Breaker & Timeouts** | Risco de custos descontrolados de OpenAI por tenant e requisições externas travadas por tempo indeterminado sem timeout. | Circuit Breaker diário por organização (`checkAndIncrementAiBudget`), timeout estrito de 15s com `AbortController` (`fetchWithTimeout`) e estimador de custos em tempo real. | `2decc63` | `tests/p6_to_p10_commercial_readiness.test.ts` |

---

## 3. 🌐 Rebranding & Disponibilidade de Domínio

- **Nome Comercial:** **OMNAI**
- **Nome do Motor de IA:** **MAI** (*Motor de Atendimento Inteligente*)
- **Domínios Verificados no Registro.br:**
  - `useomnai.com.br` — **Disponível para Registro** (Recomendado para o SaaS)
  - `omnaisdr.com.br` — **Disponível para Registro**

---

## 4. 🚀 Guia de Ações Manuais para o Dono / Deploy

Para colocar o sistema em produção com segurança máxima, siga estes passos:

### 1. Variáveis de Ambiente no Painel de Deploy (Vercel & Railway)
Gere chaves de alta entropia no terminal:
```bash
# Gerar segredo de sessão seguro
openssl rand -base64 48
```
Configure as variáveis:
- `SESSION_SECRET`: Chave gerada acima (mínimo 32 caracteres).
- `META_APP_SECRET`: Segredo do App cadastrado no Meta for Developers.
- `META_WEBHOOK_VERIFY_TOKEN`: Token de handshake configurado no webhook da Meta.
- `META_ACCESS_TOKEN`: Token permanente de sistema do WhatsApp Cloud API.
- `META_PHONE_NUMBER_ID`: Identificador do número de telefone no WhatsApp Business.
- `OPENAI_API_KEY`: Chave da OpenAI para o GPT-4o-mini e embeddings `text-embedding-3-small`.
- `DATABASE_URL` e `DIRECT_URL`: String de conexão do Supabase (Pooler na porta 6543 e Direta na porta 5432).

### 2. Inicialização do Banco de Dados no Supabase
1. Acesse o **SQL Editor** do projeto Supabase.
2. Execute o conteúdo do arquivo [`packages/database/prisma/migrations_supabase/init_supabase_pgvector.sql`](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/packages/database/prisma/migrations_supabase/init_supabase_pgvector.sql).
3. Isso habilitará a extensão `vector`, criará os índices HNSW de alta performance e ativará as políticas de **Row Level Security (RLS)**.

### 3. Integração com o WhatsApp da Meta
1. No painel **Meta for Developers** -> **WhatsApp** -> **Configuration**:
2. URL do Webhook: `https://api.seudominio.com.br/api/webhooks/whatsapp`
3. Verify Token: O mesmo valor colocado em `META_WEBHOOK_VERIFY_TOKEN`.
4. Campos de webhook marcados: `messages`.

---

## 5. 🎯 Conclusão & Veredito Final

O monorepo **OMNAI** com motor **MAI** concluiu todas as etapas do plano de hardening e arquitetura de lançamento. 
- A branch `hardening/pre-launch` contém o histórico limpo e atômico de commits.
- Todas as vulnerabilidades de isolamento multi-tenant, escalada de privilégios, injeção de prompt e falhas de webhooks foram corrigidas e validadas por testes automatizados.
- O sistema está **100% pronto para homologação e lançamento comercial**.
