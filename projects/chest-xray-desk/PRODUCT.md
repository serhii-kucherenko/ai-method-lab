# Chest Xray Desk

Org desk for **classify → localize → clinically validate plans**: projects, lifecycle, scenario compare (classification-only / localize_no_gate / threshold-alert vs classify→localize→validate), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.09305.

**Display name:** Chest Xray Desk

**Paper URL:** https://arxiv.org/abs/2607.09305v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/chest-xray-desk-DESIGN.md`

## Unique claim

Classify → localize → clinically validate plans: label + region localization pathway with human-in-loop review and clinical validation awareness — versus classification-only; localization without clinical gate; unverified single-threshold alerts. Soft simulation — not dual-approver / heart-scan / heart-rhythm / pathology-vision / memory-risk rebrand. Never brand authors' model names; never claim medical device.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a clinical diagnostic product and **not** a claim to replace the authors' Thailand deep learning system. Soft simulation only. Never brand this desk as a medical device.

## Forbidden claims

- Shipping or replacing the authors' Thailand deep learning system
- Claiming real patient diagnoses or clinical decisions from this soft simulation
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using authors' model names (or radiology product branding) as the product brand
- Rebranding heart-scan, heart-rhythm, pathology-vision, or memory-risk desks as this domain

## Live features (20)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / site / protocol profile catalog  
4. Study job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (classify_only / localize_no_gate / threshold-alert vs classify→localize→validate)  
10. Label+region+validate plan strip (acquired vs ungated cells)  
11. Scenario JSON export  
12. Audit log  
13. CSV audit export  
14. Goldens browser (≥25 dual-impl fixtures)  
15. Honesty / disclaimer page  
16. Webhook inbound + HMAC + idempotency  
17. Org webhook settings (admin rotate)  
18. Pagination + search  
19. Rate-limit feedback (429 + Retry-After)  
20. Offline try page (`try.html`) + in-app guide link  

## Pages (9)

1. Marketing landing (`/` Next + harness `index.html`)  
2. Study jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · StudyJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥20 features live  
- [x] ≥8 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Chest Xray Desk**  
- [x] Never claim medical device / radiology product / authors' Thailand deep learning system product brand  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
- [x] Live app: `npm run build` + `test/app-up.test.ts` (production server serves `/`)  
