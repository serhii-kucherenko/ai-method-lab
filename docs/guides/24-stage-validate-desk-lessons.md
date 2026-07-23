# Stage Validate Desk — lessons

What this method-lab climb taught, in plain language.

## Claim

Paper [2607.14568](https://arxiv.org/abs/2607.14568v1) studies multimodal assistants on constrained GPUs and stage-validated ports where measurement overturns intuition. We never brand the desk as **MiniCPM**, **Fermi**, or **Tesla C2075**. The product claim is **stage-gated + measured plans**: gate each stage against a reference tolerance; require tiered long-context / bit-width / kernel measurements before “done” — versus **naive short-bench intuition** (assume 4-bit faster, hand GEMM is the ceiling, 2k represents 10k). Authors' code: none published.

## What shipped

**Stage Validate Desk** compares stage-gated plans against naive intuition baselines. Dual-impl goldens (≥30) keep scores honest. Marketing landing at `/`, nine desk pages, org/jobs/lifecycle/batch/audit/webhooks, offline `try.html`. Soft simulation — no real CUDA.

## Lessons worth keeping

1. **Rename the paper brand on day one.** Product display name stays mature; MiniCPM / Fermi / Tesla C2075 fail honesty and naming tests if used as brand.
2. **Deltas must face dumb baselines.** Stage gates only read if short-bench / assume-4-bit / hand-GEMM sit on the same scenario.
3. **Dual-impl goldens beat narrative.** Two scorers agreeing on 30 fixtures beats a single glowing CUDA demo.
4. **Landing is not the desk.** Sell the claim at `/`; put CRUD behind “Open desk.”
5. **Cheat paths teach the fence.** Rejecting `skip_verify_cheat` / skip-gates documents what the score is *not*.
6. **Static harness + Next UI.** API tests hit `public/*.html`; humans use App Router pages with the same markers.
7. **Tutor guide before finish mail.** Sustain wants README + guide + try artifact — write the guide while the claim is fresh.
8. **Do not ship a rebranded governance or tactile desk.** Preference axes and soft-layer charts are different papers; stage-validate domain must encode stage gates and measurement baselines.

## Honesty fence (repeat)

Method experiment inspired by the paper. Not a replacement for the authors' Fermi CUDA engine or commercial inference stacks. Soft simulation only. Never brand MiniCPM, Fermi, or Tesla C2075 as the product name.

## Sources

- Paper: https://arxiv.org/abs/2607.14568v1  
- Authors' code: none published  
