# Filing Penalty Desk — research idea

**Display name:** Filing Penalty Desk  
**Slug:** `filing-penalty-desk`  
**Legacy research id:** `irc6651` (internal only — do not brand the product this way)  
**State:** `adversarial` / hours hold — **not** `ready_to_build`  
**Bar:** Correction 6 — mature name, ≥15 features before sustain, tutor guide required

## One-line pitch

Help controllers forecast **late-file and late-pay tax additions** honestly — including same-month file reduction — without pretending to replace the IRS or a CPA.

## Problem

Spreadsheets treat “late fee” as a flat percent. Real rules stack failure-to-file and failure-to-pay on net amounts due, reduce the file addition when both apply in the same month, optionally raise the pay rate after levy-intent notice, and apply a minimum floor when a return is very late. Wrong models invent or hide cash.

## Who

Controllers and tax leads at small–mid filers (and their CPA shops) budgeting cash across late returns — not “everyone with tax software.”

## Unique claim

Month-by-month file + pay additions with same-month reduction, net bases, optional levy-intent rate bump, and minimum lesser-of — not a flat late-fee toy and not a dual-approval queue.

## Kill honesty

IRS notices and commercial tax software already assess real penalties. This product is a **forecast / workflow experiment**. Digests must say so.

## Research kit already on file (legacy paths)

| Artifact | Path |
|----------|------|
| Algorithm / oracle | `docs/ideas/irc6651-algorithm.md`, `irc6651-oracle.mjs` |
| Fixtures (25) | `docs/ideas/fixtures/irc6651-*.json` |
| Toys / G6 / kills | `docs/ideas/irc6651-*.md` |
| Offline demo | `demos/irc6651-try/try.html` |

Next architect tick must **re-home** paper pack under `filing-penalty-desk-*` names and list **≥15 features** before any `projects/filing-penalty-desk/`.

## Target feature list (draft — ≥15)

1. Org tenancy  
2. Member roles (admin / analyst / auditor)  
3. Return / timeline catalog  
4. Timeline detail editor  
5. Statutory addition forecast  
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
17. Offline try page  
18. In-app link to tutor guide  

## Explicit non-actions until hours clear + PM go

- No `projects/filing-penalty-desk/`
- No `ready_to_build` flip while hours hold incomplete
- No public brand `irc6651`
