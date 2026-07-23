# Security Control Desk

Org desk for **safer agentic control experiments**: projects, lifecycle, scenario compare (naive open-loop baseline vs counterfactual physics injection), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.09076.

**Display name:** Security Control Desk

**Paper URL:** https://arxiv.org/abs/2607.09076v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/security-control-desk-DESIGN.md`

## Unique claim

Safer agentic control simulates LLM-proposed interventions in forecast space (counterfactual physics injection) and rejects hallucinated or ineffective actions before actuation. Naive open-loop baseline blind-executes the first candidate with no feasibility or counterfactual gate. Lifecycle, batch, and audit keep the desk honest under concurrent edits.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' neuro-agentic control system. It is **not** a commercial industrial control product. Never brand this desk as Neuro-Agentic Control.

## Forbidden claims

- Shipping or replacing the authors' production neuro-agentic control system
- Claiming measured plant breach-prevention from this desk
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using Neuro-Agentic Control as product brand

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project catalog  
4. Control job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive open-loop vs safer agentic CF)  
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
2. Control jobs (`/jobs`) — desk entry  
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
- [x] Digests use **Security Control Desk**  
- [x] Never claim authors' neuro-agentic replacement / commercial control product  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
