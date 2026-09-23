# 🧠 MAI — ARQUITETURA MODULAR & UNIVERSAL (ONE CORE SDR)
## Motor de Atendimento, Qualificação e Atribuição com IA

---

## 1. VISÃO GERAL & PRINCÍPIO DE PRODUTO

O **MAI** foi desenhado para ser **100% genérico, limpo e modular**.
O código da aplicação não possui telas, tabelas ou fluxos engessados para nichos específicos (como Concessionárias, Corretoras ou Clínicas).

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                    ONE CORE AGNOSTIC PLATFORM                          │
 │                                                                        │
 │  • Multicanal: WhatsApp (QR Code / Meta Cloud API) + Instagram Direct  │
 │  • CRM Kanban & Qualificação Automática de Leads (Lead Score 0-100)    │
 │  • Atribuição Ponta a Ponta de Vendas & ROI (UTMs + Direct Keywords)   │
 │  • Agendamentos Inteligentes & Anti No-Show (Show Rate Optimizer)      │
 └────────────────────────────────────┬───────────────────────────────────┘
                                      │
                         INJEÇÃO DE CONTEXTO POR TENANT
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
   🚗 VAREJO AUTO              🛡️ CORRETORAS DE SEGURO          🏥 CLÍNICAS & SAÚDE
   • Manual/Estoque (RAG)      • Tabela de Cotações (RAG)       • Procedimentos/Convênios (RAG)
   • Regras de Test-Drive      • Régua de Renovações (D-30/D-7) • Confirmação 24h/2h
```

A inteligência operacional da IA é moldada **dinamicamente no Onboarding/Configurações** através de três pilares:
1. **Base de Conhecimento Dinâmica (RAG + Context Injection)**
2. **Integração de Agenda & Horários**
3. **Mecanismo de Atribuição Ponta a Ponta**

---

## 2. PILAR 1: BASE DE CONHECIMENTO & RAG (KNOWLEDGE BASE)

A IA não alucina preços, itens de estoque ou coberturas. Ela responde com base nos documentos e regras cadastradas pelo próprio cliente.

### 2.1 Como funciona o fluxo:
1. **Upload / Entrada de Dados:** O cliente faz upload de arquivos (`PDF`, `DOCX`, `XLSX`, `CSV`) ou preenche caixas de texto com perguntas frequentes, lista de produtos/serviços e políticas de atendimento.
2. **Vetorização & Chunking:** O conteúdo é fatiado em blocos semânticos e indexado.
3. **Busca Semântica no Atendimento (RAG):**
   - Quando o Lead pergunta: *"Quais as opções de SUV até 120 mil?"* ou *"Qual o valor da profilaxia?"*
   - O sistema busca os trechos mais relevantes do arquivo do tenant e injeta no `System Prompt` como contexto confiável.

### 2.2 Schema de Variáveis e Regras:
```typescript
interface TenantKnowledgeBase {
  organizationId: string;
  regrasNegocio: {
    tomVoz: "CONSULTIVO" | "DIRETO" | "FORMAL" | "HUMORADO";
    objetivoPrincipal: "AGENDAR_VISITA" | "COLETAR_DADOS_COTACAO" | "FECHAR_LINK_PAGAMENTO";
    limiteDescontoMaximoPercentual?: number;
    condicoesPagamento: string[];
    criteriosQualificacaoSql: string[]; // Requisitos para Lead Score > 70
  };
  arquivosDocumentos: Array<{
    id: string;
    titulo: string;
    tipo: "ESTOQUE" | "TABELA_PRECOS" | "FAQ" | "REGULAMENTO";
    conteudoVetorizadoUrl: string;
  }>;
}
```

---

## 3. PILAR 2: INTEGRAÇÃO DE AGENDAMENTOS & ANTI NO-SHOW

O sistema conecta o fluxo de qualificação da IA diretamente à agenda do negócio.

### 3.1 Consulta de Disponibilidade:
- A IA lê os slots livres do calendário (Google Calendar / Outlook / Agenda Interna do CRM).
- Apresenta no chat opções naturais: *"Tenho disponível amanhã às 14h ou sexta às 10h. Qual prefere?"*

### 3.2 Confirmação e Régua Anti No-Show:
1. **Slot Reservado:** O evento é criado como `PENDENTE` ou `AGENDADO`.
2. **Disparo D-24h:** Mensagem automática no WhatsApp solicitando confirmação de presença (`1 para Confirmar`, `2 para Remarcar`).
3. **Disparo D-2h:** Mensagem com endereço, mapa, orientações de estacionamento e lembrete humanizado.
4. **Reencaixe Automático:** Caso o paciente/cliente cancele, o horário é liberado para a fila de espera.

---

## 4. PILAR 3: ATRIBUIÇÃO PONTA A PONTA (ROAS & ROI)

O MAI rastreia a origem do lead desde o primeiro clique até o faturamento da venda.

### 4.1 Captura de Origem:
- **Tráfego Pago (Meta Ads / Google Ads):** Parâmetros de URL capturados via cookies/query:
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.
- **Instagram Direct:** Palavra-chave disparada (ex: `#QUERO_DESCONTO`, `#SEGURO_AUTO`).
- **QR Code / Balcão:** Tag de canal físico.

### 4.2 Jornada do Lead no CRM:
```
[CLIQUE NO ANÚNCIO] 
       │ (utm_campaign: "black_friday_2026")
       ▼
[CONVERSA NO WHATSAPP / DIRECT]
       │
       ▼
[QUALIFICAÇÃO PELA IA (Score 85 - Alta Prioridade)]
       │
       ▼
[AGENDAMENTO DE REUNIÃO / VISITA]
       │
       ▼
[TRANSPORTE PARA VENDEDOR HUMANO]
       │
       ▼
[STATUS: VENDA FECHADA (R$ 15.000)]
       │
       ▼
[DASHBOARD DE ATRIBUIÇÃO] ──> Anúncio "black_friday_2026" gerou R$ 15.000 em vendas reais.
```

---

## 5. COMO CONFIGURAR NOVOS NICHOS (ONBOARDING GUIA)

Para atender qualquer segmento comercial, basta preencher a tela de **Configurações**:

| Segmento | O que cadastrar na Base de Conhecimento | Objetivo da IA | Ação de Conversão |
| :--- | :--- | :--- | :--- |
| **Concessionárias** | Estoque atualizado (modelos, anos, km, opcionais, fotos) | Identificar veículo de interesse e entrada | Agendar Test-Drive no Showroom |
| **Corretoras** | Tabela de coberturas, seguradoras parceiras, regras FIPE | Coletar CEP pernoite, CPF e modelo do carro | Gerar Cotação / Ligação de Corretor |
| **Clínicas Médicas / Odonto** | Lista de especialidades, exames, convênios aceitos | Identificar queixa, sintomas e convênio | Agendar Consulta / Procedimento |
| **Imobiliárias** | Catálogo de imóveis, valores de condomínio/IPTU, localização | Identificar orçamento, bairro e perfil de compra | Agendar Visita com Corretor |
| **Escritórios / Serviços** | Escopo de atuação, regime tributário, honorários base | Identificar faturamento e dores da empresa | Agendar Reunião Diagnóstica Online |

---

## 6. CONCLUSÃO

Com essa arquitetura:
1. O repositório permanece **limpo, rápido e fácil de manter**.
2. Não existe código legado nem telas duplicadas para cada nicho.
3. O software atende múltiplos mercados apenas alterando os dados de entrada no painel de configurações.
