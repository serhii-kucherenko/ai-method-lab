# Citizen Pref Studio

Soft-sim studio for **safety-first public-oversight** AI policy packs vs **innovation-first self-regulation** baselines.

Inspired by [arXiv 2607.14585](https://arxiv.org/abs/2607.14585v1) — not live regulatory authority, not government deployment, not certified polling, not the authors’ survey brand.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Bearer token: `citizen-pref-dev-token`.

## Scripts

- `npm test` — goldens + store + UI critical
- `npm run build` — production build
- `npm run test:app-up` — build + live `/` smoke
- `npm run gen:goldens` — regenerate `cp-001`…`cp-030`

## Routes

`/` · `/pricing` · `/demo` · `/onboarding` · `/flows` · `/packs` · `/options` · `/countries` · `/surveys` · `/prefs` · `/compare` · `/scoreboard` · `/settings` · `/honesty`

Offline demo: [try.html](./try.html)
