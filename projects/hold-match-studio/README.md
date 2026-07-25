# Hold Match Studio

Marketplace hold-control studio for ride-hail ops — model hold decisions, score passenger/driver experience lanes, walk match timelines, compare experience-aware hold vs first-feasible baselines.

Inspired by [EXHOLD](https://arxiv.org/abs/2607.09090v1). **Not** EXHOLD or DiDi production control. Authors’ code: none published.

## Quick start

```bash
cd projects/hold-match-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing at `/`, studio entry at `/holds`.

Dev API bearer token: `hms-dev-token`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js app |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm test` | Goldens + store + UI critical path |
| `npm run test:app-up` | Live build + start smoke on `/` |
| `npm run gen:goldens` | Regenerate dual-impl fixtures |

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/pricing` | Hypothetical SaaS tiers (ops seats / usage / site) |
| `/demo` | Step-by-step guided in-app happy path |
| `/onboarding` | First-run checklist with progress |
| `/matches` | Driver–order candidate registry |
| `/holds` | Hold decision board |
| `/lanes` | Passenger / driver experience lanes |
| `/timelines` | Match hold/release timelines |
| `/compare` | Experience-aware vs first-feasible |
| `/settings` | Org, members, exports |
| `/honesty` | Soft-sim fence + Sources |

## Dual scoring

- **A** — experience-aware hold quality  
- **B** — first-feasible baseline  

~30 dual-impl goldens under `test/fixtures/`.

## Offline demo

Open `try.html` in a browser for a standalone soft-sim compare.

## Guide

`docs/guides/66-hold-match-studio-lessons.md`
