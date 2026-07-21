# tariffstep — G6 research summary

1. **Problem:** Utility rate analysts repeatedly validate stepped energy charges plus demand-ratchet logic after tariff changes. Spreadsheet implementations are error-prone at block boundaries and ratchet edge cases.

2. **Why prior products do not cover it:** `settlecut` is single-interval loss/imbalance math, `bondstrip` is day-count accrued coupon math, and earlier products are workflow/state models. None encode stepped tariff ladders plus prior-peak ratchet.

3. **Unique claim + invariants:**
   - Energy charge is a deterministic block walk across ascending breakpoints.
   - Demand charge uses `max(current_peak, prior_peak * ratchet_pct)`.
   - Combined bill total must be reproducible from tariff primitives.

4. **Kill rounds + outcomes:**
   - Kill A (CIS/Lodestar already solve this) **stands commercially**; keep method-stress framing only.
   - Kill B (too niche) remains soft; depends on proving analyst pain with real examples.
   - Kill C (offline tariff/legal complexity) partially answered: math kernel is still checkable.

5. **Falsifiers:**
   - Two independent utility SMEs reject the block/ratchet v0 model as missing tariff clauses.
   - Analysts still require spreadsheet recalculation for happy-path cases after smoke.

6. **Depth test outline:** 25 fixtures A–Y green in `check-tariffstep-fixtures.mjs`, covering happy path, ratchet binds, boundary edges, large-volume stress, and malformed-input rejects.

7. **Decision:** **Do not build yet.** Keep `tariffstep` in research (`adversarial` → candidate `testable`) until G1 evidence quality improves and kill-round caveats are tightened.
