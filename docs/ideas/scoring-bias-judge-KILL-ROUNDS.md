# Scoring bias in LLM judges — kill rounds

Against `docs/ideas/scoring-bias-judge-RELATED-WORKS.json` + seed 2506.22316.

## Kill 1 — Feature checkbox, not a product

**Attack:** Bias tests are a settings page, not a studio.

**Answer:** Accept as standalone product kill. Survive as **Bias Hardening** module + CI gates inside Rubric Compiler Studio.

**Verdict:** kill standalone product.

## Kill 2 — Preference-bias literature already covered

**Attack:** MT-Bench / judge surveys already discuss bias; this paper adds nothing shippable.

**Answer:** Scoring-mode biases (order, IDs, references) are under-served vs pairwise preference. Ship those specific tests or accept kill.

**Verdict:** answered conditional on scoring-mode suite.

## Kill 3 — Clinical eval bleed from related works

**Attack:** Related medical LLM eval papers pull regulated assessment.

**Answer:** Fence: B2B software eval only; refuse clinical products.

**Verdict:** answered with fence.

## Outcome

**Park as product.** Promote Bias Hardening into Rubric Compiler Studio pack.
