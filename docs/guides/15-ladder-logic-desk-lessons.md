# Ladder Logic Desk — lessons

Method-lab tutor note for climbing a paper-sourced formal-verification desk from smoke to sustain.

## What the paper gave us

Paper [2607.08417](https://arxiv.org/abs/2607.08417v1) argues that ladder-logic bombs hide in function-block bodies and that formal modeling plus trigger synthesis catches payloads and recovers detonation conditions that naive CFG/scan triage miss. Authors’ code was not published with the paper, so the desk is a **method sketch**, not a port of their verifier.

## What we built

**Ladder Logic Desk** — Next.js + Tailwind + shadcn org desk with:

- Marketing landing at `/`
- Verification jobs, lifecycle, batch, audit, settings
- Scenario compare: **naive scan baseline** vs **formal trigger synthesis**
- ≥25 dual-impl goldens (A/B agreement)
- Offline `try.html`
- Honesty fence: never brand as the authors’ tool names or IEC statute codes

## Lessons

1. **Brand the desk, not the paper tool.** Display name is Ladder Logic Desk. Honesty copy may name the authors’ tool only to refuse it as brand.
2. **Dual-impl before UI polish.** Goldens that agree on A/B catch silent scoring drift faster than screenshots.
3. **Naive vs formal must differ on adaptive triggers.** If both scores always match, the claim is fake.
4. **Landing is a product page.** First viewport = brand + one headline + one sentence + CTA. Desk CRUD is not a substitute.
5. **Sustain needs pages + features + try + guide.** API-green alone fails the lab bar.
6. **No package.json BOM on Windows.** Write JSON with Node or strip-json-bom.

## Honesty fence (keep forever)

Not a replacement for the authors’ formal verifier. Not a commercial PLC security product. Not measured plant outcomes.

## Sources

- Paper: https://arxiv.org/abs/2607.08417v1  
- Authors’ code: none published  
