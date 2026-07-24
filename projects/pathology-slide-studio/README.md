# Pathology Slide Studio

Multi-signal pathology embedding studio for computational pathology teams.
Manage slide cohorts, run vision + vision-language + slide-level profiles, inspect patches, and compare against vision-only baselines.

**Not a clinical diagnostic product.** Method Lab research studio inspired by public multi-signal pathology foundation work.

## Quick start

```bash
cd projects/pathology-slide-studio
npm install
npm run dev
```

Open http://localhost:3000 — landing CTA goes to `/cohorts`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | Production |
| `npm test` | Goldens + store + UI critical path |
| `npm run test:app-up` | Live build + `next start` smoke |
| `npm run gen:goldens` | Regenerate 30 dual-impl fixtures |

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/cohorts` | Slide cohorts |
| `/embed` | Multi-signal embed console |
| `/slides` | Slide / patch inspection |
| `/compare` | Multi-signal vs vision-only |
| `/runs` | Audit + export |
| `/settings` | Org, members, webhook |
| `/honesty` | Fence + Sources |

## Auth

API routes expect `Authorization: Bearer pss-dev-token` (see Settings).

## Sources

- Paper: https://arxiv.org/abs/2607.09526v1
- Authors' code: https://github.com/WonderLandxD/ALICE
- Guide: `docs/guides/37-pathology-slide-studio-lessons.md`
