# Blueprint — Judge Reliability Studio

## Pages (≥11)

| Route | Purpose |
|-------|---------|
| `/` | Marketing — sell IRT judge reliability diagnostics |
| `/pricing` | Evaluator / Platform / Site tiers |
| `/demo` | Guided: pack → items → form → diagnostic → flag → compare |
| `/onboarding` | First-run checklist |
| `/flows` | ≥5 journeys |
| `/judges` | Judge pack registry |
| `/items` | Scoreable items |
| `/forms` | Forms / instruments |
| `/diagnostics` | IRT diagnostic runs |
| `/flags` | Unreliable item / unstable judge queue |
| `/compare` | IRT gate (A) vs agreement-only (B) |
| `/scoreboard` | Leaderboard |
| `/settings` | Org / members / webhook |
| `/honesty` | Soft-sim fence |

Forbidden: `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens`

## Dual score
- **A:** IRT-aware reliability (ability, difficulty, discrimination, escalate on weak items)
- **B:** Agreement-only baseline (pairwise / exact-match theater)

## Features (≥25)
Landing, pricing, demo, onboarding, flows, judge packs CRUD+lock, items CRUD+search, forms CRUD, diagnostic runs, ability/difficulty/discrimination panels, unreliable flags, escalate/resolve, dual compare, scoreboard, honesty, settings, members, bearer auth, rate limit, webhook HMAC, export JSON/CSV, features API, goldens sample, audit, try.html, guide link
