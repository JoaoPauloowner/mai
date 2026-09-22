# MAI Internal Design System

## Direction

The authenticated product uses the same visual language established for the new marketing site, adapted for operational software.

Reference characteristics:
- light SaaS workspace;
- compact navigation;
- generous whitespace;
- white cards on a warm-gray canvas;
- graphite typography;
- orange action/accent color;
- restrained borders and shadows;
- dense data presented in clear modules;
- AI treated as a product capability, not decoration.

The supplied Shoppers reference is inspiration only. No source code, copy, assets, or proprietary identity is being reproduced.

## Tokens

| Role | Value |
|---|---|
| Action | #FF6A2A |
| Action dark | #EB5417 |
| Ink | #171717 |
| Muted | #6F6F6F |
| Canvas | #F4F4F2 |
| Surface | #FFFFFF |
| Subtle surface | #FAFAFA |
| Border | #E7E7E4 |
| Success | #247A4A |
| Danger | #B42318 |

Legacy WACT/lime/sage tokens remain only where required for compatibility during migration.

## Component vocabulary

- PageHeader
- MetricCard
- DataTable
- DataTableHeader
- DataTableScroll
- AIAssistant
- Button
- Card
- StatusBadge

Shared exports live in src/components/ui/index.ts.

## Layout rules

Application pages should generally use:
- max width around 1440px;
- 20–28px page gutters;
- 12–16px component gaps;
- cards with 12px radius;
- subtle borders;
- minimal shadows;
- 10–12px metadata;
- 14–22px section/page titles;
- 26px+ primary metrics.

## Product patterns

### Dashboard
KPI row → performance chart → conversion/secondary insight → recent records → AI assistant → operational shortcuts.

### CRM
Pipeline columns remain dense but breathable. Use orange for primary actions, selected states and meaningful emphasis.

### Inbox
The workspace can be information-dense, but message content remains the visual priority.

### Leads
Tables prioritize identity, source, status, score and value. Filters remain compact and persistent.

### Settings
Use grouped cards and clear section headers instead of long undifferentiated forms.

## Migration rule

Do not redesign business logic while migrating visuals. Preserve routes, APIs, Prisma models, authentication, permissions and existing data flows.

## QA

Before merging:
1. npm run lint
2. npm run build
3. Check dashboard, CRM, inbox, leads, campaigns and settings at desktop/mobile widths.
4. Verify no legacy dark-mode classes or hardcoded legacy palette values remain in migrated surfaces.
5. Verify keyboard focus, contrast and loading/empty/error states.
