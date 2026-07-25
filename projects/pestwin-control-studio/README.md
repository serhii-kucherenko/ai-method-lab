# Pestwin Control Studio

Soft-sim studio for ag / vector-control simulation leads comparing **modular multi-agent PesTwin-style pest control** against a **single-species baseline** before locking a control pack.

## Honesty

Soft-sim only — never claim field-validated pest eradication or live spray-fleet write-back. Not an authors' rebrand.

Paper: https://arxiv.org/abs/2607.09420v1 · authors' code: none published

## Run

```bash
cd projects/pestwin-control-studio
npm install
npm run dev
```

Open http://localhost:3000

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

## Offline demo

Open `try.html` in a browser for an offline A/B soft-sim.

## Pages

`/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/controls`, `/modules`, `/populations`, `/runs`, `/compare`, `/scoreboard`, `/settings`, `/honesty`

## Dual scorers

- A: `modular_multiagent_pest_control`
- B: `single_species_baseline`
