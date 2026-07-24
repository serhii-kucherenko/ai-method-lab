# Thorax Localize Studio

CXR disease classification with lesion localization — and an honest classify-only compare.

**Not** clinical certification or live PACS. Method Lab experiment inspired by [arXiv:2607.09305](https://arxiv.org/abs/2607.09305v1). Not branded as Inspectra.

## Run

```bash
cd projects/thorax-localize-studio
npm install
npm run dev
```

Open http://localhost:3000 — landing CTA goes to `/exams`.

Dev API bearer: `tls-dev-token`.

## Test

```bash
npm test
npm run test:app-up
```

## Pages

`/` · `/exams` · `/findings` · `/lesions` · `/maps` · `/validation` · `/compare` · `/settings` · `/honesty`

## Dual score

- **A** — classify + localize plan quality (PCAM-style maps)
- **B** — classify-only baseline (no lesion location)

## Offline demo

Open `try.html` in a browser for a quick localize vs classify-only sketch.
