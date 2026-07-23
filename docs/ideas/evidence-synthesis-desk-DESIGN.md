# Evidence Synthesis Desk — Design system

**Display name:** Evidence Synthesis Desk  
**Slug:** `evidence-synthesis-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.15247v1  
**Authors' code:** none published  

Never brand the product as AutoSynthesis or PRISMA. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Evidence Synthesis Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Screen eligibility, standardize effects, then pool with random-effects — method experiment, not a commercial evidence-synthesis vendor
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Library-ledger atmosphere with soft forest mist. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Screen first; then pool with care |
| **Supporting** | Score screened eligibility, standardized effect sizes, and random-effects pooling against naive averages that skip screening discipline. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare screened random-effects pooling against naive averages that skip eligibility
2. Keep synthesis jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so effect-size scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / topic catalog; synthesis job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (naive / fixed-effect-all / unweighted vs screened RE); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page

### How it works

1. Open the desk and create a synthesis job under a review topic  
2. Run scenario compare — naive averages include ineligible rows; screened path uses Hedges' g + random-effects  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors' system. Not a commercial evidence-synthesis vendor. Never brand as AutoSynthesis. PRISMA only in Sources/honesty.

### Sources

- Paper: https://arxiv.org/abs/2607.15247v1  
- Authors' code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--esd-ink` | Primary text | `#1a2f2a` |
| `--esd-muted` | Secondary text | `#4d635c` |
| `--esd-paper` | Page ground | `#eef4f1` |
| `--esd-mist` | Soft panel | `#d5e6df` |
| `--esd-steel` | Brand / CTA | `#1f5c4a` |
| `--esd-steel-deep` | Hover / emphasis | `#154036` |
| `--esd-cyan` | Accent (ledger glass) | `#3d7a6a` |
| `--esd-ok` | Success | `#2f6b4f` |
| `--esd-warn` | Caution | `#8a5a2f` |
| `--esd-line` | Hair rules (sparingly) | `#c5d4ce` |

Atmosphere: cool forest paper → soft radial mist + ledger grid hint. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Fraunces** (optical size) or Space Grotesk fallback | Hero + wordmark |
| Body / UI | **Source Sans 3** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **IBM Plex Mono** | Goldens, deltas, job ids |

### Layout rules

- One job per section; cards only when they contain interaction
- No hero overlays / pill clusters / stat-strip clutter
- Marketing `/` sells; desk chrome starts at `/jobs`

### Motion (2–3)

1. Soft mist drift on landing ground (CSS opacity/translate, subtle)
2. Primary CTA hover deepen (steel → steel-deep)
3. Desk nav active underline ease-in

### shadcn theme

Radius ~0.4rem; map primary to `--esd-steel`; use Button, Input, Label, Card (interaction only), Badge, Table, Tabs, Separator, Textarea, Select as needed.

## Page map

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Marketing landing | Open desk | — |
| `/jobs` | Synthesis job list/create | Create job | Empty list copy |
| `/lifecycle` | Transition a job | Apply transition | Illegal → reject message |
| `/scenario` | Compare naive vs screened | Run compare | Cheat reject |
| `/batch` | Sibling transitions | Run batch | Per-id reject |
| `/audit` | Trail + CSV | Export CSV | Empty audit |
| `/goldens` | Dual-impl browser | Refresh | Fail card if mismatch |
| `/honesty` | Fence + Sources | Tutor guide link | — |
| `/settings` | Webhook rotate | Rotate | Viewer secret null |

## Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default, dual-approver board chrome, prompt-cache tier dashboards.
