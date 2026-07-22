# lesserof — comprehensive product blueprint

**Status:** paper only. Active research (`current_idea`) after depositgap sustain. **Not** `ready_to_build` until hours + preflip clear.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md`  
**Claim:** `lesserof-NARROW-CLAIM.md` (stacked caps + basket trap + direct-ID exemption)  
**Algorithm sketch:** `lesserof-algorithm.md` · CFR: `lesserof-CFR-CITATIONS.md` · toys: `lesserof-WORKED-EXAMPLE.md`, `lesserof-USMCA-STACK.md`, `lesserof-BASKET-OTHER.md` · suite: **25** dual-green (A–Y)

## Goal

A multi-page drawback **forecast-honesty** workflow experiment: stacked **TFTEA lesser-of** + **USMCA lesser-of** + **basket-“other” eligibility reject** + **direct-ID exemption** — not a one-field “99% of duty paid” calculator and not a dual-approver status gate.

Kill A stands commercially (broker platforms + ACE filers). Digests must name this as a **method / workflow experiment** for finance pre-claim models, not a GTM ACE filer.

## Unique claim (all four required)

If any of these is missing, the product collapses to a vendor-blog worksheet clone:

1. **TFTEA substitution lesser-of** (19 U.S.C. § 1313(l); 19 CFR §§ 190.22 / 190.32) on § 1313(b) / § 1313(j)(2) lines — refund ≤ 99% × min(paid, substitute/export duty basis).
2. **Direct-ID exemption** — § 1313(a) / § 1313(j)(1) recover 99% of paid **without** TFTEA lesser-of; applying lesser-of to direct-ID is a **reject / wrong mode**.
3. **USMCA export lesser-of** (19 U.S.C. § 4534 / 19 CFR § 182.44) when export destination is CA/MX — can drive recoverable duty to **$0** even after TFTEA; same-condition escape under § 182.45(b) must be modeled as a separate lane, not silently applied.
4. **Basket “other” trap** (19 U.S.C. § 1313(j)(5)) — 8-digit descriptions beginning with “other” cannot substitute on 8-digit alone; need matching non-“other” 10-digit SRN or **ineligible** (not a silent lesser-of pass).

**Explicit fail:** shipping a product whose whole UX is “enter duty paid → × 0.99.”

## Aggregates (≥3)

1. **Organization** — tenants, members, roles (`analyst`, `auditor`, `admin`)
2. **Claim line** — durable line facts: claim basis, HTS8/HTS10 + description class flags, duty columns, export destination, USMCA partner duty, locked recoverable + algorithm version
3. **Forecast snapshot** — naive / TFTEA-only / stacked / eligibility outcomes with dollar deltas (forecast vs correct)
4. **Audit event** — append-only trail of creates, recalcs, mode rejects, eligibility rejects, overrides(denied)
5. **HTS description pack** (optional v1) — read-mostly “other” / non-“other” labels for basket goldens

## Pages (≥4 — target 6)

| Page | Purpose | Role |
|------|---------|------|
| **1. Claim workspace** | Create/edit claim lines; set basis, duty columns, HTS, destination; run stacked calc; see locked recoverable | analyst |
| **2. Lane compare** | Side-by-side direct-ID vs substitution on shared paid amount — proves lesser-of **must not** apply to direct-ID | analyst, auditor |
| **3. USMCA stack** | Show TFTEA cap → USMCA cap sequence; Canada/Mexico duty-free → $0 path; same-condition carve-out callout | analyst |
| **4. Basket eligibility** | 8-digit “other” gate + 10-digit match UI; reject vs eligible contrast (toy 3926.90.99 path) | analyst |
| **5. Forecast vs actual** | Table of naive / half-naive / stacked / ineligible models with **fantasy cash** deltas (e.g. +$5,940 / +$9,900 / +$4,950 toys) | analyst, auditor |
| **6. Audit log** | Filter by org/line/actor/reject reason; export CSV | auditor, admin |
| **7. Org settings** (sustain) | Members, tokens, webhook secret | admin |

## Features (≥6 beyond CRUD)

1. Stacked recoverable calc (TFTEA → USMCA) with algorithm version stamp
2. Direct-ID mode that **rejects** lesser-of application
3. Basket “other” eligibility reject (ineligible ≠ $0 lesser-of)
4. Lane-compare view with locked invariants
5. Forecast-vs-actual report (naive / TFTEA-only / stacked / reject)
6. Audit export
7. Bearer auth + RBAC (auditor cannot recalc; analyst cannot wipe audit)
8. Signed inbound webhook (e.g. ERP claim-line push) with idempotency
9. Pagination on claim list + audit
10. Money-honesty digests: Kill A “workflow experiment only”; no ACE-filing claims

## Forbidden in build

- Plain **99%-of-paid** calculator as the whole product
- Dual-approver / dual-signer status gates as “domain”
- Silent 8-digit “other” basket match into lesser-of
- Applying USMCA § 182.44 cap to same-condition § 182.45(b) lines without a separate golden path
- Single-page calculator shipping as “sustain”
- Noun-swap of htsroute / dual-gate templates

## Phase plan (when build starts — after hours + preflip)

| Phase | Scope |
|-------|-------|
| smoke | Org + claim line + stacked calc + **≥25** paper goldens ported (A–Y) |
| crud | Claim workspace + lane compare pages + RBAC |
| workflow | USMCA stack + basket eligibility + forecast vs actual |
| integrate | Webhook + pagination + rate limit |
| scale | Concurrent independent lines (caps do not bleed) |
| sustain | All pages + audit export + try.html demo of stacked miss |

## Test themes (from `lesserof-NARROW-CLAIM.md` G5)

- Happy: substitution lesser-of binds / does not bind / equal columns
- Happy: direct-ID recovers 99% of paid (no lesser-of)
- Negative: lesser-of on direct-ID → reject; skip lesser-of on substitution → reject
- USMCA: CA duty-free → recoverable **0**; MX duty ≥ U.S. side → U.S. side survives
- Basket: 8-digit “other” without 10-digit match → ineligible; matching non-other 10-digit → eligible then TFTEA
- Expert cheat: relabel claim type to dodge lesser-of → reject
- Concurrent: two lines independent caps
- UI critical path per page; money-honesty copy present on forecast page

## Money honesty (digest / try.html)

| Toy | Naive / half-naive | Correct | Fantasy cash |
|-----|--------------------|---------|--------------|
| TFTEA bind only | $9,900 | $3,960 | +$5,940 |
| TFTEA + Canada $0 | $3,960 (forgot USMCA) | $0 | +$3,960 |
| Basket “other” silent match | $4,950 | ineligible $0 | +$4,950 |

## Explicit non-actions today

- Do **not** open `projects/lesserof/` until hours + `lesserof-FLIP-WHEN-CLEAR.md` clear (`FLIP_PATH_READY`)
- Do **not** set `ready_to_build` while hour-status prints `WAIT_HOURS`
- Do **not** claim every CA/MX export wipes (same-condition out of scope)
- Do **not** collapse the product to a single ×0.99 field or ACE-filer replacement
