# depositgap — value / stakes honesty

Research only. Fixture count is not value. Prefer this seed after htsroute clears.

## What we can cite as primary

| Rule | Cite | Stakes shape |
|------|------|--------------|
| Deposit vs final assessed (AD) | 19 U.S.C. § 1673f(b) | Collect or refund the difference **with** § 1677g interest |
| Deposit vs final assessed (CVD) | 19 U.S.C. § 1671f(b) | Same structure; fixtures label `order_type` only |
| Interest | 19 U.S.C. § 1677g; IRC § 6621 | From order publication (statute) / deposit-required through liquidation (ops CFR) |

Sources: LII §§ 1673f / 1671f / 1677g; 19 CFR § 351.212(e); CIT Slip Op. 22-72 (interest stops at liquidation; § 1505(d) is separate); see `depositgap-STATUTE-CITATIONS.md`, `depositgap-DAY-COUNT.md`, `depositgap-G1-EVIDENCE.md`.

## Worked dollar story (illustrative — not a filed entry)

| Piece | Amount |
|-------|-------:|
| Entered value | $1,000,000 |
| Cash deposit @ 10% | $100,000 |
| Assessed @ 25% | $250,000 |
| Duty underpayment | **$150,000** |
| Illustrative interest @ 7% × 1 year (2026 Q3 underpayment rate stand-in) | **$10,500** |
| Surprise vs deposit-only forecast | **~$160,500** |

Real liquidations use CBP day-count and mid-window § 6621 changes. Digests must say **forecast toy**, not ACE bill printout.

## Hard finding (do not bury)

1. **Kill A stands commercially.** Brokers, ACE/ABI, and counsel already liquidate. Software does not “win” the liquidation.  
2. **Interest window start is easy to lie about.** Statute emphasizes order publication; ops CFR emphasizes deposit-required date. v0 uses a simple calendar toy — see `depositgap-DAY-COUNT.md`.  
3. **Delinquency interest is not the deposit gap.** Post-liquidation unpaid bills (§ 1505(d)) are a different regime — never conflate in digests.

## Where real stakes still exist (narrow, honest)

1. **FP&A / COGS honesty** — finance treating deposit rate as final landed cost until liquidation.  
2. **POR cash planning** — multi-entry rollup of duty delta + interest before cash hits.  
3. **Rate-class discipline** — company-specific vs all-others assignment must be an explicit input (engine does not invent assessed rates).

## What this does *not* prove

- Product-market demand for a forecast workflow.  
- That 23 green fixtures equal a bulletproof business.  
- OIS/ACE parity or day-count parity with CBP.

## Decision impact

- Survive framing only as **forecast / method experiment** with Kill A in every digest.  
- Prefer comprehensive multi-page build (`depositgap-COMPREHENSIVE-BLUEPRINT.md`) when activated — not a one-field rate widget.  
- Activation sheet: `depositgap-POST-HTSROUTE-RUN.md` (not today).
