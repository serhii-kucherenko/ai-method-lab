# R2map Translate Studio

Soft-sim studio for neuroimaging / Parkinson MRI analytics leads to compare **GAN T1W/T2W→R2map translation** against a **conventional R2 estimation baseline** before locking a translate pack.

Paper: https://doi.org/10.1002/mp.70561 · authors’ code: none published

## Honesty

Method-lab soft-sim only. Not clinical diagnostic use, not live PACS write-back, not FDA cleared, not the authors’ system.

## Run

```bash
cd projects/r2map-translate-studio
npm install
npm run dev
```

Offline demo: open `try.html` in a browser.

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

## Dual scorers

- A: `gan_r2map_translation`
- B: `conventional_r2_baseline`

Goldens: `r2-001` … `r2-030`

## Pages

`/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/translates`, `/inputs`, `/maps`, `/runs`, `/compare`, `/scoreboard`, `/settings`, `/honesty`
