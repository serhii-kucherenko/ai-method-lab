# Truth Game Desk

Org desk for **game-theoretic multi-agent truth plans**: projects, lifecycle, scenario compare (single-agent / majority_vote / confidence-only vs game-theoretic), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.08403.

**Display name:** Truth Game Desk

**Paper URL:** https://arxiv.org/abs/2607.08403v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/truth-game-desk-DESIGN.md`

## Unique claim

Game-theoretic multi-agent truth plans: structured challenge and payoff among agents to dampen hallucination — versus single-agent unchecked answers; flat majority vote without game structure; confidence-only filters. Soft simulation — not dual-approver / agent-safety / enterprise-agent / consult-bench / secure-tutor rebrand. Never brand authors' framework names; never claim hallucination-elimination product.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a hallucination-elimination product and **not** a replacement for the authors' game-theory multi-agent framework. Soft simulation only. Never brand this desk as G-Frame or a production hallucination cure.

## Forbidden claims

- Shipping or replacing the authors' game-theory multi-agent framework
- Claiming production hallucination elimination from this soft simulation
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using authors' framework names (or G-Frame) as the product brand
- Rebranding agent-safety, enterprise-agent, consult-bench, or secure-tutor desks as this domain

## Live features (20)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / arena / claim-set profile catalog  
4. Truth job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (single_agent / majority_vote / confidence-only vs game-theoretic)  
10. Challenge+payoff+agents plan strip (challenged vs majority-vote cells)  
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

## Pages (9)

1. Marketing landing (`/` Next + harness `index.html`)  
2. Truth jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · TruthJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥20 features live  
- [x] ≥8 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Truth Game Desk**  
- [x] Never claim hallucination-elimination product / authors' framework product brand  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
- [x] Live app: `npm run build` + `test/app-up.test.ts` (production server serves `/`)  
