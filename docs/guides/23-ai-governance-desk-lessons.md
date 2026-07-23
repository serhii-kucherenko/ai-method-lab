# AI Governance Desk — lessons

What this method-lab climb taught, in plain language.

## Claim

Paper [2607.14585](https://arxiv.org/abs/2607.14585v1) studies public preferences for governing artificial intelligence. We never brand the desk as a **government AI regulator** or **EU AI Act** product. The product claim is **conjoint preference scoring**: safety vs innovation, public vs private, international vs national — versus **always-innovation / always-private / always-national** (or composite tech-first) baselines. Authors' code: none published; OSF pre-registration may be cited in Sources only (https://osf.io/5rz9p/).

## What shipped

**AI Governance Desk** compares preference-aligned proposals against naive tech-first baselines. Dual-impl goldens (≥30) keep scores honest. Marketing landing at `/`, nine desk pages, org/jobs/lifecycle/batch/audit/webhooks, offline `try.html`.

## Lessons worth keeping

1. **Rename the paper brand on day one.** Product display name stays mature; regulator / statute product names fail honesty and naming tests if used as brand.
2. **Deltas must face dumb baselines.** Preference-aligned scoring only reads if always-innovation / private / national sit on the same scenario.
3. **Dual-impl goldens beat narrative.** Two scorers agreeing on 30 fixtures beats a single glowing policy demo.
4. **Landing is not the desk.** Sell the claim at `/`; put CRUD behind “Open desk.”
5. **Cheat paths teach the fence.** Rejecting `skip_verify_cheat` / ignore-prefs documents what the score is *not*.
6. **Static harness + Next UI.** API tests hit `public/*.html`; humans use App Router pages with the same markers.
7. **Tutor guide before finish mail.** Sustain wants README + guide + try artifact — write the guide while the claim is fresh.
8. **Do not ship a rebranded tactile or synthesis desk.** Soft-layer chart verify / eligibility pooling are different papers; governance domain must encode the three preference axes and naive baselines.

## Honesty fence (repeat)

Method experiment inspired by the paper. Not a replacement for the authors' survey research or OSF materials. Not a government AI regulation product. Never brand as a government AI regulator or EU AI Act product name.

## Sources

- Paper: https://arxiv.org/abs/2607.14585v1  
- Authors' code: none published · OSF pre-registration: https://osf.io/5rz9p/  
