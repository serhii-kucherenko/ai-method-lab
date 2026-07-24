# Blueprint — Alzheimer Predict Studio

## Pages (NOT desk clone)
| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — clinical AD risk buyer |
| `/cohorts` | Patient cohort registry |
| `/features` | Feature snapshots + missingness |
| `/models` | Imputation-free prediction runs |
| `/uncertainty` | Calibrated uncertainty bands |
| `/explanations` | Feature salience / notes |
| `/compare` | Imputation-free vs impute-then-predict |
| `/settings` | Org, members, webhook |
| `/honesty` | Fence + Sources |

Forbidden primary IA: /jobs /lifecycle /scenario /batch /goldens

## Dual score
A: imputation-free transformer plan quality (+ calibrated uncertainty)  
B: impute-then-predict baseline (fills missingness first)

## Feature bar
≥20 real features; ≥8 distinct pages; try.html; tutor guide; live app-up before finish.
