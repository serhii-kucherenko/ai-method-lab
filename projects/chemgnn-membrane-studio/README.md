# Chemgnn Membrane Studio

Soft-sim studio for membrane / desalination ML leads: version membrane packs, encode CNT graphs, run ChemGNN-style surrogates, and compare against classical physics baselines before locking a pack.

**Not** wet-lab validated desalination membranes, live plant write-back, or the authors' system.

## Paper

- https://doi.org/10.26434/chemrxiv.15006282/v1
- Authors' code: none published

## Run

```bash
cd projects/chemgnn-membrane-studio
npm install
npm run dev
```

Open http://localhost:3000 — bearer token for APIs: `chemgnn-membrane-dev-token`.

Offline demo: open `try.html` in a browser.

## Test

```bash
npm test
npm run build
npm run test:app-up
```

## Dual scorers

- A: `chemgnn_surrogate`
- B: `classical_physics_baseline`

Goldens: `cm-001` … `cm-030`.

## Pages

`/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/membranes`, `/graphs`, `/surrogates`, `/runs`, `/compare`, `/scoreboard`, `/settings`, `/honesty`
