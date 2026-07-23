# Pathology Vision Desk

Org desk for **multi-expert pathology scoring experiments**: projects, lifecycle, scenario compare (single-view baseline vs multi-expert), audit, webhooks, and goldens — sourced from paper 2607.09526.

**Display name:** Pathology Vision Desk

**Paper URL:** https://arxiv.org/abs/2607.09526v1  
**Authors' code:** https://github.com/WonderLandxD/ALICE

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/pathology-vision-desk-DESIGN.md`

## Unique claim

Multi-expert scoring favors aligned vision, vision-language, and slide-level expert tags when those tags match sample features. Single-view baseline stays a flat score. Lifecycle, batch, and audit keep the desk honest under concurrent edits.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' foundation model at the paper's code URL. It is **not** a clinical diagnostic tool. Never brand this desk with the paper project's short name (ALICE).

## Forbidden claims

- Shipping or replacing the authors' production model
- Claiming measured clinical diagnostic outcomes from this desk
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using the paper short name as product brand

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project catalog  
4. Vision job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive single-view vs multi-expert)  
10. Audit log  
11. CSV audit export  
12. Goldens browser (≥25 pathology-fit fixtures)  
13. Honesty / disclaimer page  
14. Webhook inbound + HMAC + idempotency  
15. Org webhook settings (admin rotate)  
16. Pagination + search  
17. Rate-limit feedback (429 + Retry-After)  
18. Offline try page (`try.html`) + in-app tutor guide link  

## Pages (9 ≥6)

1. Home (`/` Next + `/index.html` harness)  
2. Vision jobs (`/jobs`)  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · VisionJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Pathology Vision Desk**  
- [x] Never claim authors' model replacement / clinical diagnostic tool  
- [x] Next.js + Tailwind + shadcn + DESIGN note  
