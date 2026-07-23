# Product engineering stack (default)

Every new Method Lab product under `projects/<slug>/` uses this stack unless CONTROLLER explicitly overrides.

## Required

| Layer | Choice |
|-------|--------|
| Framework | **Next.js** (App Router) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** |
| UI kit | **shadcn/ui** (Radix base; `npx shadcn@latest init -d --base radix`) |
| Components | Prefer shadcn primitives; compose — do not invent parallel button/input systems |
| Persistence | SQLite (or CONTROLLER `product_defaults.persistence`) |
| Auth | Bearer / session per product needs (CONTROLLER `auth`) |
| Domain tests | Vitest or Node test runner for pure domain math |
| UI tests | Playwright or component critical-path smokes per unlocked page |

## Scaffold (delivery)

Non-interactive preferred:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
npx shadcn@latest init -d --base radix
```

Then add only the shadcn components the designer’s page map needs (`npx shadcn@latest add …`).

## Honesty

Stack choice does not waive domain depth, dual-impl goldens, or the ≥15-feature / ≥6-page sustain bar. Pretty UI on a shallow dual-gate clone still fails.

## Offline try page

`try.html` remains a **single-file offline demo** of core domain math (no Next server). The full app is Next + shadcn; the digest attachment stays double-clickable HTML.

## Skills / docs agents should load

- Vercel Next.js + React best practices skills when implementing UI
- shadcn skill for init/add/composition
- `protocols/DESIGN.md` for visual direction before shipping pages
