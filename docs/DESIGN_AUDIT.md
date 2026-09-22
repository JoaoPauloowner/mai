# DESIGN AUDIT — MAI (Motor de Atendimento & Inteligência)

> **Propósito:** Diagnóstico detalhado da arquitetura visual, inconsistências de design e mapa de migração para o Design System inspirado no WACT.

---

## 1. Arquitetura Visual Atual vs Alvo (Target)

| Dimensão | Estado Anterior | Estado Alvo (WACT-Inspired) |
| :--- | :--- | :--- |
| **Paleta Base** | `#0a0d14` (Dark genérico) misturado com `#F5F5F5` (Light parcial) | Fundo limpo `#F5F5F5` com cards `#FFFFFF` e texto `#2C2E2A` |
| **Cor Primária** | Ciano `#00ddd7` arbitrário | Lime `#C1ED84` para ações/conversões e Sage `#7A8E75` para estrutura |
| **Tipografia** | System sans genérico | Inter (UI & Dados) + Geist/Neuton (Headings) |
| **Bordas & Sombras** | Bordas escuras `#1e2638` e sombras pesadas | Bordas sutis `#E0E3DE` e sombras imperceptíveis |
| **Componentização** | Tailwind arbitrário (`bg-[#...]`, `text-[#...]`) em dezenas de arquivos | Tokens semânticos e componentes reutilizáveis em `src/components/ui/` |

---

## 2. Inconsistências Identificadas no Código

1. **Inconsistência de Tema no Root Layout:**
   - `src/app/layout.tsx` definia `className="dark"` com `bg-[#0a0d14]` enquanto o dashboard e a landing page operavam em superfícies claras `#F5F5F5`.
2. **Rotas e Links na Sidebar:**
   - A sidebar precisava manter **100% das rotas e módulos verticais do MAI** (CRM `/dashboard/crm`, Inbox `/dashboard/inbox`, Campanhas `/dashboard/settings/campanhas`, Conexão WhatsApp `/dashboard/settings/whatsapp`, Módulos Automotivo `/dashboard/auto/*`, Clínicas, Seguros, Contábil) sem perder nenhuma navegação funcional.
3. **Status Badges Espalhados:**
   - Cada tabela e card formatava status com classes manuais (`bg-emerald-500/10 text-emerald-400`, `bg-red-500/10 text-red-400`).
4. **Cards e Painéis:**
   - Repetição exaustiva de classes como `p-6 rounded-2xl bg-white border border-[#E0E3DE] shadow-sm`.

---

## 3. Plano de Componentização

- `src/components/ui/Button.tsx`: Botões primários (Lime `#C1ED84`), secundários (White border), ghost e danger.
- `src/components/ui/Card.tsx` & `MetricCard.tsx`: Cartões estruturados com padding e bordas padronizadas.
- `src/components/ui/StatusBadge.tsx`: Centralização de status (`Active`, `Verified`, `Paused`, `Disabled`, `SQL`, `Novo`).
- `src/components/ui/DataTable.tsx`: Tabela consistente com headers, hover e alinhamento tipográfico.
