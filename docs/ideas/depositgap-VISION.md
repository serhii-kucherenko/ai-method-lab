# depositgap — product vision (seed paper)

**Paper only. Seed. Do not open `projects/depositgap/` yet.**

Strongest next seed after `htsroute` park lean. Sources: `depositgap-PRODUCT-FRAMING.md`, `depositgap-VALUE-STAKES.md`, `depositgap-COMPREHENSIVE-BLUEPRINT.md`, `depositgap-6621-FENCE.md`, `depositgap-algorithm.md`.

---

## Who

Trade-compliance **analysts** and FP&A partners at AD/CVD-order importers who today treat the **cash deposit rate as landed cost** until CBP liquidates — then get surprised by duty true-up **plus** § 1677g interest.

Secondary: **auditors** who need an append-only trail of rate-class choices and forecast locks — not a dual-approver status board.

Not the audience: brokers seeking an ACE replacement, counsel litigating scope, or teams that only need a day-count widget.

---

## Why

19 U.S.C. §§ 1673f(b) / 1671f(b) collect or refund the deposit↔assessed difference **with** § 1677g interest (IRC § 6621). Finance that forecasts deposit-only COGS is lying to itself before liquidation.

Kill A stands: brokers, ACE/ABI, and counsel already liquidate. Vision survives only as a **forecast / method honesty** experiment — cash planning and rate-class discipline — not as “we print the bill.”

---

## What success looks like in 12 months

| Signal | Honest bar |
|--------|------------|
| Product | Comprehensive workflow (≥8 pages, smoke→sustain ladder) — not a one-page rate calculator labeled sustain |
| Money | Every forecast surfaces **duty_delta and interest separately**; skip-interest with days > 0 always rejects |
| Toy honesty | Illustrative underdeposit still tells the § 1677g story: e.g. $1M × (25%−10%) = **$150k** duty delta, then interest on the miss (VALUE-STAKES / algorithm toys) — labeled **forecast toy**, never a filed entry |
| Ops | POR cash-impact rollups used for planning; auditors export CSV; ≥23 goldens + dual-impl green |
| Claims | Digests still carry Kill A: brokers and CBP own liquidation |

Success is **not** ACE/OIS day-count parity, market proof from fixture counts, or replacing Form 7501 / broker workflows.

---

## What we refuse to become

1. **Not a Form 7501 / entry-summary replacement** — no claim to file, liquidate, or protest.
2. **Not a dual-gate FSM** — no dual-approver status costume as “domain” (G2 fence).
3. **Not a bondstrip-style day-count widget** — interest without deposit vs assessed rate assignment is costume.
4. **Not lesser-of / drawback math** — § 1313(l) is lesserof; stay on deposit↔assessed + § 1677g.
5. **Not “prints the ACE bill”** — v0 uses a single `interest_annual_rate` stand-in (`depositgap-6621-FENCE.md`); mid-window § 6621 segmentation is later dual-suite work, not a digests lie today.
6. **Not smoke-as-sustain** — shipping a single true-up calculator fails `docs/COMPREHENSIVE_PRODUCT.md`.

---

## Money-honesty bar (§ 1677g interest dollars)

Every user-facing forecast and digest must:

- Show **duty_delta** = `(assessed_rate − deposit_rate) × entered_value` with signed bill/refund.
- Show **interest** for the publication→liquidation window when days > 0 — never hide the § 1677g line.
- Show **true_up** = duty_delta + interest.
- Reject `skip_interest=true` when days > 0 (`depositgap-API-CONTRACT.md`, algorithm honesty gate).
- Call § 6621 rates a **stand-in** while the mid-window fence is open — never claim ACE bill printout.
- Never conflate deposit-gap interest with post-liquidation delinquency (§ 1505(d)).

Illustrative stakes (VALUE-STAKES): ~$150k underpayment + illustrative interest on a $1M / 10%→25% toy. Digests say **forecast toy**.

---

## Explicit non-action

Do not activate, do not open `projects/depositgap/`, do not flip `current_idea` from this artifact. Activation waits on htsroute clear + `depositgap-POST-HTSROUTE-RUN.md`.
