# Prompt Cache Desk — lessons

What this method-lab climb taught, in plain language.

## Claim

Paper [2607.15516](https://arxiv.org/abs/2607.15516v1) argues prompt compression and prompt caching conflict when compression is **query-aware** (a new prefix every call). Under a realistic two-tier hit rate ρ (hot below ~3500 tokens), **query-agnostic compression** plus a **tier-preserving ratio bound** dominates vanilla, cache-only, and query-aware baselines. Authors' code: none published. We never brand the desk as **CAPC**, **Sonnet**, or **PayPal**.

## What shipped

**Prompt Cache Desk** compares **vanilla**, **cache-only**, and **query-aware** baselines against **cache-aware** compression (compress once, cache_control, clamp ratio so the cached prefix stays in the cheap tier). Dual-impl goldens (≥28) keep scores honest. Marketing landing at `/`, nine desk pages, org/jobs/lifecycle/batch/audit/webhooks, offline `try.html`.

## Lessons worth keeping

1. **Rename the paper brand on day one.** Product display name stays mature; CAPC / Sonnet / PayPal fail honesty and naming tests.
2. **Cost deltas must face dumb baselines.** Cache-aware only reads if vanilla, cache-only, and query-aware sit on the same scenario.
3. **Dual-impl goldens beat narrative.** Two scorers agreeing on 28 fixtures beats a single glowing demo.
4. **Landing is not the desk.** Sell the claim at `/`; put CRUD behind “Open desk.”
5. **Cheat paths teach the fence.** Rejecting `ideal_rho_cheat` documents what the score is *not*.
6. **Static harness + Next UI.** API tests hit `public/*.html`; humans use App Router pages with the same markers.
7. **Tutor guide before finish mail.** Sustain wants README + guide + try artifact — write the guide while the claim is fresh.
8. **Do not ship a rebranded itinerary desk.** POIs / opening hours / day budgets are a different paper; prompt-cache domain must encode prefix size, ratio, tier threshold, ρ, and write vs read.

## Honesty fence (repeat)

Method experiment inspired by the paper. Not a replacement for the authors' system. Not a commercial LLM API gateway. Never brand as CAPC, Sonnet, or PayPal.

## Sources

- Paper: https://arxiv.org/abs/2607.15516v1  
- Authors' code: none published  
