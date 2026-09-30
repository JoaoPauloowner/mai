# Relatório de Implementação: WhatsApp Embedded Signup & Ciclo de Vida Meta Cloud API

> **Repositório:** `mai (OMNAI)`  
> **Branch:** `hardening/pre-launch`  
> **Data:** 29 de Setembro de 2026  
> **Status:** Concluído com 100% de testes unitários aprovados e TypeScript sem erros.

---

## 1. O que foi implementado de fato (Arquivo : Linha)

### Tarefa 1 — Passar `config_id` no `FB.login()`
- [apps/web/src/app/dashboard/settings/whatsapp/page.tsx:134](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/apps/web/src/app/dashboard/settings/whatsapp/page.tsx#L134): Adicionado `config_id: process.env.NEXT_PUBLIC_META_EMBEDDED_SIGNUP_CONFIG_ID` nas opções do `window.FB.login()`, preservando `scope`, `extras`, `return_scopes` e `enable_profile_selector`.
- [.env.example:22-25](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/.env.example#L22-L25): Documentada a variável `NEXT_PUBLIC_META_EMBEDDED_SIGNUP_CONFIG_ID`.

### Tarefa 2 — Troca do token curto por token de longa duração (60 dias) e Centralização
- [apps/web/src/lib/meta.ts:34-68](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/apps/web/src/lib/meta.ts#L34-L68): Implementada a função `exchangeForLongLivedToken(shortLivedToken)` que consome o endpoint `oauth/access_token?grant_type=fb_exchange_token&client_id={appId}&client_secret={appSecret}&fb_exchange_token={token}`.
- [apps/web/src/lib/meta.ts:16-28](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/apps/web/src/lib/meta.ts#L16-L28): Criado o helper centralizado `getMetaTokenForOrg(organizationId)` com comentários explicativos para futura migração unificada via `META_SYSTEM_USER_TOKEN`.
- [apps/web/src/app/api/settings/whatsapp/route.ts:61-63](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/apps/web/src/app/api/settings/whatsapp/route.ts#L61-L63): O endpoint `POST` (`action: EMBEDDED_SIGNUP`) executa a troca segura no servidor e persiste apenas o token de longa duração no campo `metaAccessToken` da organização.

### Tarefa 3 — Assinatura de Webhooks na WABA do Cliente (`subscribed_apps`)
- [apps/web/src/app/api/settings/whatsapp/route.ts:91-110](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/apps/web/src/app/api/settings/whatsapp/route.ts#L91-L110): Adicionada requisição `POST https://graph.facebook.com/v21.0/{wabaId}/subscribed_apps?access_token={token}`. Falhas são tratadas sem abortar o salvamento e retornam o alerta claro no campo `subscribedAppsWarning` do payload JSON.

### Tarefa 4 — Registro do Número na Cloud API (`/register`)
- [apps/web/src/app/api/settings/whatsapp/route.ts:112-142](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/apps/web/src/app/api/settings/whatsapp/route.ts#L112-L142): Adicionada chamada `POST https://graph.facebook.com/v21.0/{phoneNumberId}/register` com PIN aleatório de 6 dígitos gerado com `crypto.randomInt(100000, 999999)`. Trata o código de retorno `133010` (número já registrado anteriormente) como sucesso operacional.

### Tarefa 5 — Handler do Webhook `account_update`
- [apps/api/src/routes/webhooks.ts:199-256](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/apps/api/src/routes/webhooks.ts#L199-L256): Handler para `changes[0].field === "account_update"`. Identifica a organização pelo `metaWabaId` ou `metaPhoneNumberId`, atualiza `whatsappStatus` para `"RESTRICTED"` (em casos de restrição/banimento) ou `"CONNECTED"` (em casos de liberação/verificação), grava `AuditLog` e responde com HTTP 200 sem expor PII.

### Tarefa 6 — Feedback de Expiração e Invalidação de Tokens
- [apps/web/src/lib/meta.ts:70-88](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/apps/web/src/lib/meta.ts#L70-L88) e [apps/api/src/services/meta.ts:18-38](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/apps/api/src/services/meta.ts#L18-L38): Criada a função `isMetaTokenExpired(errorData)` cobrindo código `190`, subcódigos `463`/`467` e padrões de erro de expiração/revogação de token.
- [apps/api/src/services/meta.ts:83-125](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/apps/api/src/services/meta.ts#L83-L125): Ao detectar erro 190 no envio automático do SDR, altera imediatamente o `whatsappStatus` da organização para `"DISCONNECTED"` e insere registro de `AuditLog`.
- [apps/web/src/app/api/conversations/[id]/messages/route.ts:94-113](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/apps/web/src/app/api/conversations/[id]/messages/route.ts#L94-L113): Ao disparar mensagem manual pelo operador e receber erro 190 da Meta, atualiza `whatsappStatus` para `"DISCONNECTED"`, refletindo instantaneamente no badge do painel do cliente.
- [tests/embedded_signup_meta.test.ts:1-49](file:///c:/Users/Usuario/OneDrive/Documentos/n8n_fluxos/21-mai-sdrai/tests/embedded_signup_meta.test.ts#L1-L49): Testes unitários cobrindo todos os cenários de detecção de expiração e erros operacionais.

---

## 2. Variáveis de Ambiente Novas (Necessário preenchimento manual)

As seguintes variáveis devem ser adicionadas/configuradas no `.env` de desenvolvimento e nas variáveis de ambiente da **Railway / Vercel**:

| Variável | Onde obter o valor | Finalidade |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_META_EMBEDDED_SIGNUP_CONFIG_ID` | **Meta for Developers** > Seu App > WhatsApp > Configuração > Embedded Signup > *ID de Configuração* (gerado após criar a configuração de fluxo). | Abre a tela guiada de WhatsApp Embedded Signup no popup do Facebook ao invés de login genérico. |
| `META_APP_ID` ou `NEXT_PUBLIC_FACEBOOK_APP_ID` | **Meta for Developers** > Painel do Aplicativo > *ID do Aplicativo* (cabeçalho da página). | Utilizado no `FB.init()` e na troca de tokens via OAuth `fb_exchange_token`. |
| `META_APP_SECRET` | **Meta for Developers** > Configurações do App > Básico > *Chave Secreta do Aplicativo* (App Secret). | Troca segura de token curto para longa duração no backend e validação do HMAC `X-Hub-Signature-256`. |
| `META_SYSTEM_USER_TOKEN` *(Opcional / Futuro)* | **Meta Business Manager** > Configurações do Negócio > Usuários do Sistema > Criar Usuário do Sistema > Gerar Token Permanente com permissões `whatsapp_business_management`, `whatsapp_business_messaging`. | Token mestre permanente para evitar expiração por organização (arquitetura multi-tenant recomendada). |

---

## 3. Análise da Chamada `/register` (Tarefa 4) com Base na Documentação da Meta

### O que a documentação oficial da Meta Cloud API estabelece:
1. **Obrigatoriedade:** Para que um número recém-adicionado via Embedded Signup possa enviar e receber mensagens na Cloud API, ele precisa estar **registrado** no endpoint `POST /v21.0/{phone-number-id}/register`.
2. **Formato do Payload:**
   ```json
   {
     "messaging_product": "whatsapp",
     "pin": "123456"
   }
   ```
3. **Casos em que o registro é dispensado ou automático:**
   - No **Embedded Signup v4 / Onboarding FBE**, se o número já possuir registro e PIN de verificação em duas etapas prévio, a chamada de `/register` pode retornar o erro:
     ```json
     {
       "error": {
         "message": "(#133010) Phone number already registered",
         "code": 133010
       }
     }
     ```
4. **Implementação adotada:**
   - O código dispara o `/register` utilizando um PIN criptográfico de 6 dígitos gerado via `crypto.randomInt(100000, 999999)`.
   - O código trata **tanto a resposta `{"success": true}` quanto o código `133010` como sucesso operacional**, garantindo que números novos sejam registrados e números já existentes não bloqueiem o fluxo.

---

## 4. Suposições e Recomendações para Validação com WABA Real de Testes

1. **Conta de Teste WABA Real:** A verificação dos fluxos HTTP da Graph API em tempo de execução foi validada via simulações e mocks unitários (`vitest`). Recomenda-se realizar um teste ponta a ponta clicando no botão do painel (`/dashboard/settings/whatsapp`) com uma conta de Facebook / WABA real para validar:
   - Se o `config_id` cadastrado no portal da Meta possui todas as permissões aprovadas (`whatsapp_business_management`, `whatsapp_business_messaging`, `business_management`).
   - Se o popup do Facebook completa a autorização e fecha adequadamente com o callback `response.authResponse`.
2. **Token de Longa Duração vs. Usuário de Sistema:**
   - A troca por token de longa duração (`fb_exchange_token`) estende o acesso de 1–2 horas para **60 dias**.
   - Conforme estruturado em `getMetaTokenForOrg` (`apps/web/src/lib/meta.ts`), a transição para `META_SYSTEM_USER_TOKEN` definitivo pode ser feita a qualquer momento sem quebrar o banco existente.
3. **Assinatura de Webhook (`subscribed_apps`):**
   - É necessário que o Webhook do seu aplicativo Meta (`https://mai-production-e8ef.up.railway.app/api/webhooks/whatsapp`) esteja configurado no portal de desenvolvedores com o campo `messages` e `account_update` ativados.

---

## 5. Histórico de Commits Atômicos

```text
f5b9c3d feat(whatsapp): handle expired and invalid Meta tokens with automatic DISCONNECTED status and audit logging [Tarefa 6]
a3e20a2 feat(webhooks): handle Meta WhatsApp account_update events and phone status updates [Tarefa 5]
13cf1d9 feat(whatsapp): add phone number Cloud API registration via /register endpoint with crypto PIN [Tarefa 4]
263ca30 feat(whatsapp): subscribe app to client WABA webhooks via subscribed_apps endpoint [Tarefa 3]
7d06e3a feat(whatsapp): exchange short-lived token for 60-day long-lived token and centralize getMetaTokenForOrg helper [Tarefa 2]
38e04ff feat(whatsapp): pass config_id to FB.login for dedicated Meta Embedded Signup [Tarefa 1]
```
