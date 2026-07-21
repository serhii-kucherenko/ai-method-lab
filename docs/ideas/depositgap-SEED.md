# depositgap — parallel research seed (not active)

**State:** `seed`  
**Slot rule:** htsroute owns `framed`→`ready_to_build`. lesserof remains the older parallel seed. This file is research-log only — do not activate, frame, or open a product.

## One-line itch

Importers book AD/CVD **cash deposit** rates as landed cost, then take a cash hit (or surprise refund) at liquidation when the **final assessed rate** differs — with **19 U.S.C. § 1677g interest** running from order publication to liquidation.

## Why this might have real value (vs Free/Free or lesser-of costumes)

- Stakes are **literal dollars**: collect or refund `(assessed − deposited)` duty, **plus** statutory interest at IRC § 6621 rates.
- Unique computational claim is not a status FSM: **rate source selection** (exporter-specific vs all-others / exporter) × entered value, then interest window per § 1677g — fails if you treat deposit rate as final or skip interest.
- Distinct from drawback **lesser-of-two** refund caps (§ 1313(l)) and from HTS **form-gate** chapter routing.

## Primary pointers (to deepen later — not this tick)

1. 19 U.S.C. § 1673f (AD deposit vs final); § 1671f (CVD); § 1677g (interest).
2. 19 CFR § 351.212 — importer-specific assessment rates.
3. Worked toy: deposit 10% vs assessed 25% on $1M entered value → $150k duty delta before interest; interest compounds the miss.

## Kill risks (pre-register)

| Kill | Risk |
|------|------|
| A — incumbents | Customs brokers, ACE/ABI, and trade counsel already liquidate AD/CVD. Survive only as **method / forecast honesty** experiment unless a narrow modeling gap is evidenced. |
| B — niche | Only importers under AD/CVD orders. Frequency is real for those ICPs; not every SMB. |
| C — offline | Administrative reviews, scope rulings, and liquidation protests stay offline. Software may only hold **deposit→assessment→interest forecast**. |
| G2 | Must not collapse into “rate ceiling + dual signer” or a generic day-count accrual (≅ bondstrip / dual-gate). Unique rule = deposit vs assessed + § 1677g interest window + rate-assignment classes. |

## Decision

**Seed only.** Do not frame, do not fixture, do not open `projects/depositgap/`. Do not displace htsroute or auto-promote over lesserof. Wave note: `SEEDS-WAVE-2026-07-21.md`.

## Artifacts so far

- `depositgap-SEED.md` — itch + kill risks  
- `SEEDS-WAVE-2026-07-21.md` — wave listing with oshamult + ptax4975 siblings  
- `depositgap-COMPREHENSIVE-BLUEPRINT.md` — multi-page/multi-feature stub (≥4 pages, ≥3 aggregates, ≥6 features); **seed only — do not activate**  
- `depositgap-STATUTE-CITATIONS.md` — § 1677g + 19 CFR 351.212(e) quotes + $150k duty-delta toy  
