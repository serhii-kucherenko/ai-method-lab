# Joint Care Desk

Org desk for **dual-evidence musculoskeletal pathway plans**: projects, lifecycle, scenario compare (naive parametric / hospital-only / external-only / stage-blind vs dual-evidence + stage-aware), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.12527.

**Display name:** Joint Care Desk

**Paper URL:** https://arxiv.org/abs/2607.12527v2  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/joint-care-desk-DESIGN.md`

## Unique claim

Dual-evidence pathway plans: in-hospital evidence + external knowledge + missing-evidence acquisition + stage-aware care (admission → peri-op → discharge → rehab) — versus naive single-shot parametric-memory-only answers, stage-blind plans, or hospital-only / external-only baselines that miss the other world. Soft simulation — not dual-approver / evidence-synthesis / governance / stage-validate / wild-locomotion / tactile rebrand. Never brand OrthoPilot / CHEESE / OrthoBench / ORACLE as the product name.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' OrthoPilot system, hospital EHR systems, or commercial clinical AI vendors. Soft simulation only. Never brand this desk as OrthoPilot / CHEESE / OrthoBench / ORACLE.

## Forbidden claims

- Shipping or replacing the authors' OrthoPilot / CHEESE systems
- Claiming real clinical decisions or EHR access from this soft simulation
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using OrthoPilot / CHEESE / OrthoBench / ORACLE as the product brand
- Rebranding governance, tactile, stage-validate, wild-locomotion, or evidence-synthesis desks as joint-care domain

## Live features (20 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / indication / pathway profile catalog  
4. Pathway job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive parametric / hospital-only / external-only vs dual-evidence)  
10. Missing-evidence acquisition strip (acquired vs missing cells)  
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

## Pages (9 ≥6)

1. Marketing landing (`/` Next + `/` / `index.html` harness)  
2. Pathway jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · PathwayJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Joint Care Desk**  
- [x] Never claim authors' OrthoPilot replacement / product brand  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
- [x] Live app: `npm run build` + `test/app-up.test.ts` (production server serves `/`)  
