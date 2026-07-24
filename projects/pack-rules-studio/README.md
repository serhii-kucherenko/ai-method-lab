# Pack Rules Studio

Travel product teams generate packing checklists that obey **hard rules** (safety, luggage limits, dependencies) while still reflecting **soft preferences**.

**Tagline:** Personal lists that still obey the rules.

## Run

```bash
cd projects/pack-rules-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing CTA goes to `/profiles`.

## Tests

```bash
npm test
npm run test:app-up
```

## Dual score

- **A (rules+prefs):** symbolic hard-rule compliance, then soft personalization
- **B (prefs-only):** preference baseline that breaks safety / luggage rules

## Pages

`/` `/profiles` `/rules` `/preferences` `/checklists` `/optimize` `/compare` `/settings` `/honesty`

## Honesty

Method-lab studio inspired by [arXiv:2607.15562](https://arxiv.org/abs/2607.15562v1). Soft simulation only — **not** a live airline baggage API. Authors’ code: none with the digest.

Offline demo: `try.html`.

Tutor guide: `docs/guides/50-pack-rules-studio-lessons.md`.

## Auth

Dev bearer token: `prs-dev-token` (Authorization: Bearer …).
