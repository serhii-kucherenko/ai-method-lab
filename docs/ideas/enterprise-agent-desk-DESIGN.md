# Enterprise Agent Desk — Design system

**Display name:** Enterprise Agent Desk  
**Slug:** `enterprise-agent-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.17331v1  
**Authors' code:** none published  

Never brand the product as Agentic ERP. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Enterprise Agent Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Compare multi-agent coordinated ERP planning against a single-agent baseline — method experiment, not a commercial ERP automation product
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Soft plant/grid atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | One agent stalls where five roles coordinate |
| **Supporting** | See how a multi-agent coordinator score beats a single-agent baseline on role-aligned agents and workflow functions — in a method-lab desk, not a commercial ERP automation product. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare multi-agent ERP coordination against a single-agent baseline in one scenario
2. Keep plan jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project catalog; plan job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (single-agent vs multi-agent); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page

### How it works

1. Open the desk and create a plan job under a project  
2. Run scenario compare — single-agent baseline vs multi-agent coordinator score  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors’ Agentic ERP system. Not a commercial ERP automation product. Never brand as Agentic ERP.

### Sources

- Paper: https://arxiv.org/abs/2607.17331v1  
- Authors’ code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--ead-ink` | Primary text | `#1c241c` |
| `--ead-muted` | Secondary text | `#5a6558` |
| `--ead-paper` | Page ground | `#f0f3ee` |
| `--ead-mist` | Soft panel | `#dde4d8` |
| `--ead-teal` | Brand / CTA (forest) | `#2f5d3a` |
| `--ead-teal-deep` | Hover / emphasis | `#1e3d28` |
| `--ead-cyan` | Accent (brass) | `#9a6b2f` |
| `--ead-ok` | Success | `#2f6b4f` |
| `--ead-warn` | Caution | `#8a6a2f` |
| `--ead-line` | Hair rules (sparingly) | `#c5ced6` |

Atmosphere: cool moss paper → forest/brass radial wash + faint plan-grid. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Literata** (Google Fonts) | Soft literary serif; hero + wordmark |
| Body / UI | **Source Sans 3** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **Source Code Pro** | Goldens, deltas, job ids |

### Layout rules

- One job per section; cards only when they contain interaction
- No hero overlays / pill clusters / stat-strip clutter
- Landing sells; desk chrome starts after CTA

### Motion (2–3)

1. Soft hero fade/rise on brand + headline  
2. Plan-grid line draw on `PlanField`  
3. Nav active underline settle  

### shadcn theme

Radius `--radius: 0.5rem`; primary maps to `--ead-teal`; components: Button, Card, Input, Label, Badge, Table, Tabs, Textarea, Select, Separator.

## Page map

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|----------------|
| `/` | Marketing landing | Open desk → `/jobs` | n/a |
| `/jobs` | Plan job CRUD | Create job | Empty list copy |
| `/lifecycle` | Transitions | Advance status | Illegal transition toast |
| `/scenario` | Single-agent vs multi-agent | Run compare | Reject reason |
| `/batch` | Sibling transitions | Run batch | Partial failure rows |
| `/audit` | Trail + CSV | Export CSV | Empty audit |
| `/goldens` | ≥25 fixtures | Refresh | Fail badge |
| `/honesty` | Fence + sources | Open desk | n/a |
| `/settings` | Webhook rotate | Rotate | Forbidden for viewer |

## Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default.
