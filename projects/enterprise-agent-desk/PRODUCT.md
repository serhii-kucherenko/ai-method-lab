# Enterprise Agent Desk

Org desk for **multi-agent ERP coordination experiments**: projects, lifecycle, scenario compare (single-agent baseline vs multi-agent coordinator), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.17331.

**Display name:** Enterprise Agent Desk

**Paper URL:** https://arxiv.org/abs/2607.17331v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/enterprise-agent-desk-DESIGN.md`

## Unique claim

Multi-agent plan scoring favors aligned role tags and workflow-function features (coordinator, sales, inventory, purchasing, finance). Single-agent baseline stays a flat score. Lifecycle, batch, and audit keep the desk honest under concurrent edits.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' Agentic ERP system. It is **not** a live ERP automation product. Never brand this desk as Agentic ERP.

## Forbidden claims

- Shipping or replacing the authors' production Agentic ERP system
- Claiming measured operational or financial outcomes from this desk
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using the paper short name (Agentic ERP) as product brand

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project catalog  
4. Plan job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (single-agent vs multi-agent coordinator)  
10. Audit log  
11. CSV audit export  
12. Goldens browser (≥25 tutor-fit fixtures)  
13. Honesty / disclaimer page  
14. Webhook inbound + HMAC + idempotency  
15. Org webhook settings (admin rotate)  
16. Pagination + search  
17. Rate-limit feedback (429 + Retry-After)  
18. Offline try page (`try.html`) + in-app guide link  

## Pages (9 ≥6)

1. Marketing landing (`/` Next + `/` / `index.html` harness)  
2. Plan jobs (`/jobs`) — desk entry  
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
- [x] Digests use **Enterprise Agent Desk**  
- [x] Never claim authors' platform replacement / commercial ERP automation product  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
