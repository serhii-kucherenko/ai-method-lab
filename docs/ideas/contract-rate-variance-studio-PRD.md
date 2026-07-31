# Contract Rate Variance Studio — PRD

**Problem:** AP and FinOps pay (or dispute late) without a clear $ view of invoice unit rates that disagree with the contracted SKU catalog.  
**Solution:** Soft-sim studio that imports contract catalogs + invoice lines, computes rate variances in dollars, and compares catalog-matched path (A) vs invoice-as-billed path (B).  
**Success:** ≥25 features; ≥11 pages including `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`; dual-impl ≥30 goldens; live app smoke.  
**Out of scope:** Live bank ACH / ERP system of record; generic OCR AP inbox; SaaS seat true-up; cloud commitment coverage; clinical/device/wet-lab.
