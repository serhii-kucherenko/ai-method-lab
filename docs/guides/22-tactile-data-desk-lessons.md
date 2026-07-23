# Tactile Data Desk — lessons

What this method-lab climb taught, in plain language.

## Claim

Paper [2607.14588](https://arxiv.org/abs/2607.14588v1) describes conversational tactile data interfaces. We never brand the desk as **Feelogue**, **CTDI**, or **Dot Pad**. The product claim is **touch-first + verify**: soft layered select → confirm → ask agent → verify on chart, versus a **speech-only answer** that skips tactile grounding. Authors' code: https://github.com/accessible-data-vis/feelogue.

## What shipped

**Tactile Data Desk** compares speech-only and other weak baselines against grounded select-confirm-verify scoring. Dual-impl goldens (≥30) keep scores honest. Marketing landing at `/`, nine desk pages, org/jobs/lifecycle/batch/audit/webhooks, offline `try.html`. Soft RTD layer simulation — no hardware required.

## Lessons worth keeping

1. **Rename the paper brand on day one.** Product display name stays mature; Feelogue / CTDI / Dot Pad fail honesty and naming tests if used as brand.
2. **Deltas must face dumb baselines.** Grounded verify only reads if speech-only (and select-without-confirm) sit on the same scenario.
3. **Dual-impl goldens beat narrative.** Two scorers agreeing on 30 fixtures beats a single glowing accessibility demo.
4. **Landing is not the desk.** Sell the claim at `/`; put CRUD behind “Open desk.”
5. **Cheat paths teach the fence.** Rejecting `skip_verify_cheat` documents what the score is *not*.
6. **Static harness + Next UI.** API tests hit `public/*.html`; humans use App Router pages with the same markers.
7. **Tutor guide before finish mail.** Sustain wants README + guide + try artifact — write the guide while the claim is fresh.
8. **Do not ship a rebranded synthesis or prompt-cache desk.** Eligibility pooling / tier thresholds are different papers; tactile domain must encode select, confirm, ask, and verify.

## Honesty fence (repeat)

Method experiment inspired by the paper. Not a replacement for the authors' system. Not a commercial tactile accessibility product. Never brand as Feelogue, CTDI, or Dot Pad.

## Sources

- Paper: https://arxiv.org/abs/2607.14588v1  
- Authors' code: https://github.com/accessible-data-vis/feelogue  
