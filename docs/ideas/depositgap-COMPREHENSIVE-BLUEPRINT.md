# depositgap — comprehensive product blueprint (pre-build, parallel seed)

**Status:** paper only. Parallel seed — **not** `current_idea` while htsroute holds the slot.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md`  
**Framing:** `depositgap-PRODUCT-FRAMING.md` · stakes: `depositgap-VALUE-STAKES.md` · scorecard: `depositgap-GATE-SCORECARD.md`  
**Unique claim:** AD/CVD **cash deposit rate** vs **final assessed rate**, then **19 U.S.C. § 1677g** interest (IRC § 6621) from order publication to liquidation — bill or refund of `(assessed − deposited) × entered value` **plus** statutory interest.

## Goal

A multi-page trade-compliance **cash-forecast workflow** that models deposit→assessment→interest honestly — not a one-page rate calculator, not a dual-approver status board, not a generic day-count accrual costume (≅ bondstrip).

## Aggregates (≥3)

1. **Organization** — tenants, members, roles (`analyst`, `auditor`, `admin`)
2. **Entry / line deposit** — entry id, POR, exporter/producer assignment class, cash deposit rate(s), entered value, order publication date, deposit paid
3. **Assessment event** — Commerce/CBP assessed rate (company-specific vs all-others / exporter), liquidation date (or forecast date), locked delta + interest run
4. **Interest accrual run** — § 1677g window, § 6621 rate series applied, principal under/overpayment, interest amount, algorithm version + actor + timestamp
5. **Audit event** — append-only trail of creates, rate-source selections, forecasts, overrides(rejects), exports
6. **Rate source pack** (optional v1) — linked FR / I&D / liquidation instruction cites for goldens (read-mostly)

## Pages (≥4)

| Page | Purpose | Role |
|------|---------|------|
| **1. Entries catalog** | List/filter entries by POR, order, exporter class, deposit vs assessed status, bill/refund sign | analyst, auditor |
| **2. Entry detail** | Edit deposit facts, assign rate source class, run deposit→assess→interest forecast, see locked money line | analyst |
| **3. Batch liquidate / forecast** | Upload/queue multiple entries; concurrent independent runs (no shared mutable rate table mid-batch) | analyst |
| **4. Interest & cash impact** | POR rollup: duty delta, interest, net collect/refund; filter by order / exporter | analyst, auditor |
| **5. Audit log** | Filter by org/entry/actor/rate-class; export CSV | auditor, admin |
| **6. Goldens / fixtures browser** | Read-only paper goldens + pass/fail vs live depositgap engine | auditor |
| **7. Org settings** | Members, tokens, webhook endpoint secret | admin |
| **8. Money honesty** | Static education: deposit ≠ final; § 1677g interest compounds the miss; no “we replace your broker” claim | all |

## Features (≥6 beyond CRUD)

1. **Rate-source selection** — company-specific vs all-others / exporter assessment class; reject ambiguous or cheating enums
2. **Deposit vs assessed delta** — `(assessed − deposited) × entered value` with signed bill/refund
3. **§ 1677g interest window** — from order publication (or statute-correct start) to liquidation / forecast date; apply IRC § 6621 series (not a flat “days × mystery APR”)
4. Batch + concurrency independence across entries
5. Audit export (CSV) of forecasts and rate-class choices
6. Bearer auth + RBAC (auditor cannot mutate deposit facts or run classify-as-final)
7. Signed inbound webhook (e.g. ACE-ish entry deposit push) with idempotency keys
8. Pagination on catalog, cash-impact rollup, and audit
9. Fixture browser tied to future `docs/ideas/fixtures/depositgap-*` goldens
10. Negative path: treating deposit rate as final **fails**; skipping interest when delta ≠ 0 **fails**

## Forbidden in build (when/if activated)

- Dual-approver status gates as “domain”
- Generic day-count accrual without deposit vs assessed rate assignment (≅ bondstrip costume)
- Collapsing into “rate ceiling + dual signer” or drawback **lesser-of-two** refund math (§ 1313(l) — that is lesserof)
- Single-page calculator shipping as “sustain”
- Claims to replace CBP liquidation, protests, or scope rulings (offline fence stays)

## Phase plan (when build starts — not today)

| Phase | Scope |
|-------|-------|
| smoke | Org + Entry + deposit→assess→interest + ≥25 claim goldens |
| crud | Catalog + entry detail + RBAC |
| workflow | Batch forecast + cash-impact rollup + audit log |
| integrate | Webhook + pagination + rate limit |
| scale | Concurrent batch stress |
| sustain | All pages + money honesty + dual-impl CI + try.html |

## Test themes

- Worked toy green: deposit 10% vs assessed 25% on $1M entered value → **$150k** duty delta **before** interest; interest compounds per § 1677g / § 6621
- Rate-class goldens: company-specific vs all-others assignment changes assessed rate correctly
- Negative: deposit-as-final cheat rejected; interest window start/end swaps rejected; auditor cannot mutate rates
- UI critical path per page (playwright or fetch+html smoke)
- Money honesty page asserts disclaimer copy present (forecast ≠ CBP liquidation)

## Kill risks (carry from seed)

| Kill | Note |
|------|------|
| A — incumbents | Brokers / ACE / counsel already liquidate. Survive only as **method / forecast honesty** experiment unless a narrow modeling gap is evidenced at framing. |
| B — niche | AD/CVD-order importers only. |
| C — offline | Reviews, scope, protests stay offline; product holds forecast arithmetic only. |
| G2 | Must keep **deposit vs assessed + § 1677g interest + rate-assignment classes** — not dual-gate / capacity / lesser-of costumes. |

## Explicit non-action (this artifact)

- **Do not activate.** Seed only.
- Do not change `matrix/CONTROLLER.json` `current_idea` to depositgap.
- Do not frame, fixture, or open `projects/depositgap/`.
- Do not displace htsroute’s active research slot or auto-promote over lesserof.
- This blueprint satisfies the **comprehensive bar shape** so activation later is multi-page/multi-feature from day one — it does **not** clear `protocols/IDEA_DEPTH.md`.
