# Blueprint — Thorax Localize Studio

## Pages (NOT desk clone)
| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — CXR localize buyer |
| `/exams` | Chest X-ray exam registry |
| `/findings` | Multi-disease finding console |
| `/lesions` | Lesion localization records |
| `/maps` | Probabilistic activation maps |
| `/validation` | Clinical validation queue |
| `/compare` | Classify+localize vs classify-only |
| `/settings` | Org, members, webhook |
| `/honesty` | Fence + Sources |

Forbidden primary IA: /jobs /lifecycle /scenario /batch /goldens  
Forbidden reuse: Cardiac CT `/studies` `/annotations` `/segments` `/phenotypes`

## Dual score
A: classify + localize plan quality (PCAM-style maps)  
B: classify-only baseline (no lesion location)

## Feature bar
≥20 real features; ≥8 distinct pages; try.html; tutor guide; live app-up before finish.
