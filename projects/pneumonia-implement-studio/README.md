# Pneumonia Implement Studio

Soft-sim studio for public-health / primary-care implementation analytics leads.

**Buyer outcome:** Compare CFIR co-designed childhood pneumonia primary-care models against status-quo pathway baselines before locking a district pack.

## Run

```bash
cd projects/pneumonia-implement-studio
npm install
npm run dev
```

Open http://localhost:3000

## Tests

```bash
npm run test          # goldens + store + ui-critical
npm run test:app-up   # next build + live GET /
npm run gen:goldens   # regenerate pi-001…pi-030
```

## Claim

- Scorer A: `cfir_codesign_primary_care`
- Scorer B: `status_quo_pathway`
- Goldens: `pi-001` … `pi-030`
- IA: packs / districts / pathways / fidelity / compare / scoreboard
- Offline demo: `try.html`

## Honesty

Soft-sim only — not live clinical triage, not EMR write-back, not government program authority. Research input: [medRxiv 10.64898/2026.07.16.26358238](https://www.medrxiv.org/content/10.64898/2026.07.16.26358238v1). Not an authors’ brand.
