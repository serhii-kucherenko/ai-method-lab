# Joint Care Desk

Org desk for dual-evidence musculoskeletal pathway plans — method-lab product from paper 2607.12527.

**Display name:** Joint Care Desk (never brand OrthoPilot / CHEESE / OrthoBench / ORACLE)

## Paper

- **Id:** 2607.12527
- **Title:** Evidence-Grounded AI for Musculoskeletal Care
- **URL:** https://arxiv.org/abs/2607.12527v2
- **Code:** none published

## Unique claim

Dual-evidence pathway plans (in-hospital evidence + external knowledge + stage-aware care from admission through rehab) versus naive parametric-memory-only, hospital-only, external-only, or stage-blind baselines.

## Honesty

Workflow experiment inspired by the paper. Soft simulation only. Not a replacement for the authors' OrthoPilot system or commercial clinical AI vendors.

## Run

```bash
cd projects/joint-care-desk
npm install
npm run test:unit
npm run build
npm run test:app-up
npm run dev
```

## Docs

- Product: `PRODUCT.md`
- Design: `docs/ideas/joint-care-desk-DESIGN.md`
- Guide: `docs/guides/26-joint-care-desk-lessons.md`
- Offline try: `try.html`

## Config hygiene

Never write `package.json` with a UTF-8 BOM. Use Node `fs.writeFileSync` or `node scripts/strip-json-bom.mjs`.
