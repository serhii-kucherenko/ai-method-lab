# lesserof — same-condition USMCA carve-out fence (§ 182.45(b))

Research only. Active `current_idea`. Hours hold still open.

## What the rule says

19 CFR § 182.45(b): goods exported to Canada/Mexico **in the same condition** under 19 U.S.C. § 1313(j)(1) may take drawback **without** the § 182.44 USMCA lesser-of limitation.

Primary quote lives in `lesserof-CFR-CITATIONS.md`.

## Why this is a trap for our suite

If a golden (or product) applies the Canada/Mexico **$0 wipe** to a same-condition unused (j)(1) line, the suite **lies**. Same-condition is a **full-drawback escape**, not another wipe path.

If a golden silently skips USMCA lesser-of on a **substitution / manufacturing** line by waving “same condition,” the suite also lies.

## v0 paper / fixture policy (this hold)

| Lane | USMCA § 182.44 lesser-of | Same-condition § 182.45(b) |
|------|--------------------------|----------------------------|
| Substitution / manufacturing export to CA/MX | **Apply** (fixtures C/G/M/X/Y) | **Out of scope** — do not claim |
| Direct-ID with USMCA flag | **Reject** (fixture V) | Not a silent escape hatch |
| Same-condition unused (j)(1) to CA/MX | **Not modeled in A–Y** | Deferred — needs its own goldens + UI lane |

v0 try demo and A–Y fixtures **do not** encode § 182.45(b). Digests must not imply “every Canada export wipes to $0.”

## Build-time abort

Shipping day-1 without either:

1. an explicit **same-condition** claim flag that **escapes** § 182.44, **or**  
2. honesty copy that same-condition is **out of scope**

…fails this fence. Silent default either way is forbidden (`lesserof-COMPREHENSIVE-BLUEPRINT.md` Forbidden list).

## Decision this tick

Documented. No new fixture yet (would expand scope mid-hold). Prefer a dedicated golden when hours clear / product smoke — not a silent merge into wipe toys.
