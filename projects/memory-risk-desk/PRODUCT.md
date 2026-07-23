# Memory Risk Desk

Org desk for **imputation-free + calibrated-uncertainty plans**: projects, lifecycle, scenario compare (mean/mode imputation / uncalibrated / single-cohort vs imputation-free calibrated), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.11656.

**Display name:** Memory Risk Desk

**Paper URL:** https://arxiv.org/abs/2607.11656v2  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/memory-risk-desk-DESIGN.md`

## Unique claim

Imputation-free + calibrated-uncertainty plans: native missingness handling and calibrated risk bands across heterogeneous cohorts — versus mean/mode imputation then flat classifier; uncalibrated high-confidence scores; single-cohort-only models that ignore site shift. Soft simulation — not dual-approver / heart-rhythm / pathology-vision / quantum-kernel / joint-care / pocket-molecule rebrand. Never brand authors' model names; never claim medical device.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a clinical diagnostic product and **not** a claim to replace the authors' transformer. Soft simulation only. Never brand this desk as a medical device.

## Forbidden claims

- Shipping or replacing the authors' transformer systems
- Claiming real patient diagnoses or clinical decisions from this soft simulation
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using authors' model names (including NITROGEN) as the product brand
- Rebranding heart-rhythm, pathology-vision, quantum-kernel, joint-care, or pocket-molecule desks as this domain

## Live features (20)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / cohort / site profile catalog  
4. Risk job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (mean-impute / uncalibrated / single-cohort vs imputation-free calibrated)  
10. Cohort feature-cell strip (acquired vs missing cells)  
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
2. Risk jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · RiskJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥20 features live  
- [x] ≥8 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Memory Risk Desk**  
- [x] Never claim medical device / authors' transformer product brand  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
- [x] Live app: `npm run build` + `test/app-up.test.ts` (production server serves `/`)  
