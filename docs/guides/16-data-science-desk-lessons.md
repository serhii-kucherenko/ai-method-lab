# Data Science Desk — lessons

What this method-lab climb taught, in plain language.

## Claim

Paper [2607.15901](https://arxiv.org/abs/2607.15901v1) argues a **data science world model** can anticipate expensive ops so agents skip real train/search burns. Authors’ code: none published with this paper. We never brand the desk as **DSWorld**.

## What shipped

**Data Science Desk** compares a **naive step-burn baseline** (charge every planned step) against **world-model guided routing** (execute lightweight ops; simulate expensive ones). Dual-impl goldens (≥25) keep scores honest. Marketing landing at `/`, nine desk pages, org/jobs/lifecycle/batch/audit/webhooks, offline `try.html`.

## Lessons worth keeping

1. **Rename the paper brand on day one.** Product display name stays mature; short paper names fail honesty and naming tests.
2. **Efficiency deltas must face a dumb baseline.** World-model savings only read if naive step-burn is visible on the same scenario.
3. **Dual-impl goldens beat narrative.** Two scorers agreeing on 28 fixtures beats a single glowing demo.
4. **Landing is not the desk.** Sell the claim at `/`; put CRUD behind “Open desk.”
5. **Cheat paths teach the fence.** Rejecting `step_burn_cheat` documents what the score is *not*.
6. **Static harness + Next UI.** API tests hit `public/*.html`; humans use App Router pages with the same markers.
7. **Tutor guide before finish mail.** Sustain wants README + guide + try artifact — write the guide while the claim is fresh.

## Honesty fence (repeat)

Method experiment inspired by the paper. Not a replacement for the authors’ world-model system. Not a commercial data-science agent platform. Never brand as DSWorld.

## Sources

- Paper: https://arxiv.org/abs/2607.15901v1  
- Authors’ code: none published  
