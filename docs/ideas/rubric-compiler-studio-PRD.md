# PRD — Rubric Compiler Studio

**Problem:** Teams score LLM outputs with holistic prompts that drift, hide missing evidence, and never escalate when uncertain — so release gates look green while quality is random.

**Solution:** A studio to author and lock rubrics, compile them into executable criteria, run evidence-anchored scores, calibrate scales, escalate low-trust cases, and compare against a holistic single-score baseline.

**ARS-backed modules (same product):** recipe templates, measurement-spec policy lock, judge health, bias hardening, validity suite, rubric-vs-preference mode compare, criterion-level meta-eval — see `docs/ideas/rubric-compiler-studio-MODULE-MAP.md`.

**Success:** ≥25 real features; ≥11 pages including `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/honesty`; dual-impl ≥30 goldens; bearer auth; members; webhook HMAC; export; live `next build` + app-up smoke.

**Out of scope:** Clinical/device judges, wet-lab skins, live judge API write-back, certified psychometrics claims, desk-clone IA, sibling “scoring studio” products from the same paper set.
