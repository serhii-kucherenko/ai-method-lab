# Blueprint — MSK Care Studio

## Pages (NOT desk clone)
| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — MSK care buyer |
| `/episodes` | Patient care episode registry |
| `/streams` | Hospital state stream linking |
| `/knowledge` | External medical knowledge sources |
| `/decisions` | Evidence-grounded decision ledger |
| `/pathways` | Admission → rehab pathways |
| `/compare` | Grounded vs ungrounded LLM |
| `/settings` | Org, members, webhook |
| `/honesty` | Fence + Sources |

Forbidden primary IA: /jobs /lifecycle /scenario /batch /goldens

## Dual score
A: evidence-grounded plan quality (streams + knowledge → decisions)  
B: ungrounded LLM baseline (no stream/knowledge grounding)

## Feature bar
≥20 real features; ≥8 distinct pages; try.html; tutor guide; live app-up before finish.
