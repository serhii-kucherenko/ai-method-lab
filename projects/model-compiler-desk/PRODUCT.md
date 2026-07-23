# Model Compiler Desk

Org desk for **MLIR-inspired compile-job experiments** on LLM models: projects, lifecycle, scenario compare (opaque monolith vs layered passes), audit, webhooks, and goldens — sourced from paper 2607.15865.

**Display name:** Model Compiler Desk

## Unique claim

Layered MLIR-style pass hints score higher modularity than treating the model as one opaque compile unit. Lifecycle, batch, and audit keep the desk honest under concurrent edits.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' MLIR compiler at the paper's code URL (`github.com/sophgo/tpu-mlir`).

## Forbidden claims

- Shipping or replacing the authors' production compiler
- Claiming measured TPU/LLM speedups from this desk
- Dual-approver status boards as “domain”
- Hiding the honesty fence on UI or digests

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project catalog  
4. Compile job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive vs MLIR layered)  
10. Audit log  
11. CSV audit export  
12. Goldens browser (≥25 modularity fixtures)  
13. Honesty / disclaimer page  
14. Webhook inbound + HMAC + idempotency  
15. Org webhook settings (admin rotate)  
16. Pagination + search  
17. Rate-limit feedback (429 + Retry-After)  
18. Offline try page (`try.html`) + in-app tutor guide link  

## Pages (9 ≥6)

1. Home (`/index.html`)  
2. Compile jobs (`/jobs.html`)  
3. Lifecycle (`/lifecycle.html`)  
4. Scenario compare (`/scenario.html`)  
5. Batch transitions (`/batch.html`)  
6. Audit (`/audit.html`)  
7. Goldens browser (`/goldens.html`)  
8. Honesty (`/honesty.html`)  
9. Org settings (`/settings.html`)  

## Aggregates (≥4)

Organization · Project · CompileJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Model Compiler Desk**  
- [x] Never claim authors' compiler replacement  
