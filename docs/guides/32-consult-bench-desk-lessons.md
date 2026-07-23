# Consult Bench Desk — lessons

What we learned climbing a multimodal consult-evaluation desk from paper 2607.09142 through sustain.

## Domain before costume

The unique claim is **real-world multimodal consult evaluation plans** (text + image evidence, real consult cases, rubric across modalities) versus text-only scoring, image-blind scoring, and synthetic-chat-only benches. If the UI still talks about chest X-ray classify→localize→validate, cardiac CT pathways, or pathology slides after a clone, the product is isomorphic theater — scrub it before sustain.

## Dual-impl is the honesty engine

Keep two scorers that must agree on ≥25–30 goldens. Renaming strategy labels without regenerating fixtures and checking both paths is how silent drift ships.

## Live app gate

`npm test` unit green is not finish. Production `next build` + `next start` must serve `/` with the display name **Consult Bench Desk**. Copy `templates/product/app-up.test.ts` and wire it into `npm test`.

## Naming fence

Display name stays **Consult Bench Desk**. Never claim telemedicine product. Never brand MedRealMM as the product. Authors' code: none published.

## Sources

- Paper: https://arxiv.org/abs/2607.09142v1  
- Authors' code: none published  
