# Joint Care Desk — Design system

**Display name:** Joint Care Desk  
**Slug:** `joint-care-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.12527v2  
**Authors' code:** none published  

Never brand the product as OrthoPilot / CHEESE / OrthoBench / ORACLE. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Joint Care Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Dual-evidence pathway plans (hospital + external + stage-aware) — method experiment, not OrthoPilot
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Clinic slate atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Ground both worlds — stage the pathway |
| **Supporting** | In-hospital evidence plus external knowledge and stage-aware care — against parametric-memory-only or single-world plans that miss admission through rehab. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare dual-evidence plans against parametric, hospital-only, and external-only baselines
2. Keep pathway jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so pathway scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / indication profile catalog; pathway job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (naive vs dual-evidence); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page; missing-evidence acquisition strip; scenario JSON export

### How it works

1. Open the desk and create a pathway job under an indication profile  
2. Run scenario compare — naive parametric / single-world vs dual-evidence stage-aware plan  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors' OrthoPilot system or commercial clinical AI vendors. Never brand OrthoPilot / CHEESE / OrthoBench / ORACLE as the product name.

### Sources

- Paper: https://arxiv.org/abs/2607.12527v2  
- Authors' code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--jcd-ink` | Primary text | `#1a2838` |
| `--jcd-muted` | Secondary text | `#5a6674` |
| `--jcd-paper` | Page ground | `#f0f4f7` |
| `--jcd-mist` | Soft panel | `#dde5ec` |
| `--jcd-steel` | Brand / CTA | `#2d6a8a` |
| `--jcd-steel-deep` | Hover / emphasis | `#1e4a62` |
| `--jcd-cyan` | Accent (pathway line) | `#4a8a78` |
| `--jcd-ok` | Success | `#3d6b55` |
| `--jcd-warn` | Caution | `#8a6a2f` |
| `--jcd-line` | Hair rules (sparingly) | `#c5d0d9` |

Atmosphere: cool clinic paper → soft radial slate mist + subtle grid hint. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Outfit** | Hero + wordmark |
| Body / UI | **Source Sans 3** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **IBM Plex Mono** | Goldens, deltas, job ids |

### Layout rules

- One job per section; cards only when they contain interaction
- No hero overlays / pill clusters / stat-strip clutter
- Landing first viewport: brand + headline + support + CTA + pathway strip visual only

### Motion (2–3)

1. Pathway-stage strip draw-in (`jcd-trace`)
2. Desk nav active underline settle (`jcd-nav-active`)
3. Soft content reveal on desk panes (`jcd-reveal`)

### shadcn theme

Radius `0.5rem`; primary maps to `--jcd-steel`; muted/mist panels; components: Button, Input, Label, Card, Badge, Tabs, Table, Select, Textarea, Separator.

## Page map

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|----------------|
| `/` | Marketing landing | Open desk → `/jobs` | N/A |
| `/jobs` | Pathway job CRUD | Create job | Empty list copy |
| `/lifecycle` | Status transitions | Advance | Illegal edge message |
| `/scenario` | Dual-evidence vs naive | Run compare | Reject / cheat |
| `/batch` | Sibling transitions | Batch apply | Partial fail rows |
| `/audit` | Audit trail | Export CSV | Empty org |
| `/goldens` | Fixture browser | Refresh | Fail card |
| `/honesty` | Limits / sources | Back to desk | N/A |
| `/settings` | Webhook / roles | Rotate secret | Viewer forbidden |
