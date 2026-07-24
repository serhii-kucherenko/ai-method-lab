# Enterprise Agent Studio — lessons

## What we shipped
An enterprise resource planning studio with ERP domains, role agent orchestration, a staged plan console, and multi-agent vs single-agent compare — not a noun-swapped desk shell.

## Lessons
1. **IA must match the claim.** Domains / agents / plans is the story; `/jobs` `/lifecycle` would have failed the isomorphic-desk ban.
2. **Role coverage sells the paper.** Active planner/allocator/reviewer agents feeding plan inputs make orchestration visible without branding as Agentic ERP.
3. **Fence early.** Soft simulation + “not Agentic ERP / not a live ERP” belongs on landing and honesty, not only in README.
4. **Dual-impl goldens before UI polish.** Lock multi/single formulas first; UI then becomes a thin console over verified scores.
5. **Live build is the sustain gate.** Unit green with a broken `next start` is not done.

## Sources
- Paper: https://arxiv.org/abs/2607.17331v1
- Authors’ code: none
- Product: `projects/enterprise-agent-studio/`
