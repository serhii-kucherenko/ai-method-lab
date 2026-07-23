# Ladder Logic Desk — Design system

**Display name:** Ladder Logic Desk  
**Slug:** `ladder-logic-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.08417v1  
**Authors' code:** none published  

Never brand the product as ESBMC-PLC+ or IEC statute codes. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Ladder Logic Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Compare formal trigger synthesis against a naive scan baseline — method experiment, not a commercial PLC security product
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Soft steel/grid atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Naive scans miss bombs that formal triggers catch |
| **Supporting** | Score formal trigger synthesis against a flat naive scan baseline on adaptive and syntactic triggers — in a method-lab desk, not a commercial PLC security product. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare formal trigger synthesis against a naive scan baseline in one scenario
2. Keep verification jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so bomb scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project catalog; verification job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (naive scan vs formal); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page

### How it works

1. Open the desk and create a verification job under a project  
2. Run scenario compare — naive scan baseline vs formal trigger synthesis  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors’ formal verifier. Not a commercial PLC security product. Never brand as ESBMC-PLC+ or IEC statute codes.

### Sources

- Paper: https://arxiv.org/abs/2607.08417v1  
- Authors’ code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--lld-ink` | Primary text | `#1a2430` |
| `--lld-muted` | Secondary text | `#5a6570` |
| `--lld-paper` | Page ground | `#eef1f4` |
| `--lld-mist` | Soft panel | `#dce3ea` |
| `--lld-teal` | Brand / CTA (steel blue) | `#2a4a66` |
| `--lld-teal-deep` | Hover / emphasis | `#1a3248` |
| `--lld-cyan` | Accent (copper) | `#9a6b2f` |
| `--lld-ok` | Success | `#2f6b4f` |
| `--lld-warn` | Caution | `#8a6a2f` |
| `--lld-line` | Hair rules (sparingly) | `#c5ced6` |

Atmosphere: cool steel paper → slate/copper radial wash + faint ladder-grid. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Literata** (Google Fonts) | Soft literary serif; hero + wordmark |
| Body / UI | **Source Sans 3** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **Source Code Pro** | Goldens, deltas, job ids |

### Layout rules

- One job per section; cards only for interactive compare / forms
- No hero overlays or pill clusters
- Desk chrome: strong product wordmark + nav after landing CTA

### Motion (2–3)

1. Ladder-trace draw-in on landing (`lld-trace`)
2. Scenario result reveal (`std-reveal`)
3. Active nav underline settle

### shadcn theme

Radius 0.5rem; primary maps to `--lld-teal`; components: button, card, input, label, table, tabs, badge, select, textarea, separator.

### Page map

| Page | Purpose | Primary CTA | Empty / error |
|------|---------|-------------|----------------|
| `/` | Marketing landing | Open desk | — |
| `/jobs` | Verification jobs | Create job | Empty list copy |
| `/lifecycle` | Status transitions | Advance | Illegal transition message |
| `/scenario` | Naive vs formal compare | Run compare | Cheat reject |
| `/batch` | Sibling transitions | Run batch | Per-item reject |
| `/audit` | Trail + CSV | Export | Empty audit |
| `/goldens` | Dual-impl cards | Refresh | Fail badge |
| `/honesty` | Fence + sources | Back to desk | — |
| `/settings` | Webhook rotate | Rotate | Admin-only |

### Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default.
