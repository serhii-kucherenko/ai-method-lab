# Consult Bench Studio

Score multimodal (text+image) medical consult next-responses — dual score **A** (multimodal-aware plan quality) vs **B** (text-only baseline).

Inspired by [arXiv:2607.09142](https://arxiv.org/abs/2607.09142v1). **Not** MedRealMM, **not** clinical certification, **not** a live hospital chat.

## Quick start

```bash
cd projects/consult-bench-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing CTA goes to `/cases`.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/cases` | Consult case registry |
| `/turns` | Multimodal turns |
| `/departments` | Department coverage |
| `/scores` | Next-response scores |
| `/leaderboard` | Model / prompt ranks |
| `/compare` | Multimodal vs text-only |
| `/settings` | Org, members, features |
| `/honesty` | Fence + Sources |

## Tests

```bash
npm test
npm run test:app-up
```

## Offline demo

Open `try.html` in a browser for a simplified dual-score demo (no server).

## Honesty

Method-lab experiment. Soft simulation only. See `/honesty`.

## Sources

- Paper: https://arxiv.org/abs/2607.09142v1
- Guide: `docs/guides/61-consult-bench-studio-lessons.md`
