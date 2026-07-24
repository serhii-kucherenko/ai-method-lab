# Realtime Deploy Studio — lessons

## What we shipped
A realtime multimodal deploy studio with apps, harnessed deploy console, readiness gates, and harnessed vs naive single-shot compare — not a noun-swapped desk shell.

## Lessons
1. **IA must match the claim.** Apps / deploy / readiness is the story; `/jobs` `/lifecycle` would have failed the isomorphic-desk ban.
2. **Harness lift sells the paper.** TTFO and measurement-gated passes make the agent-harness claim visible without branding as FlashRT.
3. **Fence early.** Soft simulation + “not FlashRT / not a production autoscaler” belongs on landing and honesty, not only in README.
4. **Dual-impl goldens before UI polish.** Lock A/B formulas first; UI then becomes a thin console over verified scores.
5. **Live build is the sustain gate.** Unit green with a broken `next start` is not done.

## Sources
- Paper: https://arxiv.org/abs/2607.18171v1
- Authors’ code: https://github.com/Infini-AI-Lab/FlashRT
- Product: `projects/realtime-deploy-studio/`
