# Evidence Synthesis Desk — lessons

What this method-lab climb taught, in plain language.

## Claim

Paper [2607.15247](https://arxiv.org/abs/2607.15247v1) describes agentic meta-analysis with screening and pooling. We never brand the desk as **AutoSynthesis** or **PRISMA**. The product claim is **screened synthesis**: eligibility → standardized effect sizes → random-effects pool + heterogeneity + audit, versus a **naive average of reported numbers** that skips screening. Authors' code: none published.

## What shipped

**Evidence Synthesis Desk** compares naive averages and other weak baselines against screened Hedges' g + DerSimonian–Laird pooling. Dual-impl goldens (≥30) keep scores honest. Marketing landing at `/`, nine desk pages, org/jobs/lifecycle/batch/audit/webhooks, offline `try.html`.

## Lessons worth keeping

1. **Rename the paper brand on day one.** Product display name stays mature; AutoSynthesis / PRISMA fail honesty and naming tests if used as brand.
2. **Deltas must face dumb baselines.** Screened pooling only reads if naive averages (and include-all fixed-effect) sit on the same scenario.
3. **Dual-impl goldens beat narrative.** Two scorers agreeing on 30 fixtures beats a single glowing forest plot.
4. **Landing is not the desk.** Sell the claim at `/`; put CRUD behind “Open desk.”
5. **Cheat paths teach the fence.** Rejecting `perfect_homogeneity_cheat` documents what the score is *not*.
6. **Static harness + Next UI.** API tests hit `public/*.html`; humans use App Router pages with the same markers.
7. **Tutor guide before finish mail.** Sustain wants README + guide + try artifact — write the guide while the claim is fresh.
8. **Do not ship a rebranded prompt-cache desk.** Prefix tokens / tier thresholds / ρ are a different paper; synthesis domain must encode eligibility, effect sizes, and random-effects.

## Honesty fence (repeat)

Method experiment inspired by the paper. Not a replacement for the authors' system. Not a commercial evidence-synthesis vendor. Never brand as AutoSynthesis.

## Sources

- Paper: https://arxiv.org/abs/2607.15247v1  
- Authors' code: none published  
