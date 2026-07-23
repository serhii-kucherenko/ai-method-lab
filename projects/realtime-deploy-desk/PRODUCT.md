# Realtime Deploy Desk

Org desk for **harness-guided deployment optimization experiments**: projects, lifecycle, scenario compare (manual-tuning baseline vs harness-guided), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.18171.

**Display name:** Realtime Deploy Desk

**Paper URL:** https://arxiv.org/abs/2607.18171v1  
**Authors' code:** none published with this paper

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/realtime-deploy-desk-DESIGN.md`

## Unique claim

Harness-guided deploy scoring favors aligned harness passes and config feature tags (IR lift, static analysis, measure gates, placement). Manual-tuning baseline stays a flat score. Lifecycle, batch, and audit keep the desk honest under concurrent edits.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' harness. It is **not** a production serving stack. Never brand this desk with the paper project's short name (FlashRT).

## Forbidden claims

- Shipping or replacing the authors' production harness
- Claiming measured production serving outcomes from this desk
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using the paper short name as product brand

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project catalog  
4. Deploy job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive manual-tuning vs harness-guided)  
10. Audit log  
11. CSV audit export  
12. Goldens browser (≥25 deploy-fit fixtures)  
13. Honesty / disclaimer page  
14. Webhook inbound + HMAC + idempotency  
15. Org webhook settings (admin rotate)  
16. Pagination + search  
17. Rate-limit feedback (429 + Retry-After)  
18. Offline try page (`try.html`) + in-app tutor guide link  

## Pages (9 ≥6)

1. Marketing landing (`/` Next + `/` / `index.html` harness)  
2. Deploy jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · DeployJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Realtime Deploy Desk**  
- [x] Never claim authors' harness replacement / production serving stack  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
