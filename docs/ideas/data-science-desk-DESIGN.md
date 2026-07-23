# Data Science Desk — Design system

**Display name:** Data Science Desk  
**Slug:** `data-science-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.15901v1  
**Authors' code:** none published  

Never brand the product as DSWorld. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Data Science Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Compare world-model guided routing against a naive step-burn baseline — method experiment, not a commercial data-science agent platform
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Soft teal/mist atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Naive agents burn steps a world model can skip |
| **Supporting** | Score world-model guided routing against a flat naive step-burn baseline — in a method-lab desk, not a commercial data-science agent platform. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare world-model guided routing against a naive step-burn baseline in one scenario
2. Keep agent jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so efficiency scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project catalog; agent job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (naive step-burn vs world-model); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page

### How it works

1. Open the desk and create an agent job under a project  
2. Run scenario compare — naive step-burn baseline vs world-model guided routing  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors’ world-model system. Not a commercial data-science agent platform. Never brand as DSWorld.

### Sources

- Paper: https://arxiv.org/abs/2607.15901v1  
- Authors’ code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--dsd-ink` | Primary text | `#1a2a28` |
| `--dsd-muted` | Secondary text | `#5a6a66` |
| `--dsd-paper` | Page ground | `#eef3f1` |
| `--dsd-mist` | Soft panel | `#dce8e4` |
| `--dsd-teal` | Brand / CTA | `#1f5c52` |
| `--dsd-teal-deep` | Hover / emphasis | `#143f38` |
| `--dsd-cyan` | Accent (warm sand) | `#9a7a3a` |
| `--dsd-ok` | Success | `#2f6b4f` |
| `--dsd-warn` | Caution | `#8a6a2f` |
| `--dsd-line` | Hair rules (sparingly) | `#c5d0cc` |

Atmosphere: cool mist paper → teal/sand radial wash + faint step-route marks. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Literata** (Google Fonts) | Soft literary serif; hero + wordmark |
| Body / UI | **Source Sans 3** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **Source Code Pro** | Goldens, deltas, job ids |

### Layout rules

- One job per section below the fold
- Cards only when they contain interaction (scenario form, job create)
- No hero overlays / pill clusters / stat-strip clutter
- Mobile + desktop both usable

### Motion (2–3)

1. Hero route marks fade/trace in (`.dsd-trace`)
2. Scenario result panel soft reveal (`.std-reveal`)
3. Landing CTA hover deepen on brand teal

### shadcn theme

Radius modest (`--radius` ~0.5rem). Map primary to `--dsd-teal`. Components: Button, Card, Input, Label, Badge, Table, Tabs, Select, Textarea, Separator.

## Page map

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|----------------|
| `/` | Marketing landing | Open desk → `/jobs` | n/a |
| `/jobs` | Agent job desk entry | Create job | “no jobs yet” |
| `/lifecycle` | Transition edges | Advance status | Illegal transition reject |
| `/scenario` | Naive vs world-model | Run compare | step_burn_cheat reject |
| `/batch` | Sibling transitions | Run batch | Per-item reject reasons |
| `/audit` | Timeline + CSV | Export CSV | Empty audit list |
| `/goldens` | ≥25 dual-impl cards | Refresh | Fail card highlight |
| `/honesty` | Fence + sources | Back to desk | n/a |
| `/settings` | Webhook rotate | Rotate secret | Admin-only |

## Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default.
