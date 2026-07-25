# R2map Translate Studio — what we learned

**Product:** `projects/r2map-translate-studio`  
**Paper:** https://doi.org/10.1002/mp.70561 (authors’ code: none)

## Category practices shipped

Eval / neuroimaging soft-sim bench: versioned translate packs, T1W/T2W input series, R2map configs, dual A/B compare, scoreboard, org/members, audit, export, HMAC webhook, bearer auth, rate limit, goldens (≥30), try.html, pricing/demo/onboarding/flows/honesty.

## Lessons

1. **Domain nouns beat desk clones.** `/translates` `/inputs` `/maps` `/runs` keep the buyer story; avoid `/jobs` `/lifecycle` isomorphic shells.
2. **Soft-sim honesty is the product fence.** Never claim clinical diagnostic use, live PACS write-back, or FDA clearance.
3. **Dual scorers need distinct fuel.** Path A rewards T1W/T2W fidelity / GAN stability / map coherence; path B rewards conventional match optimism — otherwise compares collapse to noise.
4. **≥5 named flows** (pack → inputs → maps/runs → compare → export/webhook) matter more than a single demo path.
5. **Offline try.html** should approximate the claim without pretending to be the full multi-page studio.

## Deferred

Live PACS connectors, clinical validation studies, and regulatory clearance workflows — out of scope by design.
