# Disaster Liaison Studio

Soft-sim studio for public-health / emergency-ops analytics leads comparing **pediatric-perinatal disaster liaison** frameworks against **generic disaster headquarters** baselines before locking a response pack.

## Run

```bash
cd projects/disaster-liaison-studio
npm install
npm run dev
```

Open http://localhost:3000 — primary CTA is **Open packs** → `/packs`.

Bearer token for API: `disaster-liaison-dev-token`.

## Tests

```bash
npm run test:unit
npm run test:app-up   # next build + live GET /
```

## Offline demo

Open `try.html` in a browser (approximate JS soft-sim; full fidelity is the Next app).

## Honesty

Not live emergency dispatch, not clinical triage authority, not government command systems. Research input: https://doi.org/10.1111/ped.70488 — authors' code: none published. Not the authors’ DLPPM brand.

## IA

packs / events / liaisons / handoffs / compare / scoreboard

## Scorers

- A `pediatric_perinatal_liaison`
- B `generic_disaster_hq`

Goldens: `dl-001` … `dl-030`
