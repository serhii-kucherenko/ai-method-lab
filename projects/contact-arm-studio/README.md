# Contact Arm Studio

Plan contact where the arm actually touches.

Soft-sim bench for robotics teams: version **manipulator packs**, define **contact points** and **contact plans**, attach tactile+vision cues, then compare a **contact-centric tactile+vision scorer** against a **vision-only baseline**.

## Honesty

- Soft-sim / method-lab only
- Not a live robot controller
- Not a safety certification
- Not branded as TACTIC
- Paper: [arXiv 2607.09218](https://arxiv.org/abs/2607.09218v1) — authors’ code: none published

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Dev bearer token: `cas-dev-token`.

Offline demo: open `try.html` in a browser.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js app |
| `npm run build` | Production build |
| `npm test` | Goldens + store + UI critical |
| `npm run test:app-up` | Live build + `next start` smoke |
| `npm run gen:goldens` | Regenerate ≥30 dual goldens |

## Primary routes

`/manipulators` · `/contacts` · `/plans` · `/sensing` · `/compare` · `/scoreboard` · `/pricing` · `/demo` · `/onboarding` · `/flows` · `/settings` · `/honesty`

## Dual A/B

- **A** `contact_centric` — contact-centric tactile+vision scorer
- **B** `vision_only` — vision-only baseline

Implementations live in `src/domain/scoreA.ts` and bitwise-identical `src/domain/scoreB.ts`.
