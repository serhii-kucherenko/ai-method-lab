# Wild Locomotion Desk — Design system

**Display name:** Wild Locomotion Desk  
**Slug:** `wild-locomotion-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.13579v1  
**Authors' code:** none published  

Never brand the product as APT-RL. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Wild Locomotion Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Skill library + perception + autonomous transitions for mixed obstacles — method experiment, not an APT-RL controller
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Trail pine mist atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Switch skills — clear mixed obstacles |
| **Supporting** | Skill library plus onboard perception and autonomous transitions — against a single-skill flat-terrain policy that fails on stairs, gaps, and hurdles. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare multi-skill plans against single-skill flat, perception-blind, and no-transition baselines
2. Keep locomotion jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so locomotion scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / terrain profile catalog; locomotion job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (naive vs multi-skill); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page; obstacle clearance strip; scenario JSON export

### How it works

1. Open the desk and create a locomotion job under a terrain profile  
2. Run scenario compare — naive flat policy vs multi-skill perceptive plan  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors' quadruped controller or commercial robot stacks. Never brand APT-RL as the product name.

### Sources

- Paper: https://arxiv.org/abs/2607.13579v1  
- Authors' code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--wld-ink` | Primary text | `#1a2a24` |
| `--wld-muted` | Secondary text | `#5a6b63` |
| `--wld-paper` | Page ground | `#eef4f0` |
| `--wld-mist` | Soft panel | `#d4e0d9` |
| `--wld-steel` | Brand / CTA | `#2f6b52` |
| `--wld-steel-deep` | Hover / emphasis | `#1f4a38` |
| `--wld-cyan` | Accent (trail line) | `#4a7a68` |
| `--wld-ok` | Success | `#2f6b5a` |
| `--wld-warn` | Caution | `#8a5a2f` |
| `--wld-line` | Hair rules (sparingly) | `#c5d4cc` |

Atmosphere: cool trail paper → soft radial pine mist + subtle grid hint. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Outfit** | Hero + wordmark |
| Body / UI | **Source Sans 3** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **IBM Plex Mono** | Goldens, deltas, job ids |

### Layout rules

- One job per section; cards only when they contain interaction
- No hero overlays / pill clusters / stat-strip clutter
- Landing first viewport: brand + headline + support + CTA + route field visual only

### Motion (2–3)

1. Route-field segment trace draw-in (`scd-trace`)
2. Desk nav active underline settle (`wld-nav-active`)
3. Soft content reveal on desk panes (`wld-reveal`)

### shadcn theme

Radius `0.5rem`; primary maps to `--wld-steel`; muted/mist panels; components: Button, Input, Label, Card, Badge, Tabs, Table, Select, Textarea, Separator.

## Page map

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|----------------|
| `/` | Marketing landing | Open desk → `/jobs` | N/A |
| `/jobs` | Locomotion job CRUD | Create job | Empty list copy |
| `/lifecycle` | Status transitions | Advance | Illegal transition message |
| `/scenario` | Naive vs multi-skill compare | Run compare | Cheat reject |
| `/batch` | Sibling transitions | Run batch | Partial fail note |
| `/audit` | Trail + CSV | Export CSV | Empty audit |
| `/goldens` | Dual-impl browser | Refresh | Fixture miss |
| `/honesty` | Fence + Sources | Back to desk | N/A |
| `/settings` | Webhook rotate | Rotate | Auth error |

## Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default, floating hero badges, and APT-RL as brand.
