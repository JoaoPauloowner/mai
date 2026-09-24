# 🔌 INTEGRATIONS.md — Mapa Completo de APIs e Webhooks

Este documento mapeia todas as conexões externas, provedores de inteligência e rotas de webhooks do **OmniSDR**.

---

## 🗺️ Visão Geral das Integrações

| Provedor | Tipo de Integração | Rota / Endpoint no SaaS | Finalidade Principal |
| :--- | :--- | :--- | :--- |
| **Meta WhatsApp** | Webhook Bidirecional & Graph API | `/api/webhooks/whatsapp` | Recebimento e envio de mensagens e áudios. |
| **Meta Instagram** | Webhook de Mensagens & Feed | `/api/webhooks/instagram` | Automação de comentários de post e direct. |
| **OpenAI** | REST API & Embeddings | Interno (`services/ai.ts`) | Cérebro da IA (GPT-4o) e vetores RAG. |
| **ElevenLabs** | REST API Streaming | Interno (`services/tts.ts`) | Geração de áudio humanizado (PTT WhatsApp). |
| **Vapi / Bland** | Webhook & Outbound Call | `/api/webhooks/voice` | Disparo de ligações de voz automáticas. |
| **Stripe / Asaas** | Webhook de Pagamentos | `/api/webhooks/billing` | Liberação automática de planos após checkout. |

---

## 1. Meta Cloud API (WhatsApp Business)
* **Versão da Graph API:** `v20.0`
* **URL de Callback no Meta Developers:** `https://api.seusite.com/api/webhooks/whatsapp`
* **Verify Token:** Configurado na variável de ambiente `META_WEBHOOK_VERIFY_TOKEN`.
* **Campos Assinados no Webhook:** `messages`, `message_deliveries`, `message_reads`.

---

## 2. Meta Instagram Graph API
* **URL de Callback:** `https://api.seusite.com/api/webhooks/instagram`
* **Campos Assinados:** `messages`, `messaging_postbacks`, `comments`.
* **Fluxo de Automação:**
  1. Seguidor comenta palavra-chave (ex: `PROPOSTA`) no Reels ou Post;
  2. A Meta dispara o webhook para a nossa API;
  3. A API envia mensagem direta (DM) no Direct do seguidor e grava a lead no CRM.

---

## 3. OpenAI (Modelos e Embeddings)
* **Modelos Utilizados:**
  * `gpt-4o`: Raciocínio de qualificação avançada, negociação e Function Calling.
  * `gpt-4o-mini`: Respostas rápidas de triagem e conversas simples (< 1s).
  * `text-embedding-3-small`: Geração de vetores para o RAG no Supabase.
  * `whisper-1`: Transcrição de áudios enviados pelos leads no WhatsApp.

---

## 4. ElevenLabs (Voz Humanizada para WhatsApp)
* **Endpoint Utilizado:** `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream`
* **Formato de Saída:** `audio/ogg; codecs=opus` (formato nativo que o WhatsApp exibe com ondas sonoras de áudio gravado na hora).

---

## 5. Vapi / Bland.ai (Agente de Voz Telefônico)
* **URL de Callback do Webhook:** `https://api.seusite.com/api/webhooks/voice`
* **Gatilho de Acionamento:** Quando um lead atinge Score > 80 no Quiz ou CRM, o sistema dispara uma chamada telefônica em tempo real para apresentar a proposta.

---

## 6. Billing & Pagamentos (Stripe / Asaas)
* **URL de Callback do Webhook:** `https://api.seusite.com/api/webhooks/billing`
* **Eventos Mapeados:**
  * `checkout.session.completed` / `PAYMENT_RECEIVED`: Atualiza o status da organização para `statusPlano: "ativo"`.
  * `customer.subscription.deleted` / `PAYMENT_OVERDUE`: Altera o status para `statusPlano: "atrasado"` ou `cancelado`.
