# Phase 1 Research: Smoke & trust

**Phase:** 01-smoke-trust  
**Researched:** 2026-08-07  
**Mode:** Brief digest (deep research skipped — project `.planning/research/` already marks Phase 1 as standard)  
**Confidence:** HIGH

## Decision IDs (from CONTEXT)

| ID | Locked choice |
|----|---------------|
| D-01 | Product at `projects/commitment-coverage-studio/` |
| D-02 | Brand: Commitment Coverage Studio — “See the gap before you renew.” |
| D-03 | Landing hero: brand + headline “See commitment waste in dollars before renewal” + one supporting sentence + CTAs to `/commitments` and `/demo`; full-bleed cool ledger; no stats/overlays/cards in viewport one |
| D-04 | `/honesty` soft-sim fence: not billing SOR; not Idle Seat / True Up; Sources footer |
| D-05 | Tokens: ink/paper/teal covered/rust gap; Fraunces / Source Sans 3 / IBM Plex Mono; radius sm |
| D-06 | Stack: Next.js App Router + Tailwind + shadcn + TypeScript (SQLite persistence starts Phase 2 with inventory — not required for `/` + `/honesty`) |
| D-07 | Anti-looks: no purple AI glow, cream+terracotta, broadsheet, dark-mode-by-default |

## Standard stack (phase-relevant)

From `.planning/research/STACK.md` + SUMMARY:

- Scaffold with `create-next-app@latest` (Next 16.3.x / React 19.2.x / Tailwind 4 / App Router / `src/`)
- `npx shadcn@latest init -d --base radix` then add `button` (marketing CTAs)
- Fonts via `next/font/google`: Fraunces, Source_Sans_3, IBM_Plex_Mono
- Map DESIGN CSS variables in `globals.css` `@theme` / `:root`; shadcn `--primary` → teal, `--destructive` → rust gap, `--background` → paper
- **No** Python, **no** better-sqlite3 in this phase, **no** desk IA routes as primary nav

## Package legitimacy (phase installs)

| Package | Role | Status | Notes |
|---------|------|--------|-------|
| `next` / `react` / `react-dom` | App | [VERIFIED] | Lab PRODUCT_STACK; create-next-app pin |
| `tailwindcss` / `@tailwindcss/postcss` | Styles | [VERIFIED] | Tailwind 4 pipeline |
| `shadcn` / `radix-ui` / `class-variance-authority` / `clsx` / `tailwind-merge` / `tw-animate-css` | UI kit | [VERIFIED] | Lab default; STACK.md registry snapshot |
| `lucide-react` | Icons (sparse) | [VERIFIED] | Optional; avoid marketing icon clutter |
| `better-sqlite3` | Persistence | out of scope this phase | Phase 2+ |

No `[ASSUMED]` / `[SUS]` / `[SLOP]` installs in Phase 1.

## Architecture patterns for this phase

```text
projects/commitment-coverage-studio/
  DESIGN.md                 # product token source of truth (copy from idea DESIGN)
  src/app/layout.tsx        # fonts + metadata display name
  src/app/globals.css       # ink/paper/teal/gap tokens + ledger atmosphere
  src/app/page.tsx          # brand-first landing
  src/app/honesty/page.tsx  # soft-sim fence + Sources
  src/components/...        # landing sections; shadcn ui/
  src/lib/claim.ts          # DISPLAY_NAME, TAGLINE, honesty copy constants
  test/smoke-mkt.test.ts    # route + token + fence assertions
```

Presentation only. No domain scorers, imports, or SQLite.

## Sibling pattern notes (anti-clone)

- Mirror **scaffold shape** from FinOps siblings (`spend-cap-studio`, `true-up-studio`, `idle-seat-studio`): App Router, `src/`, claim constants, `/honesty`.
- **Do not** copy Spend Cap’s dark neon mesh / slate-100 default — DESIGN forbids dark-mode-by-default (D-07). Use cool daylight paper + ledger grain.
- **Do not** noun-swap Idle Seat / True Up copy or desk shells (`/jobs` `/lifecycle` `/scenario` `/batch`).
- Landing CTAs may link to `/commitments` and `/demo` even if those routes are thin placeholders — do not build isomorphic desk chrome; placeholders must not fake jobs/lifecycle shells (CONTEXT out of scope).

## Common pitfalls

1. Hero with invented metrics, overlays, or card collage (violates D-03).
2. Honesty page that omits Idle Seat / True Up disambiguation or Sources (violates D-04).
3. Token drift: Inter/Roboto, purple glow, cream+terracotta (violates D-05 / D-07).
4. UTF-8 BOM on `package.json` (lab hard rule — Node writes only).
5. Shipping primary nav to desk routes.

## Out of scope (confirm)

Dual scorers, CRUD, commercial `/pricing` `/demo` `/onboarding` `/flows` content, sustain screenshots — later phases.

## Validation Architecture

See `01-VALIDATION.md`. Phase sampling uses `test/smoke-mkt.test.ts` (tsx --test) plus `npm run build` at plan boundaries. Maps MKT-01/02/03 to automated asserts; Wave 0 smoke file lands in plan 01-01 tracer task.

## Sources

- `.planning/phases/01-smoke-trust/01-CONTEXT.md`
- `.planning/research/{SUMMARY,STACK,FEATURES,ARCHITECTURE,PITFALLS}.md`
- `docs/ideas/commitment-coverage-studio-DESIGN.md`
- Sibling `projects/spend-cap-studio` (scaffold only; visual language rejected for this product)

---
*Brief phase research for Smoke & trust — deep research not required*
