# Schema Drift Studio — PRD

**Problem:** Platform and data leads gate releases without clear evidence that live schema still matches the last approved migration pack.  
**Solution:** Soft-sim studio that imports approved packs + live schema snapshots, computes drift findings, and compares pack-matched path (A) vs live-as-is path (B).  
**Success:** ≥25 features; ≥11 pages including `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`; dual-impl ≥30 goldens; live app smoke.  
**Out of scope:** Live DDL / prod write authority; OT PLC diffs; feature-flag debt; clinical/device/wet-lab.
