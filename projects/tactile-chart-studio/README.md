# Tactile Chart Studio

Feel the chart. Ask it questions.

Accessibility and data teams ship chart exploration for blind and low-vision users using **conversational + layered tactile** presentation with a select-confirm-ask-verify loop — and compare that plan to a visual-only baseline.

## Run

```bash
cd projects/tactile-chart-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing sells the BLV accessible-chart outcome. Studio entry: `/charts`.

## Tests

```bash
npm test                 # goldens + store + UI critical path
npm run test:app-up      # next build + next start GET /
```

Dev bearer token: `tcs-dev-token` (Authorization: Bearer …).

## Product map

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/charts` | Chart asset library |
| `/layers` | Layered tactile presentation |
| `/grammar` | Feedback grammar editor |
| `/sessions` | Conversational explore sessions |
| `/verify` | Select-confirm-ask-verify loop |
| `/compare` | Conversational+tactile vs visual-only |
| `/settings` | Org, members, webhook, exports |
| `/honesty` | Fence + Sources |

## Dual score

- **A** — conversational + tactile plan quality (layers + grammar + verify loop)
- **B** — visual-only baseline (no tactile layers / weak verify discipline)

## Honesty

Method-lab soft simulation inspired by [arXiv:2607.14588](https://arxiv.org/abs/2607.14588v1). Not a live tactile hardware driver. Not branded as Graphy. Authors’ code: none with the digest.

Offline demo: `try.html`. Tutor guide: `docs/guides/49-tactile-chart-studio-lessons.md`.
