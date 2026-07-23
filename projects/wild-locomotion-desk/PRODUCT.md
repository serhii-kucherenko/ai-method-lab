# Wild Locomotion Desk

Org desk for **multi-skill perceptive locomotion plans**: projects, lifecycle, scenario compare (naive single-skill flat policy vs multi-skill + perception + transitions), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.13579.

**Display name:** Wild Locomotion Desk

**Paper URL:** https://arxiv.org/abs/2607.13579v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/wild-locomotion-desk-DESIGN.md`

## Unique claim

Multi-skill perceptive locomotion: skill library + autonomous transitions for mixed obstacles (stairs, hurdles, gaps, stones) using onboard-perception-style inputs — versus a single-skill / flat-terrain-only naive policy that fails or high-risks on structured obstacles. Soft simulation — not dual-approver / stage-validate / governance rebrand. Never brand APT-RL as the product name.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' quadruped controller or commercial robot stacks. Soft simulation only. Never brand this desk as APT-RL.

## Forbidden claims

- Shipping or replacing the authors' quadruped controller / APT-RL system
- Claiming real robot hardware timing from this soft simulation
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using APT-RL as the product brand
- Rebranding governance, tactile, stage-validate, or evidence-synthesis desks as locomotion domain

## Live features (20 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / terrain / route profile catalog  
4. Locomotion job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive flat / perception-blind / no-transitions vs multi-skill)  
10. Obstacle clearance strip (cleared vs blocked segments)  
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
2. Locomotion jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · LocoJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Wild Locomotion Desk**  
- [x] Never claim authors' controller replacement / APT-RL product brand  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
- [x] Live app: `npm run build` + `test/app-up.test.ts` (production server serves `/`)  
