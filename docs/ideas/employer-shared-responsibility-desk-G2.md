# Employer Shared Responsibility Desk — G2 differentiation

**Slug:** `employer-shared-responsibility-desk`  
**State:** `differentiated` (draft) — still **not** `ready_to_build`  
Research only. Method claim, not GTM.

## Formal claim (removal test)

**If we remove monthly full-time employee counting + (a)/(b) assessable-payment branch + offer-of-coverage gate + indexed monthly applicable-payment amounts + (b)(2) cap against the (a)-shaped month, the remaining product is a generic dollar worksheet — identical in shape to any prior lab “penalty toy,” and not a distinct domain product.**

Pass only if that removed stack needs **new invariants / failure modes / external models** vs sustained priors below.

## Vs prior products

| Prior | Unique rule there | After removing *this* desk’s ACA stack, isomorphic? | Verdict |
|-------|-------------------|-----------------------------------------------------|---------|
| **Filing Penalty Desk** (`filing-penalty-desk` / irc6651) | § 6651 FTF/FTP month fractions, (c)(1) same-month reduction, optional (d) bump, >60-day minimum lesser-of on a **return balance** | No — late-file/late-pay additions on tax due ≠ ALE monthly FTE × coverage-offer assessable payments | **Pass** |
| **ptax4975** | ERISA § 4975 prohibited-transaction **15% × year-parts → 100%** uncorrected, optional greater-of FMV | No — plan-transaction excise year-parts ≠ ACA (a)/(b) month walk | **Pass** |
| **oshamult** | OSHA gravity × serial **GBP remaining-balance** reductions + classification gates | No — workplace penalty gravity stack ≠ Marketplace PTC / offer-gate ESRP | **Pass** |
| **depositgap** | AD/CVD **deposit vs assessed** duty delta + § 1677g-shaped interest window | No — customs liquidation interest ≠ employer shared-responsibility months | **Pass** |

### Removal asymmetry (one line each)

- Remove Filing Penalty Desk’s § 6651 stack → you do **not** get ACA (a)/(b) + offer gate.  
- Remove ptax4975’s year-part excise → you do **not** get indexed $2,000/$3,000 monthly applicable amounts.  
- Remove oshamult’s serial GBP reductions → you do **not** get (b)(2) cap vs (a)-shaped month.  
- Remove depositgap’s deposit–assessment interest → you do **not** get Letter 226-J–shaped FTE/PTC month tables.

## Shared anti-patterns (must keep fenced)

- Kill A honesty: IRS + ACA vendors own production assessments  
- No dual-approver status board as “domain”  
- No statute-code product brand  
- Fixture pass counts ≠ market proof  
- Reporting-failure penalties (1094-C/1095-C) stay out of the assessable-payment total

## Fail conditions (would flip G2 to fail)

- Unique “rule” is only renaming statuses or swapping a ceiling/floor/days dual-signer  
- Product reduces to “another monthly % on a balance” without offer gate / (a)/(b) / (b)(2)  
- Merge into Filing Penalty Desk as a second rate table on the same return-balance engine  

## Decision this tick

| Check | Result |
|-------|--------|
| New invariants vs four priors | Yes — month FTE, (a)/(b), offer gate, index, (b)(2) |
| Status-rename only? | No |
| Dual-gate ceiling costume? | No |
| **G2** | **Pass** (draft) |

Continue hours hold + research ticks. **No** `projects/employer-shared-responsibility-desk/`. **Do not** flip `ready_to_build`.
