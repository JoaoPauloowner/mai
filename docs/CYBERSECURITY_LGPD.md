# 🔒 Políticas de Cibersegurança, Governança Multi-Tenant & LGPD
### Omni Service SaaS — Arquitetura de Proteção de Dados

---

## 1. Princípio do Isolamento Estrito Multi-Tenant (`Tenant Guard`)

A segurança de dados entre diferentes empresas contratantes da plataforma segue o princípio inviolável de **Isolamento por Linha (Row-Level Multi-Tenancy)**:

1. **Associação Obrigatória:** Toda entidade no banco de dados (`Lead`, `Conversation`, `Message`, `Vehicle`, `InsurancePolicy`, `TaxGuide`, `Appointment`) possui a coluna indexada `organizationId`.
2. **Injeção Automática de Tenant:** Todas as operações de leitura, escrita, atualização ou exclusão executadas no backend derivam o `organizationId` estritamente do token de sessão autenticado (`iron-session` / JWT).
3. **Filtro Duplo para Operadores:** Usuários com perfil `VENDEDOR` só podem visualizar leads atribuídos a eles ou leads da sua respectiva empresa.
4. **Prevenção de Enumeração:** Qualquer tentativa de acessar um recurso pertencente a outra empresa retorna **HTTP 404 (Not Found)** em vez de HTTP 403, impedindo que terceiros descubram a existência de IDs no banco.

---

## 2. Conformidade com a LGPD (Lei Geral de Proteção de Dados)

### A. Deduplicação e Proteção com Hash SHA-256
* O número de telefone do lead é normalizado no padrão internacional E.164 (`+55...`).
* O sistema gera e armazena um hash criptográfico unilateral `SHA-256(telefone + organizationId)` para realizar buscas de duplicidade ultra-rápidas sem descriptografar dados sensíveis.

### B. Sanitização e Mascaramento de Prompts de IA
* Antes de enviar qualquer texto para provedores externos de LLM (OpenAI, Gemini, Anthropic), o sistema remove ou mascara:
  * Senhas bancárias e de certificados digitais.
  * Números de cartões de crédito.
* Dados de CNH extraídos por OCR são armazenados em campos protegidos com acesso restrito a administradores.

### C. Direito ao Esquecimento & Exclusão de Dados
* O sistema implementa o endpoint de exclusão de contato (`DELETE /api/leads/[id]`) que expurga dados pessoais de leads mediante solicitação, mantendo apenas registros anônimos para fins estatísticos de faturamento.

---

## 3. Segurança em Webhooks e APIs

* **Assinatura HMAC-SHA256:** Todos os webhooks recebidos da Meta (WhatsApp Cloud API e Instagram) têm seus cabeçalhos `X-Hub-Signature-256` validados contra o `APP_SECRET` da Meta.
* **Proteção contra Força Bruta (Rate Limiting):**
  * Rotas de autenticação (`/api/auth/login`): Máximo de 5 tentativas por IP a cada 60 segundos.
  * Mini-Quizzes públicos (`/api/quiz/submit`): Máximo de 10 submissões por minuto por IP para evitar ataques de injeção de leads falsos.
* **Headers HTTP Blindados:** Aplicação automática de `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block` e políticas rígidas de CORS.

---

## 4. Rotina de Backup Criptografado Automático

* Um cronjob interno executa a cada 24 horas a rotina `performDatabaseBackup()`.
* O backup do banco de dados (SQLite/Postgres) é compactado, criptografado e versionado localmente e em volume externo (S3/DigitalOcean Spaces), com retenção de 30 dias.
