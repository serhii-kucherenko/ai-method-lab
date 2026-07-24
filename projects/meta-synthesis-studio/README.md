# Meta Synthesis Studio

Evidence teams run quantitative meta-analysis as an **agentic pipeline** (question → search → screen → extract → pool + heterogeneity) instead of ad-hoc single-pass work.

**Paper:** https://arxiv.org/abs/2607.15247v1  
**Authors' code:** none  
**Never branded as AutoSynthesis.** Soft simulation only — not live PubMed or publication-ready stats.

## Run

```bash
cd projects/meta-synthesis-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing CTA → `/questions`.

## Test

```bash
npm test
npm run test:app-up
```

## IA

`/` `/questions` `/searches` `/screens` `/effects` `/analyses` `/compare` `/settings` `/honesty`

## Dual score

- **A agentic** — full pipeline with screen discipline + heterogeneity
- **B ad-hoc** — single-pass baseline that skips screen discipline / no heterogeneity

## Offline demo

Open `try.html` in a browser for a no-server sketch of the claim.
