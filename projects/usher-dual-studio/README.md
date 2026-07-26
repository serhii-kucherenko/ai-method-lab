# Usher Dual Studio

Soft-sim studio for gene-therapy / sensory-disorder analytics leads comparing **MYO7A gene supplementation** vs **Myo7b activation** on recorded allele packs.

## Run

```bash
cd projects/usher-dual-studio
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

Soft-sim only — not wet-lab validated, not IND/NDA ready, not patient dosing, not clinical gene-therapy advice. Not an authors' brand.

Research: [bioRxiv 10.64898/2026.07.02.736025](https://www.biorxiv.org/content/10.64898/2026.07.02.736025v1)

## Scorers

- `myo7a_gene_supplement`
- `myo7b_activation`

## Goldens

`ud-001` … `ud-030`

## Guide

`docs/guides/151-usher-dual-studio-lessons.md`
