# Heart Rhythm Desk — Design system

**Display name:** Heart Rhythm Desk  
**Slug:** `heart-rhythm-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.14613v1  
**Authors' code:** https://github.com/Open-EXG/AG-SCL-for-Long-Tailed-ECG  

Never brand the product as AG-SCL. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Heart Rhythm Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Compare long-tail-aware rhythm scoring against a naive majority baseline — method experiment, not a clinical ECG reader
- **First viewport:** one composition — brand, one headline, one supporting sentence, one primary CTA (Open desk → `/jobs`), soft ECG-grid atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Piece | Copy |
|-------|------|
| **Headline** | Rare rhythms should not vanish into the majority score. |
| **Supporting** | A lab desk to compare long-tail-aware rhythm scoring against a naive majority baseline — method experiment, not a clinical ECG reader. |
| **Primary CTA** | Open desk → `/jobs` (harness: `/jobs.html`) |
| **Secondary CTA** | Read honesty → `/honesty` |
| **Selling points** | Rare-tag score movement vs flat majority; exportable audit; independent batch siblings; dual-impl goldens |
| **Features** | Org/jobs, lifecycle + conflicts, scenario compare, audit/CSV, goldens, honesty, webhooks, rate limits, try.html — grouped on the landing |
| **How it works** | 1) Open desk / create job → 2) Compare majority vs long-tail-aware → 3) Audit lifecycle & export |
| **Honesty / limits** | Workflow experiment; not clinical ECG reader; not authors’ model; never brand as AG-SCL |
| **Sources** | Paper https://arxiv.org/abs/2607.14613v1 · Code https://github.com/Open-EXG/AG-SCL-for-Long-Tailed-ECG |
| **Footer CTA** | Repeat Open desk → `/jobs` |

Landing route `/` (`app/page.tsx` + `public/index.html`). Desk chrome starts at `/jobs`. Landing header is minimal (Open desk + Honesty only) so the first viewport stays brand-first.

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--hrd-ink` | Primary text | `#0f2a32` |
| `--hrd-muted` | Secondary text | `#4a6670` |
| `--hrd-paper` | Page ground | `#f3f7f8` |
| `--hrd-mist` | Soft panel | `#e4eef1` |
| `--hrd-teal` | Brand / CTA | `#0d7377` |
| `--hrd-teal-deep` | Hover / emphasis | `#095456` |
| `--hrd-signal` | Accent line (ECG trace) | `#c45c26` |
| `--hrd-ok` | Success | `#2f6b4f` |
| `--hrd-warn` | Caution | `#9a6b1f` |
| `--hrd-line` | Hair rules (sparingly) | `#c5d4d8` |

Atmosphere: soft cool teal→paper radial wash + faint ECG grid (subtle repeating linear pattern). Not flat single fill. Not dark-mode-by-default.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Fraunces** (Google Fonts) | Soft optical size; hero + wordmark |
| Body / UI | **Source Sans 3** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **IBM Plex Mono** | Goldens, deltas, job ids |

### Layout rules

- One job per section; one headline + one short supporting sentence
- Cards only when they wrap an interaction (job form, scenario inputs, settings rotate)
- No hero overlays, promo stickers, or stat-strip clutter on the home composition
- Desk chrome: left/top nav with brand always visible; primary work surface clear
- Mobile: stacked nav, same brand weight; forms full-width

## Motion (2–3 intentional)

1. **Trace draw-in** — home hero: a short SVG ECG polyline animates stroke-dashoffset once on load (~800ms, ease-out)
2. **Score reveal** — scenario compare: delta panel fades/slides up when result arrives (150–200ms)
3. **Nav presence** — active route underline expands from center (150ms)

No continuous glow loops, no confetti, no parallax noise.

## shadcn theme

- Init: `npx shadcn@latest init -d --base radix`
- Radius: `0.5rem` (desk, not pill-heavy)
- Map CSS variables: `--primary` → teal, `--background` → paper, `--foreground` → ink, `--destructive` → warm signal for rejects, `--muted` → mist
- Components to add: `button`, `input`, `label`, `card`, `table`, `badge`, `separator`, `tabs`, `textarea`, `select`

## Page map (≥9)

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Marketing landing (hero → Sources) | Open desk → `/jobs` | — |
| `/jobs` | Rhythm job catalog CRUD (desk entry) | Create job | “No jobs yet — create one” |
| `/lifecycle` | Enforce draft→queued→running→terminal | Advance status | Illegal transition message |
| `/scenario` | Majority baseline vs long-tail-aware | Run compare | Cheat reject reason |
| `/batch` | Independent sibling transitions | Run batch | Per-item error rows |
| `/audit` | Timeline + CSV export | Export CSV | “No audit entries” |
| `/goldens` | ≥25 dual-impl fixture browser | Refresh | Fixture fail badge |
| `/honesty` | Method fences | Read sources | — |
| `/settings` | Org webhook rotate (admin) | Rotate secret | Forbidden for viewer |

Each live page ships `data-<page>="live"` for UI critical paths.

## Anti-looks (explicit refuse)

- Purple-on-white / purple-to-indigo AI default gradients
- Warm cream (#F4F1EA) + terracotta + serif display cliché
- Broadsheet hairline newspaper columns
- Dark mode as the default product look
- Branding as AG-SCL or other paper short names in `<h1>` / `<title>`
- Raw gray unstyled HTML as the “product” (offline `try.html` is the digest exception)

## Honesty surfaces

Every page footer (and honesty page body) states: workflow experiment inspired by the paper; **not** a clinical ECG reader; **not** the authors’ model. Link paper URL + authors’ code URL.

## Handoff

Delivery implements this note with Next.js + Tailwind + shadcn. Domain math stays pure TypeScript under `src/domain/` for dual-impl goldens. If UI drifts, update this file or fix the UI — no silent drift.
