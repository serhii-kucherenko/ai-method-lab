# Blueprint — Legacy Infer Studio

## Pages (NOT desk clone)
| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — legacy GPU inference buyer |
| `/devices` | Legacy device registry |
| `/stages` | Stage-validated inference plans |
| `/budgets` | Kernel / VRAM budget tracker |
| `/kernels` | Re-engineered op / kernel notes |
| `/runs` | All-GPU validation runs |
| `/compare` | Stage-validated vs naive offload |
| `/settings` | Org, members, webhook |
| `/honesty` | Fence + Sources |

Forbidden primary IA: /jobs /lifecycle /scenario /batch /goldens

## Dual score
A: stage-validated all-GPU plan quality (fits tight VRAM)  
B: naive offload baseline (host spill / OOM risk)

## Feature bar
≥20 real features; ≥8 distinct pages; try.html; tutor guide; live app-up before finish.
