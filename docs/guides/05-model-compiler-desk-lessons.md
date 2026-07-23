# Guide 05 — Model Compiler Desk: what we learned

**Product display name:** Model Compiler Desk  
**Slug:** `model-compiler-desk` (folder + cell ids only)  
**Paper:** 2607.15865 — An MLIR-Based Compilation Method for Large Language Models  
**Code URL (authors):** https://github.com/sophgo/tpu-mlir

## What we built

A multi-page desk for org projects and compile jobs with enforced lifecycle, scenario compare (opaque monolith vs MLIR layered pass sketch), audit CSV, signed webhooks, goldens browser, and an offline try page.

## What worked

- Mature display name from day one (Correction 6)
- Honesty fence on every phase: method experiment, **not** the authors' compiler
- Scenario modularity as the unique claim — dual-impl goldens (≥25) before sustain email
- Full ladder through sustain with UI critical paths on all product pages
- Tutor guide before product-complete email

## What to improve next time

1. **Scenario page early.** Naive vs layered modularity teaches the paper claim faster than job CRUD alone.
2. **Keep honesty next to the claim.** Digests and UI must say this is not `tpu-mlir`.
3. **Webhook HMAC + idempotency** in integrate, not bolted on at sustain.
4. **Offline try** must embed the default three-pass hint (modularity 6 vs 1) without network deps.

## Reuse checklist

- [ ] Display name + slug chosen before fixtures dominate conversation
- [ ] Blueprint lists ≥15 features mapped to ≥6 pages and ≥4 aggregates
- [ ] Honesty fence on honesty page, try.html, and digests
- [ ] No authors'-compiler replacement claim in UI or email subjects
- [ ] Guide filed under `docs/guides/` before product-complete email
