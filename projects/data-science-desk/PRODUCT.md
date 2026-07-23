# Data Science Desk

Org desk for **world-model guided agent efficiency experiments**: projects, lifecycle, scenario compare (naive step-burn baseline vs world-model guided routing), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.15901.

**Display name:** Data Science Desk

**Paper URL:** https://arxiv.org/abs/2607.15901v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/data-science-desk-DESIGN.md`

## Unique claim

World-model guided routing simulates expensive ops (train, evaluate, search, feature_eng, hyper_tune) and executes lightweight ones (preview, inspect, filter). Naive step-burn baseline charges full execution for every planned step. Lifecycle, batch, and audit keep the desk honest under concurrent edits.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' world-model system. It is **not** a commercial data-science agent platform. Never brand this desk as DSWorld.

## Forbidden claims

- Shipping or replacing the authors' production world-model system
- Claiming measured production agent speedups from this desk
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using authors' tool names or DSWorld as product brand

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project catalog  
4. Agent job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive step-burn vs world-model guided)  
10. Audit log  
11. CSV audit export  
12. Goldens browser (≥25 dual-impl fixtures)  
13. Honesty / disclaimer page  
14. Webhook inbound + HMAC + idempotency  
15. Org webhook settings (admin rotate)  
16. Pagination + search  
17. Rate-limit feedback (429 + Retry-After)  
18. Offline try page (`try.html`) + in-app guide link  

## Pages (9 ≥6)

1. Marketing landing (`/` Next + `/` / `index.html` harness)  
2. Agent jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · PlanJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Data Science Desk**  
- [x] Never claim authors' world-model replacement / commercial agent platform  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
