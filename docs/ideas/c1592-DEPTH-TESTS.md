# c1592 — depth test outline (G5 paper)

Target for smoke alone ≥ **25** dual-green fixtures (not 12–18 isomorphic checks).

## Happy paths

- Negligence 2× binds / domestic binds / equal lesser-of  
- Gross 4× binds / domestic binds  
- No-loss 20% / 40%  
- Fraud domestic (including when 4× path would be higher)

## Negatives / boundaries (≥5)

- flat_2x_cheat, dual_approver_cheat, ignore_domestic_cap (when it would understate)  
- bad culpability, zero/NaN domestic, no-loss missing dutiable, negative duty_loss  
- flat cheat preferred when both cheats set  

## Concurrency / independence

- Batch of mixed ok + reject: reject does not rewrite siblings (product phase)

## Expert cheat

- Ignoring domestic when 2×/4× exceeds it  
- Applying 2× on a no-loss story  

## Current kit

See `docs/ideas/fixtures/c1592-*.json` + `check-c1592-dual.mjs`. Grow to ≥25 before flip; hours hold still required.
