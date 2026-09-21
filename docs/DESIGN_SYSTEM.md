# 🎨 Design System & Padrões Visuais Semânticos
### Omni Service SaaS — Interface Institucional de Alta Densidade

---

## 1. Filosofia Estética & Princípios Visuais

A interface foi concebida para transmitir **confiança financeira, velocidade operacional e densidade de informação**, inspirada nos melhores softwares B2B do mundo (Linear, Raycast, Stripe e Bloomberg Terminal):

* **Dark Mode Nativo com Glassmorphism Sutil:** Superfícies escuras profundas (`#0a0e13` e `#121820`) combinadas com bordas translúcidas sutis e desfoque de fundo (`backdrop-blur-md`).
* **Tipografia Dupla Estruturada:**
  * **Textos e Rótulos:** Fonte moderna sem serifa (`Inter` / `Poppins`) para máxima legibilidade.
  * **Dados, Valores e Prazos:** Fonte monospaçada tabular (`JetBrains Mono` com `tabular-nums`) para que tabelas de preços, contadores regressivos e scores nunca oscilem visualmente.
* **Microinterações Táteis:** Feedback de clique instantâneo (`active:scale-[0.98]`), transições suaves de 150ms e botões com foco acessível.

---

## 2. Paleta de Cores e Tokens Globais

```css
:root {
  /* Superfícies */
  --bg-page: #0a0e13;
  --bg-surface: #121820;
  --bg-elevated: #1a222d;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(255, 255, 255, 0.18);

  /* Textos */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  /* Cores Semânticas de Estado */
  --color-success: #10b981; /* Verde esmeralda (Ganho, Pago, Confirmado) */
  --color-warning: #f59e0b; /* Âmbar (A vencer, Em qualificação) */
  --color-danger: #ef4444;  /* Vermelho (Perdido, Vencido, No-show) */
  --color-info: #0ea5e9;    /* Azul elétrico (Novo lead, WhatsApp) */
}
```

---

## 3. Identidade de Cores Adaptativa por Segmento

A barra lateral e os acentos visuais adaptam-se suavemente para refletir a identidade do nicho selecionado:

| Segmento | Cor de Acento Principal | Propósito Visual |
|---|---|---|
| 🚗 **Automotivo** | `#f59e0b` (Âmbar / Laranja Velocidade) | Energia comercial, dinamismo de pátio e agilidade. |
| 🛡️ **Seguros** | `#00ddd7` (Ciano / Azul Institucional) | Segurança patrimonial, solidez e precisão financeira. |
| 📊 **Contábil** | `#10b981` (Esmeralda / Verde Fiscal) | Conformidade tributária, auditoria e sucesso contábil. |
| 🏥 **Clínicas** | `#06b6d4` (Turquesa Saúde / Violeta) | Higiene, tranquilidade e cuidado com o paciente. |
| 💼 **Geral B2B** | `#6366f1` (Índigo Tecnológico) | Versatilidade, inteligência artificial e sofisticação. |

---

## 4. Componentes Chave

1. **Lead Score Badge (`LeadScoreBadge.tsx`):**
   * Exibe a pontuação de 0 a 100 com coloração semântica (Vermelho < 40, Amarelo 40-70, Verde > 70) acompanhado da justificativa gerada pela IA em tooltip ou subtítulo.
2. **Reprodutor de Áudio PTT (`AudioPlayerPTT.tsx`):**
   * Visual idêntico ao WhatsApp: botão de play circular, onda sonora verde estilizada, duração em minutos/segundos e foto de perfil do remetente.
3. **Seletor de Demonstração (`DemoSwitcher.tsx`):**
   * Pílula flutuante no topo com alternância rápida entre os 5 segmentos, exibida estritamente para usuários com perfil `SUPER_ADMIN`.
