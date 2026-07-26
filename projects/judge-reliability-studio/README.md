# Judge Reliability Studio

**Agreement is not reliability.**

Judge Reliability Studio is a Method Lab soft-simulation for platform and eval engineering leads. It versions judge packs, runs item-response diagnostics (ability, difficulty, discrimination), flags unreliable items, and compares IRT-aware reliability gates against agreement-only baselines.

## Run

```bash
cd projects/judge-reliability-studio
npm install
npm run dev
```

## Verify

```bash
npm test
npm run build
npm run test:app-up
```

## Dual scorer

- **A — IRT reliability:** ability, difficulty, discrimination panels, form fit, and selective flagging on weak items.
- **B — agreement-only:** pairwise / exact-match theater with no IRT diagnostics and no escalation.

## Honesty

Method Lab soft-simulation only; not certified psychometrics or a live judge write-back. Open `try.html` offline for the lightweight demo.

## Guide

See `docs/guides/155-judge-reliability-studio-lessons.md` in the repo root.
