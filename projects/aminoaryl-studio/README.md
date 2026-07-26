# Aminoaryl Studio

Soft-sim studio for medicinal chemistry / route-planning analytics leads comparing **photocatalytic 1,3-aminoarylation** vs **copper-catalyzed aminoarylation** on recorded route packs.

## Run

```bash
cd projects/aminoaryl-studio
npm install
npm run dev
```

Open http://localhost:3000

## Verify

```bash
npm run gen:goldens
npm test
npm run build
npm run test:app-up
```

## Honesty

Soft-sim only — not wet-lab validated, not scale-up manufacturing control, not regulatory filing authority. Not an authors' brand.

Research: [ChemRxiv 10.26434/chemrxiv.15005923/v1](https://doi.org/10.26434/chemrxiv.15005923/v1)

## Scorers

- `photocatalytic_aminoaryl`
- `copper_catalyzed_aminoaryl`

## Goldens

`aa-001` … `aa-030`

## Guide

`docs/guides/152-aminoaryl-studio-lessons.md`
