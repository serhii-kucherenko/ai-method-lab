# Guide 07 — Drug Discovery Desk: what we learned

**Product display name:** Drug Discovery Desk  
**Slug:** `drug-discovery-desk` (folder + cell ids only)  
**Paper:** 2607.08404 — DrugGen 2: A disease-aware language model for enhancing drug discovery  
**Code URL (authors):** https://github.com/alimotahharynia/DrugGen-2

## What we built

A multi-page desk for org projects and discovery jobs with enforced lifecycle, scenario compare (unconditioned generation vs disease-conditioned), audit CSV, signed webhooks, goldens browser, and an offline try page.

## What worked

- Mature display name from day one — never brand the desk with the paper project's short name
- Honesty fence on every phase: method experiment, **not** the authors' model, **not** wet-lab or regulatory
- Disease-fit scoring as the unique claim — dual-impl goldens (≥25) before sustain
- Full ladder through sustain with UI critical paths on all product pages
- Tutor guide before product-complete email

## What to improve next time

1. **Scenario page early.** Naive vs disease-aware fit teaches the paper claim faster than job CRUD alone.
2. **Keep honesty next to the claim.** Digests and UI must say this is not the authors' model and not a wet-lab/regulatory product; never use the paper short name as brand.
3. **Webhook HMAC + idempotency** in integrate, not bolted on at sustain.
4. **Offline try** must embed a clear indication/candidate tag overlap (fit 9 vs 1) without network deps.

## Reuse checklist

- [ ] Display name + slug chosen before fixtures dominate conversation
- [ ] Blueprint lists ≥15 features mapped to ≥6 pages and ≥4 aggregates
- [ ] Honesty fence on honesty page, try.html, and digests
- [ ] No authors'-model replacement claim in UI or email subjects
- [ ] No wet-lab / regulatory product claim
- [ ] No paper short-name branding on product surfaces
- [ ] Guide filed under `docs/guides/` before product-complete email
