# Security Control Desk — lessons

What this method-lab climb taught, in plain language.

## Claim

Paper [2607.09076](https://arxiv.org/abs/2607.09076v1) argues an LLM planner can propose interventions while a time-series sentinel simulates them with **counterfactual physics injection** and rejects hallucinations before actuation. Authors’ code: none published with this paper. We never brand the desk as **Neuro-Agentic Control**.

## What shipped

**Security Control Desk** compares a **naive open-loop baseline** (blind-execute the first candidate) against **safer agentic counterfactual control** (feasibility gate → physics injection → min-risk select or Monitor). Dual-impl goldens (≥25) keep scores honest. Marketing landing at `/`, nine desk pages, org/jobs/lifecycle/batch/audit/webhooks, offline `try.html`.

## Lessons worth keeping

1. **Rename the paper brand on day one.** Product display name stays mature; short paper names fail honesty and naming tests.
2. **Safety deltas must face a dumb baseline.** Counterfactual savings only read if naive open-loop is visible on the same scenario.
3. **Dual-impl goldens beat narrative.** Two scorers agreeing on 28 fixtures beats a single glowing demo.
4. **Landing is not the desk.** Sell the claim at `/`; put CRUD behind “Open desk.”
5. **Cheat paths teach the fence.** Rejecting `open_loop_cheat` documents what the score is *not*.
6. **Static harness + Next UI.** API tests hit `public/*.html`; humans use App Router pages with the same markers.
7. **Tutor guide before finish mail.** Sustain wants README + guide + try artifact — write the guide while the claim is fresh.

## Honesty fence (repeat)

Method experiment inspired by the paper. Not a replacement for the authors’ neuro-agentic control system. Not a commercial industrial control product. Never brand as Neuro-Agentic Control.

## Sources

- Paper: https://arxiv.org/abs/2607.09076v1  
- Authors’ code: none published  
