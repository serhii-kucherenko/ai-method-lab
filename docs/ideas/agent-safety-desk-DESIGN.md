# Agent Safety Desk — Design system

**Display name:** Agent Safety Desk  
**Slug:** `agent-safety-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.14570v1  
**Authors' code:** none published  

Never brand the product as IFG. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Agent Safety Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Compare structural monitoring against a naive checklist baseline for agent deployment regressions — method experiment, not a commercial agent safety vendor product
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Soft monitor-grid atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Checklists miss the regressions that graphs catch |
| **Supporting** | See how a structural monitor score beats a naive checklist baseline on invariant nodes and regression signals — in a method-lab desk, not a commercial agent safety product. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare structural monitoring against checklist scoring in one scenario
2. Keep safety jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project catalog; safety job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (checklist vs structural); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page

### How it works

1. Open the desk and create a safety job under a project  
2. Run scenario compare — checklist baseline vs structural monitor score  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors’ safety monitor system. Not a commercial agent safety vendor product. Never brand as IFG.

### Sources

- Paper: https://arxiv.org/abs/2607.14570v1  
- Authors’ code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--asd-ink` | Primary text | `#1a2332` |
| `--asd-muted` | Secondary text | `#5c6678` |
| `--asd-paper` | Page ground | `#eef1f4` |
| `--asd-mist` | Soft panel | `#e0e5eb` |
| `--asd-teal` | Brand / CTA (steel) | `#2a4a66` |
| `--asd-teal-deep` | Hover / emphasis | `#1c3348` |
| `--asd-cyan` | Accent (amber caution) | `#b8752a` |
| `--asd-ok` | Success | `#2f6b4f` |
| `--asd-warn` | Caution | `#8a6a2f` |
| `--asd-line` | Hair rules (sparingly) | `#c5ced6` |

Atmosphere: cool slate paper → steel/amber radial wash + faint monitor-grid. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Fraunces** (Google Fonts) | Soft contrast serif presence; hero + wordmark |
| Body / UI | **IBM Plex Sans** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **IBM Plex Mono** | Goldens, deltas, job ids |

### Layout rules

- One job per section; cards only when they contain interaction
- No hero overlays / pill clusters / stat-strip clutter
- Landing sells; desk chrome starts after CTA

### Motion (2–3)

1. Soft hero fade/rise on brand + headline  
2. Monitor-grid line draw on `MonitorField`  
3. Nav active underline settle  

### shadcn theme

Radius `--radius: 0.5rem`; primary maps to `--asd-teal`; components: Button, Card, Input, Label, Badge, Table, Tabs, Textarea, Select, Separator.

## Page map

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|----------------|
| `/` | Marketing landing | Open desk → `/jobs` | n/a |
| `/jobs` | Safety job CRUD | Create job | Empty list copy |
| `/lifecycle` | Transitions | Advance status | Illegal transition toast |
| `/scenario` | Checklist vs structural | Run compare | Reject reason |
| `/batch` | Sibling transitions | Run batch | Partial failure rows |
| `/audit` | Trail + CSV | Export CSV | Empty audit |
| `/goldens` | ≥25 fixtures | Refresh | Fail badge |
| `/honesty` | Fence + sources | Open desk | n/a |
| `/settings` | Webhook rotate | Rotate | Forbidden for viewer |

## Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default.
