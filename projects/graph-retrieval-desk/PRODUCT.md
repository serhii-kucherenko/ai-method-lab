# Graph Retrieval Desk

Org desk for **multi-step graph retrieval experiments**: projects, lifecycle, scenario compare (single-hop opaque vs extract→consolidate→retrieve), audit, webhooks, and goldens — sourced from paper 2607.11683.

**Display name:** Graph Retrieval Desk

## Unique claim

Separating extraction from consolidation (multi-step path) scores higher coverage than a single opaque retrieve hop. Lifecycle, batch, and audit keep the desk honest under concurrent edits.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' multi-step graph retrieval engine at the paper's code URL (`github.com/RaguTeam/RAGU`). Never brand this desk with the paper project's short name.

## Forbidden claims

- Shipping or replacing the authors' production engine
- Claiming measured GraphRAG accuracy from this desk
- Dual-approver status boards as “domain”
- Hiding the honesty fence on UI or digests
- Using the paper short name as product brand

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project catalog  
4. Retrieval job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive single-hop vs multi-step)  
10. Audit log  
11. CSV audit export  
12. Goldens browser (≥25 coverage fixtures)  
13. Honesty / disclaimer page  
14. Webhook inbound + HMAC + idempotency  
15. Org webhook settings (admin rotate)  
16. Pagination + search  
17. Rate-limit feedback (429 + Retry-After)  
18. Offline try page (`try.html`) + in-app tutor guide link  

## Pages (9 ≥6)

1. Home (`/index.html`)  
2. Retrieval jobs (`/jobs.html`)  
3. Lifecycle (`/lifecycle.html`)  
4. Scenario compare (`/scenario.html`)  
5. Batch transitions (`/batch.html`)  
6. Audit (`/audit.html`)  
7. Goldens browser (`/goldens.html`)  
8. Honesty (`/honesty.html`)  
9. Org settings (`/settings.html`)  

## Aggregates (≥4)

Organization · Project · RetrievalJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Graph Retrieval Desk**  
- [x] Never claim authors' engine replacement  
