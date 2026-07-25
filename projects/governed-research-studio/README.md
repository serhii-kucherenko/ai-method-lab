# Governed Research Studio

Soft-sim studio for institutional research leads: version study packs, define governance gates and research workflows, then compare **governed end-to-end research** against **ungated agent baselines** before locking a pack.

**Honesty:** soft-sim only · not IRB cleared · not live PHI · not the authors’ system  
**Paper:** [arXiv 2607.11084](https://arxiv.org/abs/2607.11084v1) · authors’ code: none

## Run

```bash
npm install
npm run dev
```

Bearer token for APIs: `governed-research-dev-token`

## Scripts

- `npm test` — goldens + store + UI critical
- `npm run build` — production build
- `npm run test:app-up` — live smoke (build + start + GET /)
- Offline demo: open `try.html`

## Domain IA

`/studies` · `/gates` · `/workflows` · `/runs` · `/compare` · `/scoreboard`
