# Business rubric (idea quality)

Versioned scoring for **business idea quality** — separate from cell/harness maturity (`docs/RUBRIC.md`).

**Purpose:** stop shipping weak paper→studio clones. Score before climb; re-score after finish; kill low tiers; **improve this rubric** when a kill or miss teaches something new.

Current version: **`biz-rubric-v2`** (2026-07-26)

## Optimize for

**Software-solvable business problems** — a named buyer with a job that shipping software (SaaS, tooling, benches, ops consoles) can fix in weeks/months, with a credible money path.

**Not** device OEMs, clinical carepaths, wet-lab biologics, or consumer/retail novelty dressed as a lab studio.

## Tiers

| Tier | Score | Meaning | Action |
|------|-------|---------|--------|
| **A** | 80–100 | Clear buyer + money path + defensible wedge | Prefer climb; deepen |
| **B** | 60–79 | Plausible but thin PMF or monetization | Climb only if IA is distinct and depth bar is met |
| **C** | 40–59 | Lab curiosity / weak buyer | Do not open new projects; finish in-flight only if already started |
| **Kill** | 0–39 | Clone, no buyer, vanity paper, or non-software problem | Garbage-collect: mark killed; do not build |

## Dimensions (0–10 each → weighted composite 0–100)

| Id | Dimension | Weight | What “10” looks like |
|----|-----------|--------|----------------------|
| `buyer` | Named buyer with budget | 15% | Specific role + org that already pays for adjacent tools |
| `pain` | Acute, frequent pain | 15% | Weekly/daily job; expensive when wrong |
| `pmf` | Early product–market fit signal | 15% | Credible first adopters + willingness-to-pay hint (honest: “signal,” not proven) |
| `money` | Money hook | 15% | Clear capture (seat / usage / API / services) |
| `wedge` | Market wedge / timing | 10% | Why now; narrow beachhead |
| `moat` | Differentiation | 10% | Not a noun-swap of an existing lab product or commodity SaaS |
| `evidence` | Paper / code / domain evidence | 10% | Public code, strong software claim, or falsifiable domain math — not wet-lab theater |
| `feasibility` | Ship-in-lab feasibility | 10% | Can hit comprehensive bar without fake wet-lab / fake FDA / fake store ops |

Composite = round(Σ dimension × weight × 10).

## Mandatory fail → Kill (regardless of average)

1. Isomorphic desk / studio shell (forbidden IA from `docs/COMPREHENSIVE_PRODUCT.md`)
2. No named buyer beyond “researchers” / “AI teams”
3. Money hook is only “method lab experiment” with no *hypothetical* capture path stated
4. Same claim as an existing **Complete** portfolio row (clone)
5. **Not software-solvable:** primary value requires medical devices, live clinical care, wet-lab / biologics validation, hospital EMR write-back, FDA/CDS clearance, or physical retail/ops that software alone cannot fix
6. **Consumer / retail novelty only** (packing lists, itineraries, shopper gadgets) with no B2B money path
7. Paper is research costume for a domain the lab cannot honestly productize as software

## Prefer (A/B patterns)

| Pattern | Why |
|---------|-----|
| Literal-dollar / compliance math (Filing Penalty Desk) | Buyer feels $ immediately |
| FinOps / LLM cost / cache (Prompt Cache) | Existing bill = acute pain |
| Trust / eval / agent safety benches | Platform budgets forming |
| OT / ICS software (Ladder Bomb) | Niche, paid |
| Dev / ML infra toolchains | Teams already buy compilers and benches |
| Rubric / scoring quality products | Method is the product; domain is a skin |

## Rubric evolution (keep improving)

When the garbage collector kills an idea or a finished product scores ≤ C:

1. Write one lesson in `docs/BUSINESS_RUBRIC_CHANGELOG.md`
2. Bump version (`biz-rubric-vN`)
3. Adjust weights, add a dimension, or add a hard fail
4. Re-score open **Building** / backlog rows under the new version (note prior score)

Do **not** edit `harness/` or `oracles/` for business scoring — this rubric is docs + `matrix/business-scores.json` only.

## Artifacts

| Artifact | Path |
|----------|------|
| Scores (source of truth) | `matrix/business-scores.json` |
| Human table | `matrix/BUSINESS_SCORECARD.md` (generated) |
| Protocol | `protocols/GARBAGE_COLLECTOR.md` |
| Changelog | `docs/BUSINESS_RUBRIC_CHANGELOG.md` |
| Regenerator | `node scripts/score-business.mjs --write-md` |

## Pointers

- Cell maturity: `docs/RUBRIC.md`
- Finish email TLDR must mirror scorecard: Idea / Potential / PMF / Money / Risk (`protocols/NOTIFY.md`)
