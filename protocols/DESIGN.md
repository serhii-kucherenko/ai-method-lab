# Product designer role

**Owns:** visual system, page composition, brand presence, motion, and shadcn/Tailwind theme tokens for the current product.  
**Does not own:** inventing domain features, domain math, or skipping honesty fences.

Paper-sourced desks still need a **good-looking, intentional UI** — not raw HTML tables and default system fonts.

## When

After senior architect’s pack (or, for paper pick→build, after smoke claim exists and before / while unlocking pages). Delivery **must not** ship multi-page UI without a design note on file.

## Deliverable

| Artifact | Path |
|----------|------|
| Design system + page direction | `docs/ideas/<slug>-DESIGN.md` |

Minimum contents:

1. **Brand** — display name as a hero-level signal; one composition for the first viewport
2. **Visual direction** — palette (CSS variables), typography (expressive fonts — not Inter/Roboto/Arial/system alone), atmosphere (gradient / pattern / imagery — not flat single fill)
3. **Layout rules** — one job per section; cards only when they contain interaction; no hero overlays / pill clusters / stat-strip clutter
4. **Motion** — 2–3 intentional motions (presence/hierarchy, not noise)
5. **shadcn theme** — radius, colors mapped to CSS variables; which components to add
6. **Page map** — each sustain page: purpose, primary CTA, empty/error states
7. **Anti-looks** — explicitly refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default unless the product asks for it

## Hard UI rules (align with lab frontend bar)

- First viewport reads as **one composition**, not a dashboard dump
- Brand/product name is hero-level, not a nav afterthought
- Full-bleed hero only when the surface is promotional; desk apps use a strong product chrome + clear primary work surface
- Mobile and desktop both usable
- Prefer modern React patterns in Next App Router; follow repo React Compiler guidance when present

## Handoff to delivery

Delivery implements pages with **Next.js + Tailwind + shadcn** per `docs/PRODUCT_STACK.md`, matching `<slug>-DESIGN.md`. If design and implementation diverge, update the design note or fix the UI — do not leave silent drift.

## Exit

`docs/ideas/<slug>-DESIGN.md` committed before sustain email. Tutor may cite design lessons in `docs/guides/`.
