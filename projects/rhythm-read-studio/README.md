# Rhythm Read Studio

Long-tailed ECG arrhythmia workspace for ML teams. Soft-simulates angular Gaussian supervised contrastive / long-tail profiles versus flat CE / no-tail baselines.

**Not** branded as AG-SCL. **Not** an isomorphic lab desk shell. **Not** a clinical diagnostic device.

## Paper
- https://arxiv.org/abs/2607.14613v1
- Authors’ code: https://github.com/Open-EXG/AG-SCL-for-Long-Tailed-ECG

## Run
```bash
cd projects/rhythm-read-studio
npm install
npm run dev
```

Open http://localhost:3000 — landing CTA goes to `/cohorts`.

## Test
```bash
npm test
npm run test:app-up   # live build + next start smoke
```

## Pages
`/` `/cohorts` `/train` `/classes` `/compare` `/runs` `/settings` `/honesty`

## Auth
Bearer token `rrs-dev-token` (see Settings). Webhook: HMAC-SHA256 `x-signature` + `Idempotency-Key`.
