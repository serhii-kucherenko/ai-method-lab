# Blood Loss Studio

Soft-sim studio for obstetric / perinatal analytics leads: compare **weighed-swab measured** blood loss against **haemoglobin-calculated** baselines after caesarean birth before locking a birth pack.

## Run

```bash
cd projects/blood-loss-studio
npm install
npm run dev
```

Open http://localhost:3000

## Tests

```bash
npm test              # goldens + store + UI critical
npm run test:app-up   # next build + live GET /
```

## Offline demo

Open `try.html` in a browser (approximate soft-sim; full fidelity is the Next app).

## Honesty

Not live clinical advice, not EMR write-back, not device clearance. Research input: [medRxiv 10.64898/2026.07.16.26358295](https://www.medrxiv.org/content/10.64898/2026.07.16.26358295v1). Not an authors' product brand.

## Domain IA

`/packs` · `/births` · `/methods` · `/assays` · `/compare` · `/scoreboard` — not jobs/lifecycle/scenario desk shells.

## Scorers

- A `weighed_swab_measured`
- B `haemoglobin_calculated`

Goldens: `bl-001` … `bl-030`
