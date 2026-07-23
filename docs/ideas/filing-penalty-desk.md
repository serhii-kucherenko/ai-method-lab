# Filing Penalty Desk — research idea



**Display name:** Filing Penalty Desk  

**Slug:** `filing-penalty-desk`  

**Legacy research id:** `irc6651` (internal only — do not brand the product this way)  

**State:** `ready_to_build` — PM-GO **go** (2026-07-23). Architect pack on file (18 features). **Next:** product delivery opens `projects/filing-penalty-desk/` (never brand as `irc6651`).

**Depth note (2026-07-23):** Hours and ticks cleared; G6 + PM-GO recorded. Correction 6 maturity bar applies at sustain.


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



## Architect paper pack (slug-prefixed)



| Artifact | Path |

|----------|------|

| Vision | `docs/ideas/filing-penalty-desk-VISION.md` |

| Roadmap (draft) | `docs/ideas/filing-penalty-desk-ROADMAP.md` |

| PRD (draft) | `docs/ideas/filing-penalty-desk-PRD.md` |

| ERD (draft) | `docs/ideas/filing-penalty-desk-ERD.md` |

| Comprehensive blueprint | `docs/ideas/filing-penalty-desk-COMPREHENSIVE-BLUEPRINT.md` (**18** features → ≥6 pages, ≥4 aggregates) |



## Research kit already on file (legacy paths — not the brand)



| Artifact | Path |

|----------|------|

| Algorithm / oracle | `docs/ideas/irc6651-algorithm.md`, `irc6651-oracle.mjs` |

| Fixtures (25) | `docs/ideas/fixtures/irc6651-*.json` |

| Toys / G6 / kills | `docs/ideas/irc6651-*.md` |

| Offline demo | `demos/irc6651-try/try.html` |



## Target feature list (locked in blueprint — 18)



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



## Explicit non-actions until PM go + ready_to_build



- No `projects/filing-penalty-desk/`  

- No `ready_to_build` flip from architect pack alone  

- No public brand `irc6651`  


