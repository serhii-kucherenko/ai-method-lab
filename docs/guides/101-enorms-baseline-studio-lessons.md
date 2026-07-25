# Enorms Baseline Studio — what we learned

**Product:** `projects/enorms-baseline-studio`  
**Paper:** https://www.medrxiv.org/content/10.64898/2026.07.13.26357876v1 (authors’ code: none)

## Category practices shipped

Eval / EEG soft-sim bench: versioned baseline packs, channel configs, seizure-detection sets, dual A/B compare, scoreboard, org/members, audit, export, HMAC webhook, bearer auth, rate limit, goldens (≥30), try.html, pricing/demo/onboarding/flows/honesty.

## Lessons

1. **Domain nouns beat desk clones.** `/baselines` `/channels` `/detections` `/runs` keep the buyer story; avoid `/jobs` `/lifecycle` isomorphic shells.
2. **Soft-sim honesty is the product fence.** Never claim clinical diagnostic use, live EEG control, or FDA clearance.
3. **Dual scorers need distinct fuel.** Path A rewards patient norm fit / coverage / stability / detection sensitivity; path B rewards population match optimism — otherwise compares collapse to noise.
4. **≥5 named flows** (pack → channels → detections/runs → compare → export/webhook) matter more than a single demo path.
5. **Offline try.html** should approximate the claim without pretending to be the full multi-page studio.

## Deferred

Live EEG device connectors, clinical validation studies, and regulatory clearance workflows — out of scope by design.
