# Scoring note — Customs Penalty Forecast

**Display name:** Customs Penalty Forecast  
**Legacy folder / brand:** `projects/c1592` / `c1592`

## Verdict under today’s bar

Would **fail** the Correction 6 maturity gate on **naming** (and likely **feature count**), even if oracle and contract tests were green.

## Why

1. **Naming.** Public brand was a statute-style code (`c1592`), which `docs/PRODUCT_NAMING.md` forbids as the product people see. Sustain fails maturity for that alone.
2. **Feature count.** The ship ladder cleared an older, thinner bar. Today’s sustain needs ≥15 user-visible features and ≥6 pages counted honestly (`docs/COMPREHENSIVE_PRODUCT.md`). Do not treat green tests as proof of 15.
3. **Tutor guide.** Lessons now live in Guide 02; at original sustain, scoring that ignored a missing guide would also fail today’s reviewability / maturity rules.

## What scorers should do next time

- Fail maturity when the UI or portfolio leads with a code brand — even if digests later rename it
- Count features from the blueprint and live UI, not from “tests passed”
- Require a `docs/guides/` write-up before sustain pass

See Guide 03 (`docs/guides/03-scoring-for-maturity.md`) and Guide 02.
