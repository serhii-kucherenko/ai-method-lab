# Rhythm Read Studio — lessons

## What we shipped
A long-tailed ECG rhythm studio with cohorts, train/eval console, class balance, and angular SCL-style vs flat CE compare — not a noun-swapped desk shell.

## Lessons
1. **IA must match the claim.** Cohorts / classes / train is the story; `/jobs` `/lifecycle` would have failed the isomorphic-desk ban.
2. **Rare-class metrics sell the paper.** Tail lift and rare sensitivity make the long-tail claim visible without claiming clinical diagnosis.
3. **Fence early.** Soft simulation + “not AG-SCL branded / not a device” belongs on landing and honesty, not only in README.
4. **Dual-impl goldens before UI polish.** Lock A/B formulas first; UI then becomes a thin console over verified scores.
5. **Live build is the sustain gate.** Unit green with a broken `next start` is not done.

## Sources
- Paper: https://arxiv.org/abs/2607.14613v1
- Authors’ code: https://github.com/Open-EXG/AG-SCL-for-Long-Tailed-ECG
- Product: `projects/rhythm-read-studio/`
