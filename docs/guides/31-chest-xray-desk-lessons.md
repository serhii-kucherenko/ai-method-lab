# Chest Xray Desk — lessons

What we learned climbing a classify→localize→clinically-validate desk from paper 2607.09305 through sustain.

## Domain before costume

The unique claim is **classify → localize → clinically validate plans** (label + region + validation gate) versus classification-only without regions, localization without a clinical gate, and unverified single-threshold alerts. If the UI still talks about cardiac CT pathways, memory risk, or pathology slides after a clone, the product is isomorphic theater — scrub it before sustain.

## Dual-impl is the honesty engine

Keep two scorers that must agree on ≥25–30 goldens. Renaming strategy labels without regenerating fixtures and checking both paths is how silent drift ships.

## Live app gate

`npm test` unit green is not finish. Production `next build` + `next start` must serve `/` with the display name **Chest Xray Desk**. Copy `templates/product/app-up.test.ts` and wire it into `npm test`.

## Naming fence

Display name stays **Chest Xray Desk**. Never claim medical device or radiology product. Never brand the authors' Thailand deep learning system. Authors' code: none published.

## Sources

- Paper: https://arxiv.org/abs/2607.09305v1  
- Authors' code: none published  
