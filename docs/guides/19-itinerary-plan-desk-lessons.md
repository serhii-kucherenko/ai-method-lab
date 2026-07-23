# Itinerary Plan Desk — lessons

What this method-lab climb taught, in plain language.

## Claim

Paper [2607.15552](https://arxiv.org/abs/2607.15552v1) argues day itineraries should **plan** diverse feasible candidates under hard windows, **learn** a preference reward over whole schedules, then **adapt** with local edits that stay feasible. Authors’ code: [Official529Tech/pla-itinerary](https://github.com/Official529Tech/pla-itinerary). We never brand the desk as **FlyEnJoy** or **PLA**.

## What shipped

**Itinerary Plan Desk** compares a **naive preference-only baseline** (soft-budget stacking that can break opening hours or day budgets) against **feasibility-first plan/learn/adapt** (enumerate feasible orders, maximize preference, adjacent-swap adapt). Dual-impl goldens (≥28) keep scores honest. Marketing landing at `/`, nine desk pages, org/jobs/lifecycle/batch/audit/webhooks, offline `try.html`.

## Lessons worth keeping

1. **Rename the paper brand on day one.** Product display name stays mature; short paper names (FlyEnJoy / PLA) fail honesty and naming tests.
2. **Feasibility deltas must face a dumb baseline.** Plan/learn/adapt only reads if naive preference-only window violations are visible on the same scenario.
3. **Dual-impl goldens beat narrative.** Two scorers agreeing on 28 fixtures beats a single glowing demo.
4. **Landing is not the desk.** Sell the claim at `/`; put CRUD behind “Open desk.”
5. **Cheat paths teach the fence.** Rejecting `preference_cheat` documents what the score is *not*.
6. **Static harness + Next UI.** API tests hit `public/*.html`; humans use App Router pages with the same markers.
7. **Tutor guide before finish mail.** Sustain wants README + guide + try artifact — write the guide while the claim is fresh.
8. **Do not ship a rebranded packing desk.** Luggage capacity / bans / dependencies is a different paper; itinerary domain must encode POIs, opening hours, travel, and day budgets.

## Honesty fence (repeat)

Method experiment inspired by the paper. Not a replacement for the authors’ on-device itinerary system. Not a commercial trip planner. Never brand as FlyEnJoy or PLA.

## Sources

- Paper: https://arxiv.org/abs/2607.15552v1  
- Authors’ code: https://github.com/Official529Tech/pla-itinerary  
