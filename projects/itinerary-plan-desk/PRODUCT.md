# Itinerary Plan Desk

Org desk for **feasibility-first itinerary experiments**: projects, lifecycle, scenario compare (naive preference-only baseline vs plan/learn/adapt under opening hours, travel, and day budgets), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.15552.

**Display name:** Itinerary Plan Desk

**Paper URL:** https://arxiv.org/abs/2607.15552v1  
**Authors' code:** https://github.com/Official529Tech/pla-itinerary

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/itinerary-plan-desk-DESIGN.md`

## Unique claim

Plan diverse feasible day-schedule candidates under hard windows → learn preference reward over whole schedules → adapt with local edits that stay feasible by construction. Naive preference-only / soft-budget stacking can violate opening hours or day budgets. Scenario compare shows both — not a dual-approver status board, not a packing-domain rebrand.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' on-device itinerary system. It is **not** a commercial trip planner. Never brand this desk as FlyEnJoy, PLA, or product acronyms.

## Forbidden claims

- Shipping or replacing the authors' production on-device itinerary system
- Claiming measured itinerary-quality gains from this desk
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using FlyEnJoy / PLA / Neuro-* as product brand
- Rebranding Rules Preferences Desk packing as itineraries

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / trip catalog  
4. Itinerary job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive preference-only vs plan/learn/adapt)  
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
2. Itinerary jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · ItineraryJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Itinerary Plan Desk**  
- [x] Never claim authors' FlyEnJoy / PLA replacement / commercial trip planner  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
