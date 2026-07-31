# Egress Spill Studio — PRD

**Problem:** FinOps leads hit invoice week without a clear $ view of unexpected egress and data-transfer spill versus the planned budget.  
**Solution:** Soft-sim studio that imports transfer usage + budgets, computes spill in dollars, and compares budget-aware path (A) vs ignore-egress path (B).  
**Success:** ≥25 features; ≥11 pages including `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`; dual-impl ≥30 goldens; live app smoke.  
**Out of scope:** Live cloud billing SOR; SP/RI/CUD coverage; AP rate variance; clinical/device/wet-lab.
