# ds.md — Design System WAct / MAI

Fonte: Screenshot e especificações completas do case no Behance (Dima Strizhak).
Produto: Plataforma de inteligência comercial e atribuição de leads do WhatsApp. Rastreia tráfego pago até a conversa, qualifica com IA e devolve os leads qualificados ao Meta/Google Ads como conversão offline.
Três camadas de design: Identidade, Site de Marketing e Dashboard do Produto.

Legenda de confiança:
- `[VISTO]` está legível no case.
- `[MEDIDO]` cor amostrada por pixel na imagem (compressão JPEG, margem de erro de uns ±3 por canal).
- `[ESTIMADO]` medida visual aproximada (raio, espaçamento).

---

## 1. Ideia central `[VISTO]`

- Uma linguagem visual única, do primeiro anúncio ao fluxo diário de leads.
- O balão de chat verde-menta/lime do logo vira ícone e aparece nos momentos-chave da UI.
- Site: construído em torno da história da atribuição, não de lista de features.
- Dashboard: cada tela responde uma pergunta: *"Os leads estão entrando a um custo aceitável e algo está quebrado?"*
- Identidade: formas mínimas, layouts estruturados, sinal claro. Toda conversa de WhatsApp deve ter uma origem clara.

---

## 2. Cores Oficiais & Tokens

### Marca `[MEDIDO]`

| Token | Hex | Uso |
|---|---|---|
| `--lime` | `#C1ED84` (≈ `#C3F186`) | Destaque, CTA, barra final do funil, ícones sobre sage, palavra-chave em headline |
| `--sage` | `#7A8E75` | Cor de marca escura, cards promocionais, série principal de gráfico |
| `--cream` | `#EAE2CA` | Cards sociais, fundo de mobile, fim do gradiente |
| `--ink` | `#2C2E2A` | Texto principal, logo sobre lime |

### Escala Neutra Esverdeada (Sage Scale) `[MEDIDO]`
```
950 #2C2E2A   900 #393E36   800 #4E5447   700 #63695B   600 #7C8472
500 #969F8E   400 #B5BBAE   300 #D0D5CD   200 #E7EBE6   100 #F7F7F6
```

### Produto (Dashboard Interno) `[MEDIDO]`
```css
--canvas:      #EAEAEA;   /* fundo ao redor da tela */
--app-bg:      #F5F5F5;   /* fundo principal do app */
--card:        #FFFFFF;   /* fundo dos cards de métricas e tabelas */
--card-subtle: #FBFBFB;   /* variação sutil de superfície */
--sage-card:   #7A8D74;   /* card promocional/destaque na sidebar */
--border:      #E0E3DE;   /* bordas sutis e divisores */
```

### Status (Pills & Badges) `[MEDIDO]`
| Estado | Fundo | Texto |
|---|---|---|
| Active / Verified | `#DDE8DE` | Verde Médio (`#2D6A4F`) |
| Disabled / Rejected · Duplicate | `#E9BEC4` | Vermelho Escuro (`#9B2226`) |
| Paused / Phone Unverified | `#E1D6AF` | Âmbar Escuro (`#8F5D18`) |

Deltas nos KPIs: chip com contorno fino, verde para melhora, vermelho para piora. Sparkline com área em degradê suave da mesma cor.

---

## 3. Tipografia `[VISTO]`

- **Headings & Títulos de Seção:** `Neuton` (Bold, Medium) ou Serif editorial moderno.
- **Body & Interface (UI):** `Inter` (Bold, Semibold, Medium, Regular). Tabelas, rótulos, números.
- **Números de KPI:** Inter Semibold 28–32px. Rótulos em Inter Regular 11–12px, cor `--sage-600`.

---

## 4. Estrutura do Dashboard Interno `[VISTO]`

### Shell & Layout
- **Sidebar Limpa:** Logo com tile lime + seletor de workspace + telefone; Grupos de menu: *General* (Dashboard, Leads, Campaigns, Conversations), *Analytics* (Reports, Attribution), *Workspace Settings* (Connections, Integrations, Tracking, Auto-replies, Team & Roles). Item ativo em card branco com leve sombra. Card promocional sage no rodapé com botão lime.
- **Header:** Título da página + subtítulo descritivo, segmented control de período (`7d`, `30d` ativo escuro, `3m`, `6m`, `1y`), dropdown "All sources", botão Export.

### Módulos Principais
1. **KPI Cards (3 lado a lado):** Qualified Leads (`180`), CPL (`$4.20`), Lead Quality Score (`63.8%`). Cada um com ícone no topo, número grande, rótulo, chip de delta e sparkline com área degradê suave.
2. **Conversion Funnel (Funil Horizontal):** Linhas: *Clicks*, *Leads*, *Verified*, *Source matched*, *Sent to Ads*, com contagem e anotação de perda/ganho ao lado. Barras horizontais em cinza neutro e **apenas a última barra (Sent to Ads / Venda) em lime (`#C1ED84`)**.
3. **Sources (Tabela de Origens):** Colunas Source, Clicks, Leads, Qualified, Q-rate, CPL, Status. Checkbox, ícone da plataforma, pill de status.
4. **Recent Activity (Feed ao Vivo de Leads):** Colunas Lead (Nome + Telefone), Source (pill cinza), Status (pill colorida de status), Time, TTC, Cost e menu de ações.
