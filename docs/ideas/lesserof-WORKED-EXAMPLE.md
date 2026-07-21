# lesserof — worked dollar example (seed deepen)

**State:** still `seed` — not framed, not active, no fixtures, no product.  
**Purpose:** prove the unique claim has **literal refund dollars** before we ever open a framing pass.

## Statute shape (primary)

Under 19 U.S.C. § 1313, manufacturing / unused **substitution** claims calculate refunds under § 1313(l). Where substitution applies, the refund is **99% of the lesser of**:

1. Duties, taxes, and fees **paid** on the designated imported merchandise, or  
2. Duties, taxes, and fees that **would apply** to the substituted (or relevant export-side) merchandise if it were imported.

Direct-identification claims under § 1313(a) / § 1313(j)(1) recover 99% of amounts paid on the **actual** imported merchandise — **without** that lesser-of cap.

## Primary quote (19 U.S.C. § 1313(l) — substitution branch)

House uscode text (fetched 2026-07-21 research tick), unused-merchandise substitution branch:

> … except that where there is substitution of the merchandise, then—  
> (i) in the case of an article that is exported, the amount of the refund shall be equal to **99 percent of the lesser of**—  
> … duties, taxes, and fees paid with respect to the imported merchandise; or  
> … duties, taxes, and fees that would apply to the substituted merchandise if the substituted merchandise were imported.

Manufacturing-substitution branch under the same subsection uses the same “99 percent of the lesser of” pattern for exported articles incorporating substituted inputs.

Source: https://uscode.house.gov/view.xhtml?req=(title:19%20section:1313%20edition:prelim)

## Toy numbers (illustrative — not a filed claim)

Assume one export claim designates one import line vs one substitute basis:

| Leg | Duty basis | Amount |
|-----|------------|--------|
| A — duty paid on designated import | Actual paid | **$10,000** |
| B — duty that would apply if substitute were imported | Hypothetical | **$4,000** |

| Claim type | Naive “99% of paid” | Correct under lesser-of | Error if naive |
|------------|---------------------|-------------------------|----------------|
| Substitution (§ 1313(b) or (j)(2)) | $9,900 | **99% × min(10000, 4000) = $3,960** | **+$5,940 overclaim** |
| Direct identification (§ 1313(a) or (j)(1)) | $9,900 | **$9,900** (no lesser-of) | $0 if labeled correctly |

**Unique software invariant:** applying lesser-of to a direct-ID lane is a **bug**; skipping lesser-of on a substitution lane is a **compliance/finance bug**.

## Kill A warning (do not bury)

Secondary industry writing already names this exact finance miss (e.g. GingerControl lesser-of explainer, July 2026). That strengthens **pain articulation** and **weakens commercial novelty**. If/when framed, Kill A likely **stands** — workflow experiment only unless we prove a narrower invariant incumbents skip (e.g. USMCA lesser-of stacked with TFTEA lesser-of on the same claim line, or basket-“other” 8-digit substitution trap under § 1313(j)(5)).

## Why this beats htsroute’s money story

| | htsroute (showcase PPI) | lesserof (toy above) |
|--|-------------------------|----------------------|
| Dollar stake | Often **$0 MFN delta** | **$5,940** modeling error on one toy claim |
| Unique rule | Form/mixing chapter gate | Lesser-of vs direct-ID exemption |
| Vanity risk | Fixture farm without value | Must still survive Kill A (drawback vendors + published explainers) |

## What is still missing before `framed`

1. ~~Cite exact § 1313(l) text~~ — done above.  
2. One CBP primary publication (not only vendor blog) on lesser-of operational guidance — preferred.  
3. Named user + frequency + workaround.  
4. Three kill answers on paper; expect Kill A to stand commercially.  
5. Decide whether unique claim is plain lesser-of (likely weak vs incumbents) or **stacked USMCA + TFTEA lesser-of + “other” basket trap**.

## Explicit non-actions

- Do not set `current_idea` to lesserof while htsroute holds the slot  
- Do not open `projects/lesserof/`  
- Do not invent a 25-fixture farm this tick
