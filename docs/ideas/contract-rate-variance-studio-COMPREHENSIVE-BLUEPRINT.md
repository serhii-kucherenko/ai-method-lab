# Blueprint — Contract Rate Variance Studio

## Pages (≥11)
| Route | Purpose |
|-------|---------|
| `/` | Marketing — sell $ rate variance before payment |
| `/pricing` | AP seats + variance-run usage tiers |
| `/demo` | Import catalog → invoice → variance → dispute pack |
| `/onboarding` | First-run checklist |
| `/flows` | ≥5 journeys (import, match, dispute pack, compare, export) |
| `/catalog` | Contract rate catalog / SKUs |
| `/invoices` | Invoice batches + lines |
| `/variances` | Rate variance findings in $ |
| `/disputes` | Dispute cases + recommended actions |
| `/imports` | Catalog / invoice import batches |
| `/compare` | A catalog-matched vs B invoice-as-billed |
| `/scoreboard` | Vendor / variance leaderboard |
| `/settings` | Org, members, webhooks, export |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens`

## Dual score
| Impl | Meaning |
|------|---------|
| **A** | Catalog-matched: contracted unit rate ↔ invoice line → variance $ |
| **B** | Invoice-as-billed: ignore catalog; accept invoice totals narrative only |

## Feature matrix (≥25)
1–5 Landing, pricing, demo, onboarding, flows  
6–10 Catalog CRUD, SKU lock window, search, vendor tag, archive  
11–15 Invoice import, match, variance list, dispute case, compare A/B  
16–20 Scoreboard, honesty, org settings, members, bearer auth  
21–25 Rate-limit feedback, webhook HMAC, export JSON/CSV, features API, goldens API  
26–28 Audit trail, try.html, in-app guide  

## Aggregates
Vendor, ContractCatalog, CatalogSku, InvoiceBatch, InvoiceLine, RateVariance, DisputeCase, CompareResult (+ Org/Members/Audits)
