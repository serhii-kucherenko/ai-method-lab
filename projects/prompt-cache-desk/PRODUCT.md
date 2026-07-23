# Prompt Cache Desk

Org desk for **cache-aware prompt compression experiments**: projects, lifecycle, scenario compare (vanilla / cache-only / query-aware baselines vs query-agnostic compression with a tier-preserving ratio bound under a two-tier hit-rate cost model), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.15516.

**Display name:** Prompt Cache Desk

**Paper URL:** https://arxiv.org/abs/2607.15516v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/prompt-cache-desk-DESIGN.md`

## Unique claim

Query-agnostic compressed prefixes + explicit cache control + tier-preserving ratio bound (avoid over-compressing into the expensive/hot cache tier). Naive baselines: (1) vanilla full prompt every call, (2) cache-only without compression, (3) query-aware compression that breaks the prefix cache every query. Scenario compare shows all four under ρ(N, |P|) — not a dual-approver status board, not a packing/itinerary rebrand.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' system. It is **not** a commercial LLM API gateway. Never brand this desk as CAPC, Sonnet, or PayPal.

## Forbidden claims

- Shipping or replacing the authors' production caching system
- Claiming measured API-spend savings from this desk
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using CAPC / Sonnet / PayPal as product brand
- Rebranding itinerary or packing desks as prompt-cache domain

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / workload catalog  
4. Cache job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (vanilla / cache-only / query-aware vs cache-aware)  
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
2. Cache jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · CacheJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Prompt Cache Desk**  
- [x] Never claim authors' CAPC / Sonnet / PayPal / commercial gateway replacement  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
