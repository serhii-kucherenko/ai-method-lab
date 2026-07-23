# Guide 08 — Virulence Feature Desk: what we learned

**Product display name:** Virulence Feature Desk  
**Slug:** `virulence-feature-desk` (folder + cell ids only)  
**Paper:** 10.1186/s40168-026-02467-w — SEVA: structural and evolutionary feature integration for predicting virulence factors and antibiotic resistance genes  
**Paper URL:** https://doi.org/10.1186/s40168-026-02467-w  
**Code URL (authors):** https://github.com/kaiqili2/SEVA

## What we built

A multi-page desk for org projects and feature jobs with enforced lifecycle, scenario compare (sequence-only vs structural+evolutionary), audit CSV, signed webhooks, goldens browser, and an offline try page.

## What worked

- Mature display name from day one — never brand the desk with the paper project's short name
- Honesty fence on every phase: method experiment, **not** the authors' tool, **not** a clinical diagnostic
- Virulence-fit scoring as the unique claim — dual-impl goldens (≥25) before sustain
- Full ladder through sustain with UI critical paths on all product pages
- Tutor guide before product-complete email

## What to improve next time

1. **Scenario page early.** Naive vs integrated risk teaches the paper claim faster than job CRUD alone.
2. **Keep honesty next to the claim.** Digests and UI must say this is not the authors' tool and not a clinical diagnostic; never use the paper short name as brand.
3. **Webhook HMAC + idempotency** in integrate, not bolted on at sustain.
4. **Offline try** must embed a clear structural/evolutionary tag overlap (risk 9 vs 1) without network deps.

## Reuse checklist

- [ ] Display name + slug chosen before fixtures dominate conversation
- [ ] Blueprint lists ≥15 features mapped to ≥6 pages and ≥4 aggregates
- [ ] Honesty fence on honesty page, try.html, and digests
- [ ] No authors'-tool replacement claim in UI or email subjects
- [ ] No clinical diagnostic claim
- [ ] No paper short-name branding on product surfaces
- [ ] Guide filed under `docs/guides/` before product-complete email
