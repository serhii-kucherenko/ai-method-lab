# lesserof — product vision (seed paper)

**Paper only. Seed / research. Do not open `projects/lesserof/` yet.**

Active research idea after depositgap sustained. Sources: `lesserof-PRODUCT-FRAMING.md`, `lesserof-VALUE-STAKES.md`, `lesserof-COMPREHENSIVE-BLUEPRINT.md`, `lesserof-USMCA-WIPE-FENCE.md`, `lesserof-algorithm.md`, `lesserof-G6-summary.md`.

---

## Who

Trade-compliance **analysts** and FP&A partners at **export manufacturers** with drawback programs who today forecast refunds as “99% of duty paid” — then get surprised when **TFTEA lesser-of**, **USMCA export lesser-of**, or a **basket “other”** eligibility reject cuts recoverable duty (sometimes to **$0**).

Secondary: **auditors** who need an append-only trail of claim-basis choices, basket gates, and stacked-cap locks — not a dual-approver refund board.

Not the audience: brokers seeking an ACE replacement, counsel litigating drawback eligibility rulings, or teams that only need a one-field “×0.99” widget.

---

## Why

For **substitution** claims, 19 U.S.C. § 1313(l) and 19 CFR §§ 190.22 / 190.32 cap refunds at 99% of the **lesser of** duties paid vs substitute basis. When exporting to Canada/Mexico, 19 U.S.C. § 4534 / 19 CFR § 182.44 can cap again — duty-free partner duty **wipes recoverable to $0** after TFTEA. Basket lines whose 8-digit description begins with “other” are **ineligible** under § 1313(j)(5) without a matching non-other 10-digit — not a silent lesser-of pass. Direct-ID (§ 1313(a) / § 1313(j)(1)) recovers 99% of paid **without** lesser-of; applying lesser-of there is wrong mode.

Finance that models a single “99% of paid” cell invents cash that never comes.

Kill A stands: brokers, ACE filers, and drawback specialists already claim. Vision survives only as a **stacked-cap forecast / method honesty** experiment — not as “we file the claim.”

---

## What success looks like in 12 months

| Signal | Honest bar |
|--------|------------|
| Product | Comprehensive workflow (≥6 pages, smoke→sustain ladder) — not a one-page ×0.99 calculator labeled sustain |
| Money | Every forecast surfaces **TFTEA cap and USMCA cap separately**; USMCA duty-free path shows recoverable **$0** |
| Toy honesty | Illustrative misses still tell the stack story: e.g. +$5,940 (TFTEA bind), +$3,960 (forgot USMCA wipe), +$9,900 (naive 99% on Canada $0) — labeled **forecast toy**, never a filed claim |
| Ops | Lane compare (direct-ID vs substitution); basket reject ≠ silent $0 lesser-of; auditors export CSV; ≥23 goldens + dual-impl green |
| Claims | Digests still carry Kill A: brokers and ACE filers own filing |

Success is **not** ACE drawback parity, market proof from fixture counts, or replacing Form 7551 / broker workflows.

---

## What we refuse to become

1. **Not an ACE / Form 7551 / drawback-filing replacement** — no claim to file, liquidate, or protest.
2. **Not a dual-gate FSM** — no dual-approver status costume as “domain” (G2 fence).
3. **Not a naked “×0.99 of paid” widget** — TFTEA + USMCA + basket + direct-ID exemption are all required.
4. **Not deposit-gap / AD-CVD interest math** — § 1677g is depositgap; stay on stacked refund caps.
5. **Not silent basket-“other” match** — ineligible is a reject, not a lesser-of pass.
6. **Not smoke-as-sustain** — shipping a single refund calculator fails `docs/COMPREHENSIVE_PRODUCT.md`.

---

## Money-honesty bar (stacked refund caps)

Every user-facing forecast and digest must:

- Show **tftea_cap** = 99% × min(paid, substitute basis) on substitution (or reject wrong mode).
- Show **usmca_cap** when destination is CA/MX — including the **$0 wipe** when partner duty is zero (`lesserof-USMCA-WIPE-FENCE.md`).
- Show **recoverable** = stacked result; never hide a zero USMCA path behind a TFTEA-only number.
- Reject lesser-of on direct-ID; reject skip-lesser-of on substitution; reject USMCA without numeric partner duty; reject USMCA flag on direct-ID.
- Reject basket “other” without matching non-other HTS10 — **ineligible**, not silent $0 lesser-of.
- Call fantasy-cash toys illustrative — never claim filed-claim savings from fixtures.
- Never conflate stacked-cap forecast with ACE filing success.

Illustrative stakes (VALUE-STAKES): +$5,940 / +$3,960 / +$9,900 toys. Digests say **forecast toy** + Kill A.

---

## Explicit non-action

Do not open `projects/lesserof/` from this artifact. Still **not** `ready_to_build` until hour hold (≥4h from framing) + ≥3 research ticks + honest G6. Status: `lesserof-POST-DEPOSITGAP-STATUS.md`.
