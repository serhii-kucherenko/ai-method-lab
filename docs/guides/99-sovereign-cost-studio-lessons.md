# Sovereign Cost Studio — what we learned

**Product:** `projects/sovereign-cost-studio`  
**Paper:** https://arxiv.org/abs/2607.13443v1 (authors’ code: none)

## Category practices shipped

Cost / infra soft-sim bench: versioned cost packs, water–energy–emissions models, infrastructure scenarios, dual A/B compare, scoreboard, org/members, audit, export, HMAC webhook, bearer auth, rate limit, goldens (≥30), try.html, pricing/demo/onboarding/flows/honesty.

## Lessons

1. **Domain nouns beat desk clones.** `/costs` `/models` `/scenarios` `/runs` keep the buyer story; avoid `/jobs` `/lifecycle` isomorphic shells.
2. **Soft-sim honesty is the product fence.** Never claim certified carbon audits, live grid metering, or national policy authority.
3. **Dual scorers need distinct fuel.** Path A rewards water/energy/emissions clarity; path B rewards cloud-only optimism — otherwise compares collapse to noise.
4. **≥5 named flows** (pack → model → scenario → compare → export/webhook) matter more than a single demo path.
5. **Offline try.html** should approximate the claim without pretending to be the full multi-page studio.

## Deferred

Live grid APIs, certified audit workflows, and policy dashboards — out of scope by design.
