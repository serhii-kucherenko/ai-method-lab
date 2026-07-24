# On-Device Trip Studio

Mobile travel teams generate **feasible on-device itineraries** with Plan→Learn→Adapt — feasibility first, then desirability.

**Tagline:** Feasible first. Desirable next.

## Run

```bash
cd projects/on-device-trip-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing CTA goes to `/trips`.

## Tests

```bash
npm test
npm run test:app-up
```

## Dual score

- **A (feasibility-first):** Plan→Learn→Adapt — hard constraints first, then desire adaptation
- **B (desire-first):** preference baseline that skips hard schedule / resource constraints

## Pages

`/` `/trips` `/constraints` `/desires` `/plans` `/adapt` `/compare` `/settings` `/honesty`

## Honesty

Method-lab studio inspired by [arXiv:2607.15552](https://arxiv.org/abs/2607.15552v1). Soft simulation only — **not** a live maps or booking API. Not branded as PLA. Authors’ code: none with the digest.

Offline demo: `try.html`.

Tutor guide: `docs/guides/51-on-device-trip-studio-lessons.md`.

## Auth

Dev bearer token: `odts-dev-token` (Authorization: Bearer …).
