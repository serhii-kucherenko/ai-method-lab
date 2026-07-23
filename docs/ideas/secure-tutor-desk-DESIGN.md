# Secure Tutor Desk — Design system

**Display name:** Secure Tutor Desk  
**Slug:** `secure-tutor-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.14601v1  
**Authors' code:** none published  

Never brand the product as SYNAPSE. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Secure Tutor Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Compare multi-LLM orchestrated tutoring against a naive single-model baseline — method experiment, not a live tutoring course product
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Soft lesson-grid atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | One model should not teach every security lesson alone |
| **Supporting** | See how a multi-LLM orchestrated tutor score beats a naive single-model baseline on pedagogical roles and learner intent — in a method-lab desk, not a live course product. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare multi-LLM orchestration against single-model tutoring in one scenario
2. Keep tutor jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project catalog; tutor job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (single-model vs multi-LLM); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page

### How it works

1. Open the desk and create a tutor job under a project  
2. Run scenario compare — single-model baseline vs multi-LLM orchestrated score  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors’ tutoring platform. Not a live tutoring course product. Never brand as SYNAPSE.

### Sources

- Paper: https://arxiv.org/abs/2607.14601v1  
- Authors’ code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--std-ink` | Primary text | `#1a2332` |
| `--std-muted` | Secondary text | `#5c6678` |
| `--std-paper` | Page ground | `#f0f3f1` |
| `--std-mist` | Soft panel | `#e2e8e4` |
| `--std-teal` | Brand / CTA (forest) | `#2d5a45` |
| `--std-teal-deep` | Hover / emphasis | `#1e3f30` |
| `--std-cyan` | Accent (amber caution) | `#b8752a` |
| `--std-ok` | Success | `#2f6b4f` |
| `--std-warn` | Caution | `#8a6a2f` |
| `--std-line` | Hair rules (sparingly) | `#c9d2cc` |

Atmosphere: cool sage paper → forest/amber radial wash + faint lesson-grid. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Fraunces** (Google Fonts) | Soft contrast serif presence; hero + wordmark |
| Body / UI | **IBM Plex Sans** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **IBM Plex Mono** | Goldens, deltas, job ids |

### Layout rules

- Landing: promotional full-bleed hero; sections below fold one job each
- Desk chrome starts at `/jobs` — top nav with brand; primary work surface clear
- Cards only when they wrap an interaction
- No hero overlays, promo stickers, or stat-strip clutter on the first viewport
- Mobile: stacked nav, same brand weight; forms full-width

## Motion (2–3 intentional)

1. **Lesson path draw-in** — landing hero: SVG role polyline animates stroke-dashoffset once (~800ms, ease-out)
2. **Score reveal** — scenario compare: delta panel fades/slides up (150–200ms)
3. **Nav presence** — desk active route underline expands from center (150ms)

No continuous glow loops, no confetti, no parallax noise.

## shadcn theme

- Init: `npx shadcn@latest init -d --base radix`
- Radius: `0.5rem` (desk, not pill-heavy)
- Map CSS variables: `--primary` → forest, `--background` → paper, `--foreground` → ink, `--destructive` → warn for rejects, `--muted` → mist
- Components: `button`, `input`, `label`, `card`, `table`, `badge`, `separator`, `tabs`, `textarea`, `select`

## Page map

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Marketing landing | Open desk → `/jobs` | n/a |
| `/jobs` | Tutor job CRUD | Create job | Empty list copy |
| `/lifecycle` | Status transitions | Advance | Illegal transition message |
| `/scenario` | Single vs multi-LLM compare | Run compare | Missing job |
| `/batch` | Sibling transitions | Batch apply | Partial failures listed |
| `/audit` | Trail + CSV | Export CSV | Empty audit |
| `/goldens` | Dual-impl fixtures | Refresh | Fail badge if mismatch |
| `/honesty` | Limits + Sources | Back to desk | n/a |
| `/settings` | Webhook rotate | Rotate secret | Forbidden for viewer |

## Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default.
