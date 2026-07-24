# Agent Safety Studio — lessons

## What we shipped
An agent deployment safety studio with fleets, structural monitors (CFG/DFG/privilege), a regression alert console, and structural vs threshold-only compare — not a noun-swapped desk shell.

## Lessons
1. **IA must match the claim.** Fleets / monitors / alerts is the story; `/jobs` `/lifecycle` would have failed the isomorphic-desk ban.
2. **Structural deltas sell the paper.** CFG/DFG evidence and sync rollback make the monitoring claim visible without branding as IFG.
3. **Fence early.** Soft simulation + “not IFG / not a live control plane” belongs on landing and honesty, not only in README.
4. **Dual-impl goldens before UI polish.** Lock structural/threshold formulas first; UI then becomes a thin console over verified scores.
5. **Live build is the sustain gate.** Unit green with a broken `next start` is not done.

## Sources
- Paper: https://arxiv.org/abs/2607.14570v1
- Authors’ code: none
- Product: `projects/agent-safety-studio/`
