# Fail Gate Studio

Soft-sim **eval / safety release-gate bench** for health LLM safety QA leads.

## Claim

Register fail cases, maintain severity and safety-gate taxonomies, inspect boundary reasons, and compare **fail-gate taxonomy diagnosis (A)** against a **correctness-only baseline (B)** before release.

## Run

```bash
cd projects/fail-gate-studio
npm install
npm run dev
```

Open http://localhost:3000 — bearer token for APIs: `fgs-dev-token`.

```bash
npm test
npm run test:app-up
```

## Honesty

Method-lab soft-sim. Not MedFailBench. Not clinical decision support. Not a live hospital deployment.

## Sources

- Paper: https://arxiv.org/abs/2607.15166v1
- Authors’ code: none
