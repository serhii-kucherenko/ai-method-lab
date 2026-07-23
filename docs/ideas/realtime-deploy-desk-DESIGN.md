# Realtime Deploy Desk — Design system

**Display name:** Realtime Deploy Desk  
**Slug:** `realtime-deploy-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.18171v1  
**Authors' code:** none published with this paper  

Never brand the product as FlashRT. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Realtime Deploy Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Compare harness-guided deployment optimization against a naive manual-tuning baseline — method experiment, not a production serving stack
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Soft pipeline-grid atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Stop hand-tuning every realtime pipeline |
| **Supporting** | See how a harness-guided deploy score beats a naive manual-tuning baseline on latency and config fit — in a method-lab desk, not a production serving stack. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare harness-guided placement against manual knob-tuning in one scenario
2. Keep deploy jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project catalog; deploy job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (manual vs harness); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page

### How it works

1. Open the desk and create a deploy job under a project  
2. Run scenario compare — manual-tuning baseline vs harness-guided score  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors’ harness. Not a production serving stack. Never brand as FlashRT.

### Sources

- Paper: https://arxiv.org/abs/2607.18171v1  
- Authors’ code: none published with this paper  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--rdd-ink` | Primary text | `#0f1c24` |
| `--rdd-muted` | Secondary text | `#4a5d6a` |
| `--rdd-paper` | Page ground | `#eef2f4` |
| `--rdd-mist` | Soft panel | `#e0e8ec` |
| `--rdd-teal` | Brand / CTA (signal) | `#0d7377` |
| `--rdd-teal-deep` | Hover / emphasis | `#095456` |
| `--rdd-cyan` | Accent line (pipeline) | `#14919b` |
| `--rdd-ok` | Success | `#2f6b4f` |
| `--rdd-warn` | Caution | `#8a6a2f` |
| `--rdd-line` | Hair rules (sparingly) | `#c5d0d6` |

Atmosphere: cool paper → teal/cyan radial wash + faint pipeline-grid. Not flat single fill. Not dark-mode-by-default.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Space Grotesk** (Google Fonts) | Geometric presence; hero + wordmark |
| Body / UI | **Source Sans 3** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **JetBrains Mono** | Goldens, deltas, job ids |

### Layout rules

- Landing: promotional full-bleed hero; sections below fold one job each
- Desk chrome starts at `/jobs` — top nav with brand; primary work surface clear
- Cards only when they wrap an interaction
- No hero overlays, promo stickers, or stat-strip clutter on the first viewport
- Mobile: stacked nav, same brand weight; forms full-width

## Motion (2–3 intentional)

1. **Pipeline draw-in** — landing hero: SVG stage polyline animates stroke-dashoffset once (~800ms, ease-out)
2. **Score reveal** — scenario compare: delta panel fades/slides up (150–200ms)
3. **Nav presence** — desk active route underline expands from center (150ms)

No continuous glow loops, no confetti, no parallax noise.

## shadcn theme

- Init: `npx shadcn@latest init -d --base radix`
- Radius: `0.5rem` (desk, not pill-heavy)
- Map CSS variables: `--primary` → teal, `--background` → paper, `--foreground` → ink, `--destructive` → warm warn for rejects, `--muted` → mist
- Components: `button`, `input`, `label`, `card`, `table`, `badge`, `separator`, `tabs`, `textarea`, `select`

## Page map (≥9)

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Marketing landing (hero → sources → footer CTA) | Open desk (`/jobs`) | — |
| `/jobs` | Deploy job catalog CRUD (desk entry) | Create job | “No jobs yet — create one” |
| `/lifecycle` | Enforce draft→queued→running→terminal | Advance status | Illegal transition message |
| `/scenario` | Manual-tuning baseline vs harness-guided | Run compare | Cheat reject reason |
| `/batch` | Independent sibling transitions | Run batch | Per-item error rows |
| `/audit` | Timeline + CSV export | Export CSV | “No audit entries” |
| `/goldens` | ≥25 dual-impl fixture browser | Refresh | Fixture fail badge |
| `/honesty` | Method fences | Read sources | — |
| `/settings` | Org webhook rotate (admin) | Rotate secret | Forbidden for viewer |

## Anti-looks (explicit refuse)

- Purple-on-white / purple-to-indigo gradient themes
- Warm cream + terracotta serif cliché
- Broadsheet hairline newspaper columns
- Dark-mode-by-default
- Branding the desk as FlashRT (paper short name) anywhere in chrome or titles

## Honesty in UI

Every surface that shows latency/config scores must remain a **method experiment**. Footer + honesty page: not a production serving stack; not a replacement for the authors’ harness; authors’ code none published with this paper.
