# Dhodh Screen Studio

Soft-sim studio for antimalarial / computational chemistry leads comparing **structure-based PfDHODH virtual screening** (`structure_based_dhodh`) against **naive library baselines** (`naive_library_baseline`) on recorded screen packs.

## Honesty

Not wet-lab validation, clinical antimalarial advice, IND/NDA readiness, live compound procurement, or the authors’ brand. Research input: [ChemRxiv 10.26434/chemrxiv.15005938/v1](https://doi.org/10.26434/chemrxiv.15005938/v1).

## Run

```bash
npm install
npm run dev
```

Offline demo: open `try.html`.

## Verify

```bash
npm run gen:goldens
npm test
npm run build
npm run test:app-up
```

## Docs

- Idea pack: `docs/ideas/dhodh-screen-studio*.md`
- Lessons: `docs/guides/153-dhodh-screen-studio-lessons.md`
