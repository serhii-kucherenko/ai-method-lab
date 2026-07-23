# Agent Safety Desk

Org desk for **structural monitoring experiments**: projects, lifecycle, scenario compare (checklist baseline vs structural monitor), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.14570.

**Display name:** Agent Safety Desk

**Paper URL:** https://arxiv.org/abs/2607.14570v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/agent-safety-desk-DESIGN.md`

## Unique claim

Structural safety scoring favors aligned invariant node tags and regression-signal features (invariant explanation, edge, node-class, tool-boundary, privilege). Checklist baseline stays a flat score. Lifecycle, batch, and audit keep the desk honest under concurrent edits.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' safety monitor system. It is **not** a live agent safety vendor product. Never brand this desk as IFG.

## Forbidden claims

- Shipping or replacing the authors' production safety monitor system
- Claiming measured deployment safety outcomes from this desk
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using the paper short name (IFG) as product brand

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project catalog  
4. Safety job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive checklist vs structural monitor)  
10. Audit log  
11. CSV audit export  
12. Goldens browser (≥25 tutor-fit fixtures)  
13. Honesty / disclaimer page  
14. Webhook inbound + HMAC + idempotency  
15. Org webhook settings (admin rotate)  
16. Pagination + search  
17. Rate-limit feedback (429 + Retry-After)  
18. Offline try page (`try.html`) + in-app safety guide link  

## Pages (9 ≥6)

1. Marketing landing (`/` Next + `/` / `index.html` harness)  
2. Safety jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · SafetyJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Safety guide under `docs/guides/`  
- [x] Digests use **Agent Safety Desk**  
- [x] Never claim authors' platform replacement / commercial agent safety product  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
