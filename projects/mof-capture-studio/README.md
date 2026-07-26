# Mof Capture Studio

Soft-sim studio for water-remediation / materials analytics leads comparing **anionic MOF capture** vs **conventional sorbent** on recorded waters.

## Stack

Next.js App Router + Tailwind + shadcn · TypeScript · in-memory soft-sim store

## Scorers

- `anionic_mof_capture`
- `conventional_sorbent`

## Honesty

Not live plant control, not certified water audits, not municipal procurement. Not SU-102 brand. Research input: ChemRxiv 10.26434/chemrxiv.15006194/v1.

## Scripts

```bash
npm install
npm run gen:goldens
npm test
npm run build
npm run test:app-up
```

Offline demo: `try.html`
