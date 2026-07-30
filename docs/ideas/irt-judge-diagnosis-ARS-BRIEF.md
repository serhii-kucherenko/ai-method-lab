# IRT judge diagnosis — ARS brief

Seed: [Diagnosing the Reliability of LLM-as-a-Judge via Item Response Theory](https://arxiv.org/abs/2602.00521).  
Related: `docs/ideas/irt-judge-diagnosis-RELATED-WORKS.json`.  
Protocol: `protocols/ARS_PAPER_RESEARCH.md` (no Anthropic key).

## Job to be done

Eval leads need to know whether the **judge is a stable measurement instrument** - not only whether one run matched a human once.

## Unique claim for Rubric Compiler Studio

Prior modules: compile (RULERS), recipe (Autorubric), policy lock (PReMISE), escalate (Trust or Escalate). This adds **psychometric diagnosis**: IRT-style reliability of the judge/rubric combo over items.

Product module: **Judge Health** dashboard (item difficulty/discrimination-ish views, drift alerts) without claiming clinical psychometrics cosplay.

## Related landscape (grounded)

| Work | Role |
|------|------|
| Seed IRT diagnosis (2602.00521) | IRT for LLM-as-a-judge reliability |
| Can You Trust LLM Judgments? Reliability… — URL in JSON | Reliability framing cousin |
| Contemporary Psychometrics / eval surveys — URLs in JSON | Method background; do not invent clinical product |
| Healthcare LLM-judge hits in JSON | Noise for our ICP - refuse device/clinical climbs |

## Buyer wedge

Same eval-platform ICP. “Is our judge broken this week?” is a recurring ops pain after rubrics ship.

## Recommendation

Fold into Rubric Compiler Studio as **Judge Health / reliability diagnostics**. No standalone climb.

## Falsifiers

1. Buyers never open diagnostics once scores look green
2. IRT presentation confuses non-psychometric buyers → churn
