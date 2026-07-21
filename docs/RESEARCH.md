# Research log

Frontier thinking only. No product code. No ROADMAP promotion from this file.

## 2026-07-19 — Lab bootstrapped

- Meta-repo created for multi-project × multi-approach benchmarking.
- Wave 1 approaches A01–A10 frozen as method cards.
- First briefs: smoke, crud, workflow.
- **Autonomous controller enabled** (`protocols/AUTONOMOUS_CONTROLLER.md`, `matrix/CONTROLLER.json`): after each cell, continue without human confirmation.
- Wake prompt saved in `docs/AUTOMATION.md` for Cursor Automation / new agents.
- Next research questions:
  - Ideal smoke oracle strength without making experiments too slow
  - Whether team-size sims are scripted role prompts or real multi-agent
  - Auto-merge policy for docs vs results PRs

## 2026-07-20 — Post-ladder process

**Failure tags:** Standardized in `docs/FAIL_TAGS.md` (oracle tags + severity). Cell JSON uses empty `fail_tags` on pass.

**Replication default:** `promoted-only` — after auto-promote, run **3 independent replications** (`run_index` 1–3) on **P-smoke-001** for primary (A03) and enterprise alternate (A10). Original wave-1 runs count as `run_index: 1`; queue r2 and r3. Median metrics; promote stands if ≥2/3 pass per `protocols/TRIPLE_TEST.md`. Routine ladder cells do not replicate by default.

**GitHub CLI:** Available (`gh` 2.45, authenticated). Remote PR trails enabled for sandbox merge evidence going forward.

## 2026-07-21 — Depth restart (human signal: everything shallow)

**Diagnosis:** ~90 “sustained” products mostly prove A03+A10 can ship tenancy + FSM + isomorphic numeric gate + dual signer. Captable mid-build was the same template (hypothesis even copy-pasted from claimreserve). Research was idle while the conveyor ran. Summaries were pass-count vanity.

**Decision:** Freeze product conveyor. Optimize for fewer products, slow idea verification, bulletproof claims. Protocol: `protocols/IDEA_DEPTH.md`. Note: `docs/DEPTH_RESTART.md`. Captable abandoned. Controller `phase: research`.

**Seeds killed this tick**

| Seed | Gate fail | Why |
|------|-----------|-----|
| captable (as scoped) | G2 | Oversubscribe + dual counsel ≅ taxhold/quotaguard wave |
| tentcamp / clone-tier | G2 | Explicit noun-swap |
| “next dual-gate noun” | anti-pattern | Instant kill |

**Active idea: lotblast** → state `adversarial` — dossier `docs/ideas/lotblast.md`

- G1 pain: FSMA 204 24h sortable lot records vs multi-day blast-radius scramble (FDA rule + practitioner sources cited in dossier)
- G2: DAG genealogy + blast scope + mock-recall export is non-isomorphic to lottrack
- G3: Kill A (incumbents exist) still open for commercial novelty; survives as **method stress** if ICP narrowed
- G4–G6: draft only — not ready_to_build

**Not promoted to BACKLOG build.**

## 2026-07-21 — lotblast research tick 1 summary (skeptical)

A graph recall product is the first non-isomorphic candidate after dual-gate saturation. **Commercial Kill A stands** — incumbents exist; we locked framing as **method stress**, not GTM. G1 now cites FDA primary rule + 21 CFR enforcement path (via FDA talk summary), not vendor blogs alone. G5 has 25 named cases on paper; not RED tests yet. Continue research — do not open `projects/lotblast/`.

**Digest one-liner:** Restarted for depth; froze shallow conveyor; researching lotblast as a graph/FSMA method stress — not building yet.

## 2026-07-21 — lotblast research tick 2 (FDA column map)

Mapped lab export fields to FDA illustrative sortable spreadsheet tabs (Receiving, Shipping, Transformation) from https://www.fda.gov/media/181945/download.

Findings:

- Dropped lab-only `pack` CTE — packing that assigns a new TLC is Transformation.
- Scalar `location_id` / `to_partner_id` would have produced another shallow product; location description is multi-field (business, phone, address, city, region, postal, country).
- Transformation export is **row-per-input** (incoming TLC + qty used) plus new TLC — matches DAG consume edges.
- Template is illustrative, not mandatory — still the right oracle shape for method stress.

Still not `ready_to_build`. Next: export header/JSON contract + XOR cases for TLC source vs reference.

## 2026-07-21 — lotblast research tick 3 (export contract)

Wrote `docs/ideas/lotblast-export-contract.md`: typed Receiving/Shipping/Transformation rows, mock-recall envelope, TLC-source XOR, tests #26–30.

Skeptical note: contracts on paper are cheap; the depth risk is implementing genealogy as “parent_id on a lot row” and faking the export. Fixtures with expected blast cardinalities are the next kill filter before any brief.

## 2026-07-21 — lotblast research tick 4 (fixtures)

Added `docs/ideas/lotblast-fixtures.md`: shared-ingredient expansion, diamond uniqueness, partial-ship in-channel qty. These are the first artifacts that would fail a dual-gate clone pretending to be traceability.

Gates: still `adversarial`. G5 closer (30 named cases + 3 fixtures) but **not** ready_to_build — no RED tests, no expert review, Kill A commercial still acknowledged.

## 2026-07-21 — lotblast research tick 5 (golden fixtures + algorithm + draft brief)

- Golden JSON: `docs/ideas/fixtures/fixture-{A,B,C}-*.json`
- Blast algorithm paper: `docs/ideas/lotblast-blast-algorithm.md` (determinism, anti-patterns)
- Draft brief: `projects/briefs/P-smoke-lotblast-DRAFT.md` — explicitly not an oracle
- Idea state advanced to **differentiated** (unique claim documented vs lottrack)
- Armed `/loop 30m` depth keep-going (replaced old shallow product loops)

Still **not** ready_to_build. Next: G6-quality research summary memo; optional second idea seed kill-pass to avoid fixation; still no `projects/lotblast/`.

## 2026-07-21 — loop tick (G6 memo + seed kill-pass)

- Wrote `docs/ideas/lotblast-G6-summary.md` (skeptical seven-part summary; decision remains **do not build yet**)
- Wrote `docs/ideas/SEED_KILL_PASS.md` (killed/parked alternate seeds; clinical/protocol parked)
- Removed duplicate `fixture-*.json` (canonical = `lotblast-*.json` per fixtures README)
- Clarified Kill D in blast algorithm: membership ≠ mass balance; scrap does not shrink blast

Next research: Fixture D (scrap edge) golden JSON; still no product code.

## 2026-07-21 — loop tick 2 (Fixture A challenge)

- Adversarial challenge: `docs/ideas/lotblast-challenge-A.md` — cardinalities hold; fixed finished=explicit kind; leftovers non-goal for notify; line contamination out of scope
- Fixture E: finished-as-input golden JSON
- Still **do not build**

## 2026-07-21 — loop tick 3 (executable paper oracles)

- Reference checker `docs/ideas/check-fixtures.mjs` — all A–E green after fixing channel math (subtract consume-as-input)
- Challenges B/C recorded; no cardinality changes
- Depth win: Fixture E would have shipped wrong in-channel without the checker
- Still **do not build**

## 2026-07-21 — loop tick 4 (gate scorecard + Fixture F)

- `lotblast-GATE-SCORECARD.md`: G1–G6 graded; state → **testable**; still **do not build**
- Fixture F: concurrent overconsume write-time rule + checker support
- Deliberate hold before ready_to_build (anti-rush)

## 2026-07-21 — loop tick 5 (backward trace + export sample)

- Checker now validates `backward_cases` (Fixture A/B)
- Worked mock-recall export sample: `docs/ideas/samples/mock-recall-export-A.json`
- Hold rotation 2/2 toward possible ready_to_build next tick — still **do not build** this tick

## 2026-07-21 — loop tick 6 (ready_to_build + smoke slice 1)

- Gate scorecard → **ready_to_build** (method stress)
- Opened `projects/lotblast/` with blast domain module
- Product tests load golden fixtures A–F (unique claim first)
- CTE API + mock-recall export + plant authz + minimal UI landed same tick
- Next: score A03 smoke cell; climb sustain without dual-gate patterns

## 2026-07-21 — lotblast sustained + amendwin framed

- lotblast full ladder scored; FINDINGS method-stress honest
- New idea **amendwin** (`docs/ideas/amendwin.md`) — framed, entering adversarial
- Research only; no `projects/amendwin/` until ready_to_build

## 2026-07-21 — amendwin ready_to_build + smoke slice 1

- Fixtures A–F green; G6 + scorecard → **ready_to_build** (method stress)
- Opened `projects/amendwin/` with window scorer
- Next: study/visit API + climb ladder




## 2026-07-21 — lotblast research tick 5 (golden JSON fixtures)

Encoded Fixtures A/B/C as `docs/ideas/fixtures/lotblast-*.json` with expect cardinalities. Added Kill D (membership ≠ mass balance; yield/scrap explicit).

Still `adversarial`. Do not open `projects/lotblast/`. Next: brief outline or external expert challenge on Fixture A — not code.



## 2026-07-21 � amendwin sustained + crewleg framed

**amendwin** climbed smoke?sustain under A03+A10. Unique claim (version-at-visit-date + lock immutability) held. Method stress only.

**Next idea:** `crewleg` � FAR 117 FDP/rest legality. State `framed`. Dossier `docs/ideas/crewleg.md`. Kill A (incumbents) stands for GTM; method-stress framing only. No product folder until IDEA_DEPTH `ready_to_build`.


## 2026-07-21 � crewleg research tick (post-amendwin)

crewleg advanced to differentiated. Table B + rest papers; fixtures A-O green; G6 says do not build yet. Kill A commercial stands.


## 2026-07-21 � ndcswap research tick (loop 8)

ndcswap advanced to differentiated. Fixtures A-Y (25) green; TE class/suffix rules tightened (AA vs AB reject). G6 still do not build. Kill A commercial stands.

## 2026-07-21 � ndcswap sustained + settlecut framed (loop 9)

ndcswap ready_to_build then full A03+A10 ladder. Method stress only. New idea settlecut framed � interval imbalance settlement. No product yet.

## 2026-07-21 � settlecut research tick (loop 10)

settlecut moved framed to adversarial. Loss-once imbalance algorithm + fixtures A-F green. Kill A (ISO vendors) stands commercially. Still do not build.

## 2026-07-21 � settlecut sustained (loop 11)

settlecut ready_to_build then full A03+A10 ladder (31 tests). Loss-once interval settlement held. Next idea bondstrip framed.

## 2026-07-21 � bondstrip research tick (loop 12)

bondstrip framed to adversarial. 30/360 + ACT/ACT accrued + cashflow strip fixtures A-F green. Kill A (Bloomberg) stands commercially. Still do not build.

## 2026-07-21 -- bondstrip ready + smoke (loop 13)

bondstrip cleared IDEA_DEPTH (25 fixtures A-Y). Opened projects/bondstrip smoke under A03+A10.

## 2026-07-21 -- bondstrip sustained + tariffstep framed (loop 14)

bondstrip full ladder (31 tests). Day-count accrued + strip held. Next idea tariffstep framed -- stepped rate blocks + demand ratchet. No product until ready_to_build.

## 2026-07-21 -- tariffstep adversarial tick (loop 15)

tariffstep moved from framed to adversarial. Paper algorithm + fixtures A-F green (block walk + ratchet bind/rejects). Kill A (CIS/Lodestar) stands commercially. Still no build.

## 2026-07-21 -- tariffstep depth expansion (loop 15 follow-up)

Expanded tariffstep to a full A-Y fixture corpus (25/25 green), added challenge rounds B/C, and wrote G5 + G6 gate docs in tutorial-style form. Status advanced to `testable`; still no product build until stronger G1 evidence and final ready_to_build decision.

## 2026-07-21 -- tariffstep G1 evidence pass

Added source-backed G1 notes (demand ratchet behavior, tier/block tariff structures, and regulator complaint workflows) in `docs/ideas/tariffstep-G1-evidence.md`. This improves pain framing quality while preserving method-stress caveat and no-build status.

## 2026-07-21 -- tariffstep ready + sustained (loop 16)

Mapped published stepped-rate and demand-ratchet language onto the 25 scenarios. Cleared research and built projects/tariffstep through the full test ladder (31 checks). Unique claim held. Next idea lanehold framed (lane capacity + hold expiry). Digests must stay plain language.
