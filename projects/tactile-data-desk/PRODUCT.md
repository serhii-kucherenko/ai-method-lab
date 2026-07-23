# Tactile Data Desk

Org desk for **touch-first chart exploration experiments**: projects, lifecycle, scenario compare (speech-only / select-skip-confirm / agent-no-verify vs grounded select→confirm→ask→verify), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.14588.

**Display name:** Tactile Data Desk

**Paper URL:** https://arxiv.org/abs/2607.14588v1  
**Authors' code:** https://github.com/accessible-data-vis/feelogue

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/tactile-data-desk-DESIGN.md`

## Unique claim

Touch-first + verify: layered tactile chart presentation; select → confirm → ask agent → verify on chart. Agent reserved for calculation/analysis touch cannot resolve — vs speech-only answers that skip tactile selection grounding or verification. Scenario compare shows grounded vs speech-only baselines — not a dual-approver status board, not a meta-analysis / prompt-cache rebrand.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' Feelogue system. It is **not** a commercial tactile accessibility product. Never brand this desk as Feelogue, CTDI, or Dot Pad.

## Forbidden claims

- Shipping or replacing the authors' production system
- Claiming hardware RTD / Dot Pad certification from this desk
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using Feelogue / CTDI / Dot Pad as product brand
- Rebranding prompt-cache, packing, itinerary, or evidence-synthesis desks as tactile domain

## Live features (20 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / chart topic catalog  
4. Tactile explore job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (speech-only / select-skip-confirm / agent-no-verify vs grounded)  
10. Soft RTD layer strip (confirmable vs ambiguous)  
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
2. Tactile explore jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · TactileJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Tactile Data Desk**  
- [x] Never claim authors' Feelogue / commercial tactile product replacement  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
- [x] Live app: `npm run build` + `test/app-up.test.ts` (production server serves `/`)  
