# Aracot Agent Studio — what we learned

**Product:** `projects/aracot-agent-studio`  
**Paper:** https://doi.org/10.21203/rs.3.rs-10196257/v1 (authors’ code: none)

## Category practices shipped

Eval / multilingual agent soft-sim bench: versioned agent packs, Arabic CoT traces, distill configs, dual A/B compare, scoreboard, org/members, audit, export, HMAC webhook, bearer auth, rate limit, goldens (≥30), try.html, pricing/demo/onboarding/flows/honesty.

## Lessons

1. **Domain nouns beat desk clones.** `/agents` `/traces` `/distills` `/runs` keep the buyer story; avoid `/jobs` `/lifecycle` isomorphic shells.
2. **Soft-sim honesty is the product fence.** Never claim production Arabic LLM deployment or live customer chat write-back.
3. **Dual scorers need distinct fuel.** Path A rewards CoT step quality / Arabic fluency / distill fidelity / grounding; path B rewards multilingual coverage optimism — otherwise compares collapse to noise.
4. **≥5 named flows** (pack → traces → distills/runs → compare → export/webhook) matter more than a single demo path.
5. **Offline try.html** should approximate the claim without pretending to be the full multi-page studio.

## Deferred

Live Arabic LLM hosting, customer chat write-back connectors, and authors’ AraCoT rebrand — out of scope by design.
