# Pavement Retrofit Studio

Soft-sim studio for infrastructure / climate-road analytics leads comparing **photocatalytic pavement retrofit** pathways against **conventional pavement-preservation** baselines before locking a corridor pack.

## Run

```bash
cd projects/pavement-retrofit-studio
npm install
npm run dev
```

Open http://localhost:3000 — primary CTA is **Open packs** → `/packs`.

Bearer token for API: `pavement-retrofit-dev-token`.

## Tests

```bash
npm run test:unit
npm run test:app-up   # next build + live GET /
```

## Offline demo

Open `try.html` in a browser (approximate JS soft-sim; full fidelity is the Next app).

## Honesty

Not live road construction control, not certified emissions audits, not municipal procurement authority. Research input: https://doi.org/10.26434/chemrxiv.15006236/v1 — authors' code: none published. Not the authors’ PlusTi brand.

## IA

packs / corridors / treatments / assays / compare / scoreboard

## Scorers

- A `photocatalytic_pavement_retrofit`
- B `conventional_preservation`

Goldens: `pr-001` … `pr-030`
