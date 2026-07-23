# Filing Penalty Desk

Month-by-month **failure-to-file** and **failure-to-pay** addition forecast for late returns — same-month file reduction, levy-intent pay bump, aggregate caps, and minimum lesser-of floor.

**Display name:** Filing Penalty Desk (never brand as a statute code in UI or digests).

## Unique claim

Literal-dollar month-walk: when both additions accrue in the same month, failure-to-file is reduced by that month’s failure-to-pay slice (not stacked full). Optional levy bump raises the pay rate after an index month. Caps and indexed minimum floor bind where the paper goldens say so.

## Kill A (required)

IRS notices and commercial tax software already assess these additions. This product is a **cash-forecast / method honesty** desk for controllers and tax leads — **not** an IRS assessment, abatement, or CPA replacement.

## Forbidden claims

- Replaces IRS assessment, abatement, or CPA advice
- Flat late-fee percent as the happy path
- Dual-approver status boards as “domain”
- Collapsing FTF + FTP into one unlabeled “penalty” without breakdown
- Silent interest-as-penalty or installment 0.25% swap
- Public product brand as a statute code

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / analyst / auditor)  
3. Return / timeline catalog  
4. Timeline detail editor  
5. Statutory addition forecast (locked FTF / FTP / combined)  
6. Branch / line explanation  
7. Scenario compare (naive vs correct)  
8. Batch forecast  
9. Audit log  
10. CSV export  
11. Goldens browser  
12. Honesty / disclaimer page  
13. Webhook inbound + HMAC  
14. Org webhook settings  
15. Pagination + search/filter  
16. Rate-limit feedback  
17. Offline try page (`try.html`)  
18. In-app link to tutor guide  

## Pages (9 ≥6)

1. Marketing landing (`/index.html` / `/`)  
2. Returns catalog (`/returns.html`)  
3. Timeline detail (`/timeline-detail.html`)  
4. Scenario compare (`/scenario.html`)  
5. Batch forecast (`/batch.html`)  
6. Audit log (`/audit.html`)  
7. Goldens browser (`/goldens.html`)  
8. Honesty (`/honesty.html`)  
9. Org settings (`/settings.html`)  

## Aggregates (≥4)

Organization · ReturnTimeline · AdditionForecast · AuditEvent (+ OrgSettings, Member)

## Smoke exit

- ≥25 paper goldens green (dual-impl A/B)
- Org + return timeline + addition forecast API
- Cheat rejects (flat fee, dual-approver, interest-as-penalty, installment silent)
- Kill A language in this file; mature display name

## Maturity checklist (sustain)

- [x] ≥15 features live
- [x] ≥6 pages with UI critical paths
- [x] ≥4 aggregates
- [x] Dual-impl CI green
- [x] Offline `try.html`
- [x] Tutor guide under `docs/guides/`
- [x] Digests use **Filing Penalty Desk** only (never statute-code brand)
- [x] Never claim IRS/CPA replacement
