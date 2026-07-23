# Stage Validate Desk

Org desk for **stage-validated inference / port plans**: projects, lifecycle, scenario compare (naive short-bench intuition vs stage-gated + measurements), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.14568.

**Display name:** Stage Validate Desk

**Paper URL:** https://arxiv.org/abs/2607.14568v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/stage-validate-desk-DESIGN.md`

## Unique claim

Stage-validated + measured plans: gate each inference/port stage against a reference tolerance; require tiered long-context / bit-width / kernel measurements before “done.” Scenario compare shows a stage-gated plan versus naive baselines (short-bench only, assume 4-bit faster, assume hand GEMM is the ceiling). Soft simulation — not dual-approver / governance / tactile rebrand. Never brand MiniCPM / Fermi / Tesla C2075 as the product name.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' Fermi CUDA engine or commercial inference stacks. Never brand this desk as MiniCPM, Fermi, or Tesla C2075.

## Forbidden claims

- Shipping or replacing the authors' Fermi CUDA engine
- Claiming real CUDA / GPU timing from this soft simulation
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using MiniCPM / Fermi / Tesla C2075 as the product brand
- Rebranding governance, tactile, prompt-cache, packing, or evidence-synthesis desks as stage-validate domain

## Live features (20 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / port / workload profile catalog  
4. Stage-validate job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive intuition / assume 4-bit / assume hand GEMM vs stage-gated)  
10. Stage gate clarity strip (passed vs blocked cells)  
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
2. Stage-validate jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · StageJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Stage Validate Desk**  
- [x] Never claim authors' Fermi CUDA replacement / MiniCPM product brand  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
- [x] Live app: `npm run build` + `test/app-up.test.ts` (production server serves `/`)  
