# Roi Exemplar Studio — what we learned

**Product:** `projects/roi-exemplar-studio`  
**Paper:** https://doi.org/10.1016/j.isci.2026.116518 (authors’ code: none)

## Category practices shipped

Eval / imaging soft-sim bench: versioned exemplar packs, ROI configs, in-context prompt sets, dual A/B compare, scoreboard, org/members, audit, export, HMAC webhook, bearer auth, rate limit, goldens (≥30), try.html, pricing/demo/onboarding/flows/honesty.

## Lessons

1. **Domain nouns beat desk clones.** `/exemplars` `/rois` `/prompts` `/runs` keep the buyer story; avoid `/jobs` `/lifecycle` isomorphic shells.
2. **Soft-sim honesty is the product fence.** Never claim clinical diagnostic use or live PACS write-back.
3. **Dual scorers need distinct fuel.** Path A rewards localization/coverage/diversity/prompt fit; path B rewards naive dump optimism — otherwise compares collapse to noise.
4. **≥5 named flows** (pack → ROI → prompts/runs → compare → export/webhook) matter more than a single demo path.
5. **Offline try.html** should approximate the claim without pretending to be the full multi-page studio.

## Deferred

Live PACS connectors, clinical validation studies, and regulatory clearance workflows — out of scope by design.
