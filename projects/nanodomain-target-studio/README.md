# Nanodomain Target Studio

Soft-sim studio for cardio drug-discovery / precision-therapy analytics leads who need to compare **localized cAMP/PKA nanodomain targeting** against **systemic phosphorylation baselines** before locking a therapy pack.

Inspired by [bioRxiv 10.1101/2025.11.18.689162](https://www.biorxiv.org/content/10.1101/2025.11.18.689162v3). Not the authors’ peptide system. Not wet-lab validated IND/NDA. Not live patient dosing. Not clinical heart-failure diagnosis.

## Run

```bash
cd projects/nanodomain-target-studio
npm install
npm run dev
```

Open http://localhost:3000

## Tests

```bash
npm test
npm run test:app-up
```

## Domain IA

`/packs` `/nanodomains` `/peptides` `/assays` `/compare` `/scoreboard` plus `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`

## Scorers

- A `localized_nanodomain_target`
- B `systemic_phosphorylation_baseline`

Goldens: `nt-001` … `nt-030`

## Offline demo

Open `try.html` for an approximate A/B soft-sim without the Next server.
