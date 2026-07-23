# Rules Preferences Desk

Org desk for **constrained personalization experiments**: projects, lifecycle, scenario compare (naive preference-only baseline vs hard-rule gated preference selection), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.15562.

**Display name:** Rules Preferences Desk

**Paper URL:** https://arxiv.org/abs/2607.15562v1  
**Authors' code:** https://github.com/Official529Tech/rlo-checklist

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/rules-preferences-desk-DESIGN.md`

## Unique claim

Hard feasibility (capacity, banned items, dependencies) must hold; soft preference utilities maximize inside the feasible set. Naive preference-only / soft-capacity greedy can violate hard rules. Scenario compare shows both — not a dual-approver status board.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' packing checklist system. It is **not** a commercial travel packing product. Never brand this desk as FlyEnJoy, RLO, or hard-rules-soft.

## Forbidden claims

- Shipping or replacing the authors' production packing checklist system
- Claiming measured packing-completion gains from this desk
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using FlyEnJoy / RLO / hard-rules-soft / Neuro-* as product brand

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / trip catalog  
4. Checklist job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive preference-only vs hard-rule gated)  
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
2. Checklist jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · ChecklistJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Rules Preferences Desk**  
- [x] Never claim authors' FlyEnJoy / RLO replacement / commercial packing product  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
