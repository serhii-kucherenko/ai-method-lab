# Research summary — depositgap (G6)

Skeptical senior-eng bar. Seed-only memo. **Do not activate** while `htsroute` holds `current_idea`.

## 1. Problem

Importers under AD/CVD orders treat the **cash deposit rate** as final COGS. At liquidation, Commerce’s **assessed rate** differs — and **19 U.S.C. § 1677g** interest (IRC § 6621) compounds the bill or refund from order publication to liquidation. Finance discovers a multi-year cash surprise that deposit-only forecasts never showed.

## 2. Why prior lab products don’t cover it

`htsroute` is HTS form/mixing (Ch 29 / 3003 / 3004). `lesserof` is drawback TFTEA + USMCA stacked refund caps. `tariffstep` is utility blocks. Dual-gate / killed `lanehold` are capacity + timers. `bondstrip`-shaped day-count accrual without deposit vs assessed assignment is a costume. None encode **deposit → assessed delta + statutory interest window**.

## 3. Unique claim + invariants

- `duty_delta = (assessed_rate − deposit_rate) × entered_value` (signed bill/refund)
- Interest = simple v0 toy over publication→liquidation days × annual § 6621-derived rate (input)
- `true_up = duty_delta + interest`
- Reject: non-positive value; negative rates; missing/non-finite interest rate; inverted dates
- Reject: `skip_interest=true` when `days > 0` (honesty — no deposit-as-final or underdeposit interest skip)
- CVD twin uses same arithmetic (`order_type` label only)
- Rate class is an input label (exporter-specific / all-others / other) — engine does not invent assessed rates

## 4. Kill rounds

| Kill | Outcome |
|------|---------|
| A — incumbents | **Stands commercially.** Brokers/ACE/counsel liquidate. Survive as **forecast / FP&A honesty** experiment. Digests must say so. |
| B — niche | Soft survive — AD/CVD-order importers only; POR cadence is real for that ICP. |
| C — offline | Survive — reviews, scope, protests stay offline; software holds pre-liquidation forecast only. |

See `depositgap-challenge-ABC.md`.

## 5. Falsifiers

1. Domain experts say the interest window start/end is wrong in ≥2 real POR liquidations → abandon or re-version algorithm.  
2. After any future smoke, finance still books deposit rate as final landed cost for the happy path → abandon.  
3. Digests claim ACE/CBP liquidation replacement or omit Kill A honesty → abandon framing as dishonest.  
4. Product collapses to dual-approver status or day-count-only accrual without deposit vs assessed → kill as isomorphic.

## 6. Depth test outline

- G5 case map: `depositgap-G5-cases.md`
- **23 fixture files green** (`check-depositgap-fixtures.mjs`)
- **Dual-impl cross-check green** (`check-depositgap-dual.mjs`)
- Product-phase notes X/Y documented (auditor mutation; concurrent entry independence)
- Worked toy: deposit 10% vs assessed 25% on $1M → **$150,000** duty before interest; + illustrative § 6621 interest
- CVD twin E; leap-year K; honesty rejects C/P/Q/R

## 7. Decision

**Activate after htsroute park (2026-07-21 ~17:25 PDT).** Hour granularity (not calendar days). Architect pack on file (VISION/ROADMAP/PRD/ERD).

Reasons to activate:
1. `htsroute` **parked** on Challenge D value weakness (soft abort #4).  
2. Literal dollar stakes (deposit→assessed + § 1677g interest) beat Free/Free form-gate.  
3. Kill A still stands — digests must say forecast / FP&A honesty, not ACE replacement.  
4. Seed research hours ≫ 4h; kits dual-green; comprehensive papers exist.

**Next:** `ready_to_build` → Product delivery opens comprehensive `projects/depositgap/` (not smoke-as-sustain). Roles: `protocols/AGENT_ROLES.md`.

## Explicit non-actions

No one-page calculator sustain. No dual-gate costume. No ACE bill claims.

