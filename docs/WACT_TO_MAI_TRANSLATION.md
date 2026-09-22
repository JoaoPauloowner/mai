# WACT TO MAI TRANSLATION MATRIX

> **Princípio Fundamental:** A referência WACT guia exclusivamente a **linguagem visual, composição e hierarquia estética**. A **lógica de produto, regras de negócio, dados e rotas** pertencem 100% ao **MAI**.

---

## 1. Mapeamento de Tokens & Componentes

| Padrão WACT | Significado Visual | Interpretação no MAI | Token / Componente MAI |
| :--- | :--- | :--- | :--- |
| **Lime Accent (`#C1ED84`)** | Destaque máximo, ação e conversão | Botões de CTA primário, última barra do funil, badges de alta qualificação | `var(--lime)`, `bg-[#C1ED84]` |
| **Sage Dark (`#7A8E75`)** | Cor de marca e estrutura executiva | Ícones ativos, títulos de cartões analíticos, cards promocionais da sidebar | `var(--sage)`, `text-[#7A8E75]` |
| **App Canvas (`#F5F5F5`)** | Superfície de trabalho limpa e arejada | Fundo do Dashboard e da aplicação interna | `var(--app-bg)`, `bg-[#F5F5F5]` |
| **Pure White Card (`#FFFFFF`)** | Painéis de dados e listas | Cards de métricas, tabelas de leads, conversas do chat e colunas do Kanban | `var(--card)`, `bg-white` |
| **Sage Scales (`#E7EBE6` a `#2C2E2A`)** | Hierarquia de texto e divisores | Bordas sutis (`#E0E3DE`), textos secundários (`#63695B`) e títulos fortes (`#2C2E2A`) | `text-[#2C2E2A]`, `border-[#E0E3DE]` |

---

## 2. Tradução de Módulos e Telas do MAI

### 2.1 Sidebar do MAI
- **WACT Reference:** Logo em tile lime + seletor de workspace + grupos de navegação claros + card promocional sage.
- **MAI Application:** 
  - Logo do MAI (`Ω`) em tile lime (`#C1ED84`).
  - Navegação organizada por **Operação & Atendimento** (*Caixa de Entrada*, *CRM Kanban*), **Módulos do Nicho Ativo** (*Automotivo*, *Clínicas*, *Seguros*, *Contábil*), **Marketing & Atribuição** (*Torre de Atribuição*, *Campanhas*, *Mini-Quiz*, *Importador*) e **Configurações** (*WhatsApp QR/Meta*, *Instagram*, *IA & Áudio*, *Equipe & Round-Robin*).
  - Cada link mantém sua rota funcional e seu estado ativo com card branco e borda sutil.

### 2.2 CRM Kanban
- **WACT Reference:** Densidade controlada, cartões limpos, status suaves.
- **MAI Application:** 5 colunas com fundo `#F5F5F5`, cartões em `#FFFFFF` com borda sutil, scores em pílulas verdes/âmbar, valores em `Inter font-mono font-bold` e drag-and-drop 100% ativo.

### 2.3 Caixa de Entrada (Inbox)
- **WACT Reference:** Divisores sutis, lista compacta, destaque em mensagens não lidas.
- **MAI Application:** Painel duplo (lista de conversas + chat central + dossiê do lead à direita), reprodução de áudio PTT com waveform lime/sage e alternância suave entre WhatsApp e Instagram.
