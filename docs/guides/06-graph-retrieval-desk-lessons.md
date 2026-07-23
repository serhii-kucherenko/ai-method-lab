# Guide 06 — Graph Retrieval Desk: what we learned

**Product display name:** Graph Retrieval Desk  
**Slug:** `graph-retrieval-desk` (folder + cell ids only)  
**Paper:** 2607.11683 — RAGU: A Multi-Step GraphRAG Engine with a Compact Domain-Adapted LLM  
**Code URL (authors):** https://github.com/RaguTeam/RAGU

## What we built

A multi-page desk for org projects and retrieval jobs with enforced lifecycle, scenario compare (single-hop opaque vs extract→consolidate→retrieve), audit CSV, signed webhooks, goldens browser, and an offline try page.

## What worked

- Mature display name from day one — never brand the desk with the paper project's short name
- Honesty fence on every phase: method experiment, **not** the authors' engine
- Scenario coverage as the unique claim — dual-impl goldens (≥25) before sustain email
- Full ladder through sustain with UI critical paths on all product pages
- Tutor guide before product-complete email

## What to improve next time

1. **Scenario page early.** Naive vs multi-step coverage teaches the paper claim faster than job CRUD alone.
2. **Keep honesty next to the claim.** Digests and UI must say this is not the authors' engine; never use the paper short name as brand.
3. **Webhook HMAC + idempotency** in integrate, not bolted on at sustain.
4. **Offline try** must embed the default three-stage hint (coverage 7 vs 1) without network deps.

## Reuse checklist

- [ ] Display name + slug chosen before fixtures dominate conversation
- [ ] Blueprint lists ≥15 features mapped to ≥6 pages and ≥4 aggregates
- [ ] Honesty fence on honesty page, try.html, and digests
- [ ] No authors'-engine replacement claim in UI or email subjects
- [ ] No paper short-name branding on product surfaces
- [ ] Guide filed under `docs/guides/` before product-complete email
