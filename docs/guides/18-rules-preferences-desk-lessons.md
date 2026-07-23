# Rules Preferences Desk — lessons

What this method-lab climb taught, in plain language.

## Claim

Paper [2607.15562](https://arxiv.org/abs/2607.15562v1) argues packing checklists must keep **hard feasibility** (capacity, bans, dependencies) while maximizing **soft preferences** inside the feasible set. Authors’ code: [Official529Tech/rlo-checklist](https://github.com/Official529Tech/rlo-checklist). We never brand the desk as **FlyEnJoy**, **RLO**, or **hard-rules-soft**.

## What shipped

**Rules Preferences Desk** compares a **naive preference-only baseline** (soft-capacity greedy that can violate bans/deps/overpack) against **hard-rule gated preference selection** (enumerate feasible subsets, maximize utility). Dual-impl goldens (≥28) keep scores honest. Marketing landing at `/`, nine desk pages, org/jobs/lifecycle/batch/audit/webhooks, offline `try.html`.

## Lessons worth keeping

1. **Rename the paper brand on day one.** Product display name stays mature; short paper names (FlyEnJoy / RLO) fail honesty and naming tests.
2. **Feasibility deltas must face a dumb baseline.** Constrained utility only reads if naive preference-only violations are visible on the same scenario.
3. **Dual-impl goldens beat narrative.** Two scorers agreeing on 28 fixtures beats a single glowing demo.
4. **Landing is not the desk.** Sell the claim at `/`; put CRUD behind “Open desk.”
5. **Cheat paths teach the fence.** Rejecting `preference_cheat` documents what the score is *not*.
6. **Static harness + Next UI.** API tests hit `public/*.html`; humans use App Router pages with the same markers.
7. **Tutor guide before finish mail.** Sustain wants README + guide + try artifact — write the guide while the claim is fresh.
8. **Do not ship a rebranded control desk.** Industrial CF physics is a different paper; packing domain must encode capacity/bans/deps.

## Honesty fence (repeat)

Method experiment inspired by the paper. Not a replacement for the authors’ packing checklist system. Not a commercial travel packing product. Never brand as FlyEnJoy or RLO.

## Sources

- Paper: https://arxiv.org/abs/2607.15562v1  
- Authors’ code: https://github.com/Official529Tech/rlo-checklist  
