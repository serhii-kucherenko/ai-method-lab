# Split Endo Studio

Soft-sim studio for spine / MIS surgical analytics leads comparing **one-hole split endoscopy** pathways against **open laminectomy** baselines for single-level thoracic OLF case packs.

## Run

```bash
cd projects/split-endo-studio
npm install
npm run dev
```

Open http://localhost:3000 — primary CTA is **Open packs** → `/packs`.

Bearer token for API: `split-endo-dev-token`.

## Tests

```bash
npm run test:unit
npm run test:app-up   # next build + live GET /
```

## Offline demo

Open `try.html` in a browser (approximate JS soft-sim; full fidelity is the Next app).

## Honesty

Not live OR control, not device clearance, not clinical advice. Research input: https://doi.org/10.21203/rs.3.rs-10158488/v1 — authors' code: none published.

## IA

packs / cases / approaches / outcomes / compare / scoreboard

## Scorers

- A `one_hole_split_endoscopy`
- B `open_laminectomy`

Goldens: `se-001` … `se-030`
