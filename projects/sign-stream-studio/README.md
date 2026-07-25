# Sign Stream Studio

Accessibility studio for **real-time sentence-level sign language translation** soft-sims: register streams, segment sentences, set latency budgets, curate glossary coverage, and compare real-time stream quality against an offline-batch baseline.

Inspired by [arXiv 2607.09611](https://arxiv.org/abs/2607.09611v1). Authors’ code: none published. **Not** live interpreter certification.

## Quick start

```bash
cd projects/sign-stream-studio
npm install
npm run dev
```

Open http://localhost:3000 — primary workspace is `/streams`.

Bearer token for APIs: `sss-dev-token`.

## Pages

| Route | Job |
|-------|-----|
| `/` | Marketing landing |
| `/pricing` | Pilot · Institution · Site license (method-lab packaging) |
| `/demo` | Guided step-by-step demo (one path) |
| `/onboarding` | First-run checklist with progress |
| `/flows` | Multi-flow index (≥5 named journeys) |
| `/streams` | Sign stream registry |
| `/sentences` | Sentence segment workspace |
| `/latency` | Latency budget board |
| `/glossary` | Glossary coverage |
| `/compare` | Real-time (A) vs offline-batch (B) |
| `/settings` | Org, members, exports |
| `/honesty` | Soft-sim fence + a11y notes + Sources |

## Dual score

- **A** — real-time sentence stream quality (latency-in-budget, boundaries, continuity)
- **B** — offline-batch baseline (full-sequence fidelity)

## Tests

```bash
npm test              # goldens + store + UI critical path
npm run test:app-up   # next build + next start GET /
```

Offline demo: open `try.html` in a browser.

Guide: `docs/guides/67-sign-stream-studio-lessons.md`
