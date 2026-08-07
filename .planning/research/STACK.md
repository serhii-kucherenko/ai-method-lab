# Stack Research

**Domain:** FinOps commitment-coverage soft-sim studio (Commitment Coverage Studio)
**Project:** `projects/commitment-coverage-studio/`
**Researched:** 2026-08-07
**Confidence:** HIGH (lab protocol lock) · MEDIUM (exact patch pins from registry)

## Verdict

Use the **AI Method Lab default product stack with no primary-stack exception.** Commitment Coverage is pure billing/coverage math (dual A/B goldens) — TypeScript domain in-process, **no Python sidecar**. Mirror FinOps siblings (`spend-cap-studio`, `true-up-studio`, `idle-seat-studio`) for scaffold shape; honor `CONTROLLER.product_defaults.persistence: sqlite` for durable inventory/imports (do not soft-violate with in-memory-only like shallow demo stores).

Aligns with `docs/PRODUCT_STACK.md` + `matrix/CONTROLLER.json` `product_defaults`.

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Next.js** (App Router) | **16.3.0** (`create-next-app@latest`) | Product UI + Route Handlers | Lab-required framework (`product_defaults.stack: nextjs-app-router`). App Router is create-next-app default; Turbopack for local `next dev`. |
| **React** / **react-dom** | **19.2.8** | UI runtime | Ships with Next 16; peer of current Next. |
| **TypeScript** | **^5** (registry latest 7.x available; pin **5.x** with Next 16 template) | App + domain language | Lab-required; dual scorers stay readable in TS (`PRODUCT_STACK`: prefer TS for pure rule/math desks). |
| **Tailwind CSS** | **^4** (4.3.3 current) | Styling | Lab-required; use `@tailwindcss/postcss` (v4 pipeline, not v3 `tailwind.config.js` invent). |
| **shadcn/ui** | CLI **shadcn@^4** (4.16.2 current) · base **radix** | Component primitives | Lab-required; `npx shadcn@latest init -d --base radix`. Prefer compose-over-invent. |
| **radix-ui** | **^1.6** (1.6.7 current) | Accessible primitives under shadcn | Matches recent lab studios’ unified `radix-ui` package (not per-primitive `@radix-ui/react-*` sprawl unless shadcn adds them). |
| **SQLite** via **better-sqlite3** | **13.0.3** (+ `@types/better-sqlite3` **^9.6**) | Persistence | CONTROLLER `persistence: sqlite`. Sync API fits Route Handlers/server modules; file at `data/coverage.db` (gitignored). No cloud DB for soft-sim. |
| **Bearer auth** | App-local token middleware | API + settings | CONTROLLER `auth: bearer-token`. Header `Authorization: Bearer …`; no Clerk/NextAuth for this desk. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **zod** | **4.4.3** | Validate imports, API bodies, webhook payloads | CSV/JSON usage import batches; commitment CRUD; HMAC payload shape |
| **lucide-react** | **^1.29** | Icons | Sparse ops UI only — not marketing clutter |
| **class-variance-authority** | **0.7.1** | shadcn `button` variants | With shadcn scaffold |
| **clsx** + **tailwind-merge** | **2.1.1** / **3.6.0** | `cn()` helper | shadcn default |
| **tw-animate-css** | **^1.4** | Motion primitives | Coverage bar fill + compare toggle (DESIGN motion budget) |
| **next/font/google** | (bundled) | Fraunces · Source Sans 3 · IBM Plex Mono | DESIGN.md tokens — no self-host invent unless offline constraint |
| **tsx** | **^4.23** | Run goldens scripts / Node tests | `scripts/gen-goldens.mjs`, optional `tsx --test` |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **ESLint** + **eslint-config-next** | Lint | Pin `eslint-config-next` to same major/minor as `next` (16.3.x) |
| **Vitest** | Domain dual-impl goldens (≥30) | CONTROLLER `test_runner: vitest-…`. Pure functions in `src/domain/` — no React. |
| **Playwright** (`@playwright/test` **1.62.1**) | Critical path UI smokes | Import → coverage → gaps → renewal pack; `/pricing` `/demo` `/onboarding` |
| **app-up smoke** | `test/app-up.test.ts` | Lab depth policy: `next build` + `next start` + `GET /` |
| **node scripts/capture-product-screenshots.mjs** | README live PNGs | Required before sustain |

## Installation

```bash
cd projects/commitment-coverage-studio

npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
npx shadcn@latest init -d --base radix
npx shadcn@latest add button input table tabs dialog badge checkbox select

npm install better-sqlite3 zod lucide-react class-variance-authority clsx tailwind-merge tw-animate-css
npm install -D @types/better-sqlite3 vitest @playwright/test tsx

# Domain + app-up (add scripts to package.json)
# "test": "vitest run"
# "test:app-up": "tsx --test test/app-up.test.ts"
# "test:e2e": "playwright test"
```

No `python/` package. No `scripts/dev.mjs` dual-process unless a later claim truly needs NumPy (it does not for coverage $ math).

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js App Router | Remix / Vite SPA | Never for Method Lab products — protocol lock |
| TypeScript domain scorers | Python FastAPI sidecar | Only if a future paper ports ML matching that needs NumPy/PyTorch — **not** this FinOps soft-sim |
| better-sqlite3 | JSON file / in-memory Map | Tiny throwaway prototypes only; CONTROLLER expects sqlite for durable imports/renewals |
| better-sqlite3 | Prisma / Drizzle + Postgres | Overkill for soft-sim; adds ops surface without buyer value |
| Bearer token | NextAuth / Clerk / Auth.js | Soft-sim seats need simple org bearer + members table, not IdP product |
| Vitest goldens | `tsx --test` only | Acceptable under PRODUCT_STACK (“Vitest or Node test runner”); siblings use it — prefer Vitest to match CONTROLLER wording |
| shadcn + Tailwind 4 | MUI / Chakra / raw CSS | Breaks lab UI kit + DESIGN token mapping |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Python / FastAPI sidecar** | Claim is dual coverage arithmetic + fixtures — not ML/signal; sidecar adds Windows venv friction for zero fidelity gain | Pure TS `src/domain/coverageA.ts` + `coverageB.ts` + Vitest goldens |
| **Isomorphic desk IA** (`/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens` as primary) | Banned by depth policy + blueprint | Domain IA: `/commitments` `/coverage` `/gaps` `/renewals` `/imports` `/compare` `/scoreboard` |
| **Live AWS Cost Explorer / Azure / GCP billing SDKs as required runtime** | Soft-sim fence; not system of record | Fixture CSV/JSON imports + honest `/honesty` copy |
| **Postgres / PlanetScale / Supabase** | CONTROLLER default is sqlite; cloud DB is out of scope for lab desks | `better-sqlite3` file DB |
| **NextAuth / Clerk / Supabase Auth** | Conflicts with bearer default; bloated for soft-sim | Bearer middleware + members in SQLite |
| **Tailwind v3 config invent** | create-next-app@latest ships Tailwind **v4** | `@tailwindcss/postcss` + CSS `@theme` / DESIGN CSS variables |
| **Parallel button/input system** | PRODUCT_STACK: compose shadcn only | `npx shadcn add …` |
| **Purple AI glow / cream+terracotta / dark-default** | DESIGN anti-looks | Cool ledger tokens (teal covered / rust gap) |
| **UTF-8 BOM `package.json` writes** | Breaks Node on Windows | Node `fs.writeFileSync` / `strip-json-bom.mjs --check` |
| **Idle Seat / True Up / Spend Cap noun-swap shells** | Different buyer stories; ban template clones | Commitment coverage domain modules + renewal pack UX |

## Stack Patterns by Variant

**If dual scorers stay pure arithmetic (this product):**
- Keep everything in Next + `src/domain/` + Vitest goldens
- Because PRODUCT_STACK explicitly prefers TS for billing/rule desks

**If a later milestone adds real provider API pull (optional):**
- Still no Python — use TS fetch clients behind import adapters
- Persist raw batches in SQLite; never block UI on live provider calls in soft-sim mode

**If Windows native build of better-sqlite3 fails in an agent environment:**
- Fall back to **`node:sqlite`** (`DatabaseSync`) on Node ≥22 when available, same schema
- Do **not** switch to Postgres to dodge native compile

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@16.3.0` | `react@19.2.x`, `eslint-config-next@16.3.0` | Keep eslint-config-next aligned with next |
| `tailwindcss@4.x` | `@tailwindcss/postcss@4` | Do not mix v3 `content` config patterns |
| `shadcn@4` + `radix-ui@1.6` | React 19 | Matches spend-cap / true-up / idle-seat scaffolds |
| `better-sqlite3@13` | Node native toolchain | Needs build tools on Windows; CI should prebuild or use matching Node |
| `vitest@4.1.x` | TypeScript domain modules | Run without Next bundler for goldens speed |
| `typescript@^5` (template) | Next 16 types | Prefer template `^5` over jumping to TS 7 until Next docs lock it |

### Pin strategy vs siblings

Recent FinOps siblings pin `next@16.2.11` / `react@19.2.4`. For **greenfield**, scaffold with **`create-next-app@latest`** (currently **16.3.0** / React **19.2.8**) — do not downgrade to match old locks. Do not invent a different framework to “modernize.”

## Architecture fit (stack-facing)

```text
projects/commitment-coverage-studio/
  src/app/                 # App Router pages + api/*
  src/components/ui/       # shadcn
  src/domain/              # coverageA, coverageB, gap $, goldens fixtures
  src/lib/db.ts            # better-sqlite3 singleton
  src/lib/auth.ts          # bearer
  data/coverage.db         # gitignored sqlite
  test/                    # vitest goldens + app-up
  e2e/                     # playwright
  screenshots/             # live captures
  try.html                 # offline approximate claim
  # NO python/
```

Webhook: provider-agnostic HMAC verify in a Route Handler (`CONTROLLER.payments`). Export JSON/CSV from server modules reading SQLite.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Lab primary stack (Next/TW/shadcn/TS) | **HIGH** | First-party `PRODUCT_STACK.md` + CONTROLLER `product_defaults` |
| No Python | **HIGH** | Blueprint claim = dual coverage math; PRODUCT_STACK billing→TS table |
| Package versions | **MEDIUM** | Verified via `npm view` 2026-08-07; Context7 Next docs confidence tier MEDIUM |
| SQLite driver choice | **MEDIUM** | Protocol says sqlite; lab products often under-implement — prescribe better-sqlite3 deliberately |
| Vitest vs sibling `tsx --test` | **MEDIUM** | Both allowed; Vitest matches CONTROLLER string |

## Sources

- `docs/PRODUCT_STACK.md` — required layers, Python gate, scaffold commands — **HIGH**
- `matrix/CONTROLLER.json` `product_defaults` — sqlite, bearer, vitest-playwright, webhook HMAC — **HIGH**
- `docs/ideas/commitment-coverage-studio-COMPREHENSIVE-BLUEPRINT.md` — dual A/B, domain IA — **HIGH**
- `docs/ideas/commitment-coverage-studio-DESIGN.md` — fonts, shadcn components, tokens — **HIGH**
- Sibling `projects/spend-cap-studio/package.json` (and true-up / idle-seat) — scaffold shape — **HIGH** (local)
- `npm view` 2026-08-07 — next 16.3.0, react 19.2.8, tailwindcss 4.3.3, vitest 4.1.10, better-sqlite3 13.0.3, zod 4.4.3, @playwright/test 1.62.1, shadcn 4.16.2 — registry snapshot
- Context7 `/vercel/next.js` — create-next-app App Router + TS + Tailwind defaults — classify-confidence **MEDIUM**

---
*Stack research for: Commitment Coverage Studio (FinOps soft-sim)*
*Researched: 2026-08-07*
*Do not commit from researcher — orchestrator commits*
