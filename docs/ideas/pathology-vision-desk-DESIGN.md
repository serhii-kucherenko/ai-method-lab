# Pathology Vision Desk — Design system

**Display name:** Pathology Vision Desk  
**Slug:** `pathology-vision-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.09526v1  
**Authors' code:** https://github.com/WonderLandxD/ALICE  

Never brand the product as ALICE. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Pathology Vision Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Compare multi-expert pathology scoring against a naive single-view baseline — method experiment, not a clinical diagnostic tool
- **First viewport:** one composition — brand, one headline, one supporting sentence, one primary CTA (Open scenario), soft tissue-slide atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--pvd-ink` | Primary text | `#1a2430` |
| `--pvd-muted` | Secondary text | `#5a6674` |
| `--pvd-paper` | Page ground | `#f5f3f0` |
| `--pvd-mist` | Soft panel | `#ebe6df` |
| `--pvd-rose` | Brand / CTA (tissue stain) | `#9b4d5a` |
| `--pvd-rose-deep` | Hover / emphasis | `#7a3a46` |
| `--pvd-slate` | Accent line (slide grid) | `#3d5a6c` |
| `--pvd-ok` | Success | `#3d6b55` |
| `--pvd-warn` | Caution | `#8a6a2f` |
| `--pvd-line` | Hair rules (sparingly) | `#d4cdc4` |

Atmosphere: soft warm paper → cool slate radial wash + faint microscope-field grid. Not flat single fill. Not dark-mode-by-default.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Literata** (Google Fonts) | Soft optical size; hero + wordmark |
| Body / UI | **DM Sans** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **JetBrains Mono** | Goldens, deltas, job ids |

### Layout rules

- One job per section; one headline + one short supporting sentence
- Cards only when they wrap an interaction (job form, scenario inputs, settings rotate)
- No hero overlays, promo stickers, or stat-strip clutter on the home composition
- Desk chrome: top nav with brand always visible; primary work surface clear
- Mobile: stacked nav, same brand weight; forms full-width

## Motion (2–3 intentional)

1. **Field draw-in** — home hero: a short SVG slide-field polyline animates stroke-dashoffset once on load (~800ms, ease-out)
2. **Score reveal** — scenario compare: delta panel fades/slides up when result arrives (150–200ms)
3. **Nav presence** — active route underline expands from center (150ms)

No continuous glow loops, no confetti, no parallax noise.

## shadcn theme

- Init: `npx shadcn@latest init -d --base radix`
- Radius: `0.5rem` (desk, not pill-heavy)
- Map CSS variables: `--primary` → rose, `--background` → paper, `--foreground` → ink, `--destructive` → warm warn for rejects, `--muted` → mist
- Components to add: `button`, `input`, `label`, `card`, `table`, `badge`, `separator`, `tabs`, `textarea`, `select`

## Page map (≥9)

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Brand + claim + enter desk | Open scenario | — |
| `/jobs` | Vision job catalog CRUD | Create job | “No jobs yet — create one” |
| `/lifecycle` | Enforce draft→queued→running→terminal | Advance status | Illegal transition message |
| `/scenario` | Single-view baseline vs multi-expert | Run compare | Cheat reject reason |
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
- Branding the desk as ALICE (paper short name) anywhere in chrome or titles

## Honesty in UI

Every surface that shows scores must remain a **method experiment**. Footer + honesty page: not clinical diagnostic; not a replacement for the authors’ foundation model.
