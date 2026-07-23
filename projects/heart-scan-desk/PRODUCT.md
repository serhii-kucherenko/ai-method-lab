# Heart Scan Desk

Org desk for **unified segmentation + phenotyping plans**: projects, lifecycle, scenario compare (segmentation-only / pheno_pixels / single-center vs unified segmentation+phenotyping), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.11287.

**Display name:** Heart Scan Desk

**Paper URL:** https://arxiv.org/abs/2607.11287v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/heart-scan-desk-DESIGN.md`

## Unique claim

Unified segmentation + phenotyping plans: joint structure+phenotype pathway with human-in-loop review and multicenter-aware validation — versus segmentation-only; phenotype-from-raw-pixels-only; single-center unchecked. Soft simulation — not dual-approver / heart-rhythm / pathology-vision / quantum-kernel / joint-care / pocket-molecule / memory-risk rebrand. Never brand authors' model names; never claim medical device.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a clinical diagnostic product and **not** a claim to replace the authors' foundation model. Soft simulation only. Never brand this desk as a medical device.

## Forbidden claims

- Shipping or replacing the authors' foundation model systems
- Claiming real patient diagnoses or clinical decisions from this soft simulation
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using authors' model names (or clinical diagnostic branding) as the product brand
- Rebranding heart-rhythm, pathology-vision, quantum-kernel, joint-care, or pocket-molecule desks as this domain

## Live features (20)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / center / site profile catalog  
4. Scan job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (seg-only / pheno_pixels / single-center vs unified segmentation+phenotyping)  
10. Structure+phenotype pathway strip (acquired vs unchecked cells)  
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
2. Scan jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · ScanJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥20 features live  
- [x] ≥8 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Heart Scan Desk**  
- [x] Never claim medical device / authors' foundation model product brand  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
- [x] Live app: `npm run build` + `test/app-up.test.ts` (production server serves `/`)  
