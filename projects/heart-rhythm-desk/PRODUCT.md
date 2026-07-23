# Heart Rhythm Desk

Org desk for **long-tail-aware rhythm scoring experiments**: projects, lifecycle, scenario compare (majority baseline vs long-tail-aware), audit, webhooks, and goldens — sourced from paper 2607.14613.

**Display name:** Heart Rhythm Desk

**Paper URL:** https://arxiv.org/abs/2607.14613v1  
**Authors' code:** https://github.com/Open-EXG/AG-SCL-for-Long-Tailed-ECG

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/heart-rhythm-desk-DESIGN.md`

## Unique claim

Long-tail-aware scoring favors rare rhythm classes when those tags align with sample features. Majority baseline stays a flat score. Lifecycle, batch, and audit keep the desk honest under concurrent edits.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' model at the paper's code URL. It is **not** a clinical ECG reader. Never brand this desk with the paper project's short name (AG-SCL).

## Forbidden claims

- Shipping or replacing the authors' production model
- Claiming measured clinical ECG diagnostic outcomes from this desk
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using the paper short name as product brand

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project catalog  
4. Rhythm job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive majority vs long-tail-aware)  
10. Audit log  
11. CSV audit export  
12. Goldens browser (≥25 rhythm-fit fixtures)  
13. Honesty / disclaimer page  
14. Webhook inbound + HMAC + idempotency  
15. Org webhook settings (admin rotate)  
16. Pagination + search  
17. Rate-limit feedback (429 + Retry-After)  
18. Offline try page (`try.html`) + in-app tutor guide link  

## Pages (9 ≥6)

1. Home (`/` Next + `/index.html` harness)  
2. Rhythm jobs (`/jobs`)  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · RhythmJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Heart Rhythm Desk**  
- [x] Never claim authors' model replacement / clinical ECG reader  
- [x] Next.js + Tailwind + shadcn + DESIGN note  
