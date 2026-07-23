# Heart Scan Desk — lessons

What we learned climbing a unified cardiac CT segmentation+phenotyping desk from paper 2607.11287 through sustain.

## Domain before costume

The unique claim is **unified segmentation + phenotyping plans** (joint structure+phenotype pathway, human-in-loop review, multicenter-aware validation) versus segmentation-only, phenotype-from-raw-pixels-only, and single-center unchecked baselines. If the UI still talks about memory risk, ECG rhythm, or pathology slides after a clone, the product is isomorphic theater — scrub it before sustain.

## Dual-impl is the honesty engine

Keep two scorers that must agree on ≥25–30 goldens. Renaming strategy labels without regenerating fixtures and checking both paths is how silent drift ships.

## Live app gate

`npm test` unit green is not finish. Production `next build` + `next start` must serve `/` with the display name **Heart Scan Desk**. Copy `templates/product/app-up.test.ts` and wire it into `npm test`.

## Naming fence

Display name stays **Heart Scan Desk**. Never claim medical device or clinical diagnostic product. Never brand authors' foundation model names. Authors' code: none published.

## Sources

- Paper: https://arxiv.org/abs/2607.11287v1  
- Authors' code: none published  
