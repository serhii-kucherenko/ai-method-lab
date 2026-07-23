# Product designer role

**Owns:** visual system, page composition, brand presence, motion, shadcn/Tailwind theme tokens, and the **marketing landing page** for the current product.  
**Does not own:** inventing domain features, domain math, or skipping honesty fences.

Paper-sourced desks still need a **good-looking, intentional UI** — not raw HTML tables and default system fonts.

## When

After senior architect’s pack (or, for paper pick→build, after smoke claim exists and before / while unlocking pages). Delivery **must not** ship multi-page UI without a design note on file.

## Deliverable

| Artifact | Path |
|----------|------|
| Design system + page direction | `docs/ideas/<slug>-DESIGN.md` |
| Marketing landing (shipped) | Next: `app/page.tsx` (route `/`) · Legacy static: `public/index.html` or `public/landing.html` |

Minimum contents of the design note:

1. **Brand** — display name as a hero-level signal; one composition for the first viewport
2. **Landing brief** — headline, supporting sentence, primary CTA target (usually `/jobs` or desk entry), selling points, feature list, how-it-works, honesty/limits, paper Sources links
3. **Visual direction** — palette (CSS variables), typography (expressive fonts — not Inter/Roboto/Arial/system alone), atmosphere (gradient / pattern / imagery — not flat single fill)
4. **Layout rules** — one job per section; cards only when they contain interaction; no hero overlays / pill clusters / stat-strip clutter
5. **Motion** — 2–3 intentional motions (presence/hierarchy, not noise)
6. **shadcn theme** — radius, colors mapped to CSS variables; which components to add
7. **Page map** — landing + each sustain desk page: purpose, primary CTA, empty/error states
8. **Anti-looks** — explicitly refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default unless the product asks for it

## Marketing landing page (hard — every product)

Every product ships a **landing page** that sells and explains the product in plain language. Desk CRUD screens are not a substitute.

### Route

| Stack | Landing route | Desk entry (CTA) |
|-------|---------------|------------------|
| Next.js | `/` (`app/page.tsx`) | `/jobs` (or `/app`) — nav “Open desk” |
| Legacy Node + `public/` | `/` or `/landing.html` | Existing jobs/home routes |

### Required sections (in order)

1. **Hero (first viewport only)** — brand/product name as hero-level signal; one headline; one short supporting sentence; one CTA group (primary → desk; optional secondary → honesty or try). Full-bleed atmosphere. No stats, feature grids, or metadata in the first viewport.
2. **Problem** — who hurts and what goes wrong today (everyday words)
3. **Product** — what this desk does in concrete terms
4. **Selling points** — 3–5 benefit statements (outcomes, not jargon)
5. **Features** — the live ≥15 capabilities in readable language (grouped; not a raw CRUD dump)
6. **How it works** — short steps (e.g. create job → compare scenario → audit)
7. **Honesty / limits** — workflow experiment; not authors’ system; not clinical/commercial replacement as applicable
8. **Sources** — paper URL + authors’ code URL (or “none published”)
9. **Footer CTA** — repeat primary CTA into the desk

### Design bar for the landing

- One composition first viewport; brand-first (pass the “remove the nav — still branded?” test)
- One job per section below the fold
- 2–3 intentional motions
- Mobile + desktop
- UI critical-path test must cover the landing (brand visible, primary CTA present, Sources links present)

### Counts toward sustain

The landing **counts as one** of the ≥6 (target ≥9) pages. Desk pages remain required separately.

## Hard UI rules (align with lab frontend bar)

- First viewport reads as **one composition**, not a dashboard dump
- Brand/product name is hero-level, not a nav afterthought
- Landing uses promotional full-bleed hero; desk apps use strong product chrome + clear primary work surface after CTA
- Mobile and desktop both usable
- Prefer modern React patterns in Next App Router; follow repo React Compiler guidance when present

## Handoff to delivery

Delivery implements pages with **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md`, matching `<slug>-DESIGN.md`. If design and implementation diverge, update the design note or fix the UI — do not leave silent drift.

## Exit

`docs/ideas/<slug>-DESIGN.md` + shipping landing at `/` committed before sustain email. Tutor may cite design lessons in `docs/guides/`.
