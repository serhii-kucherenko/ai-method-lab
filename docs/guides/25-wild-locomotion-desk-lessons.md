# Wild Locomotion Desk — lessons

What this method-lab climb taught, in plain language.

## Claim

Paper [2607.13579](https://arxiv.org/abs/2607.13579v1) studies agile perceptive multi-skill locomotion for quadrupeds in the wild. We never brand the desk as **APT-RL**. The product claim is **multi-skill perceptive locomotion**: skill library + autonomous transitions for mixed obstacles (stairs, hurdles, gaps, stones) — versus a **single-skill / flat-terrain-only naive policy**. Authors' code: none published.

## What shipped

**Wild Locomotion Desk** compares multi-skill plans against naive flat baselines. Dual-impl goldens (≥30) keep scores honest. Marketing landing at `/`, nine desk pages, org/jobs/lifecycle/batch/audit/webhooks, offline `try.html`. Soft simulation — no robot hardware.

## Lessons worth keeping

1. **Rename the paper brand on day one.** Product display name stays mature; APT-RL fails honesty and naming tests if used as brand.
2. **Deltas must face dumb baselines.** Multi-skill only reads if flat-only / perception-blind / no-transitions sit on the same scenario.
3. **Dual-impl goldens beat narrative.** Two scorers agreeing on 30 fixtures beats a single glowing robot demo.
4. **Landing is not the desk.** Sell the claim at `/`; put CRUD behind “Open desk.”
5. **Cheat paths teach the fence.** Rejecting flat-only / skip-transitions documents what the score is *not*.
6. **Static harness + Next UI.** API tests hit `public/*.html`; humans use App Router pages with the same markers.
7. **Tutor guide before finish mail.** Sustain wants README + guide + try artifact — write the guide while the claim is fresh.
8. **Do not ship a rebranded stage-validate or governance desk.** Preference axes for locomotion must encode skill library, perception, and autonomous transitions — not stage gates or dual-approvers.

## Honesty fence (repeat)

Method experiment inspired by the paper. Not a replacement for the authors' quadruped controller or commercial robot stacks. Soft simulation only. Never brand APT-RL as the product name.

## Sources

- Paper: https://arxiv.org/abs/2607.13579v1  
- Authors' code: none published  
