# Drug Discovery Desk

Org desk for **disease-conditioned molecule suggestion experiments**: projects, lifecycle, scenario compare (unconditioned generation vs disease-aware), audit, webhooks, and goldens — sourced from paper 2607.08404.

**Display name:** Drug Discovery Desk

## Unique claim

Disease-conditioned scoring favors candidates whose indication tags align with the disease context. Unconditioned generation scores a flat baseline. Lifecycle, batch, and audit keep the desk honest under concurrent edits.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' disease-aware language model at the paper's code URL (`github.com/alimotahharynia/DrugGen-2`). It is **not** a wet-lab or regulatory product. Never brand this desk with the paper project's short name.

## Forbidden claims

- Shipping or replacing the authors' production model
- Claiming measured wet-lab or regulatory outcomes from this desk
- Dual-approver status boards as “domain”
- Hiding the honesty fence on UI or digests
- Using the paper short name as product brand

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project catalog  
4. Discovery job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive unconditioned vs disease-aware)  
10. Audit log  
11. CSV audit export  
12. Goldens browser (≥25 disease-fit fixtures)  
13. Honesty / disclaimer page  
14. Webhook inbound + HMAC + idempotency  
15. Org webhook settings (admin rotate)  
16. Pagination + search  
17. Rate-limit feedback (429 + Retry-After)  
18. Offline try page (`try.html`) + in-app tutor guide link  

## Pages (9 ≥6)

1. Home (`/index.html`)  
2. Discovery jobs (`/jobs.html`)  
3. Lifecycle (`/lifecycle.html`)  
4. Scenario compare (`/scenario.html`)  
5. Batch transitions (`/batch.html`)  
6. Audit (`/audit.html`)  
7. Goldens browser (`/goldens.html`)  
8. Honesty (`/honesty.html`)  
9. Org settings (`/settings.html`)  

## Aggregates (≥4)

Organization · Project · DiscoveryJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Drug Discovery Desk**  
- [x] Never claim authors' model replacement / wet-lab / regulatory  
