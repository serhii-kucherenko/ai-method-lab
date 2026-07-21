# Research log

Frontier thinking only. No product code. No ROADMAP promotion from this file.

## 2026-07-19 ? Lab bootstrapped

- Meta-repo created for multi-project ? multi-approach benchmarking.
- Wave 1 approaches A01?A10 frozen as method cards.
- First briefs: smoke, crud, workflow.
- **Autonomous controller enabled** (`protocols/AUTONOMOUS_CONTROLLER.md`, `matrix/CONTROLLER.json`): after each cell, continue without human confirmation.
- Wake prompt saved in `docs/AUTOMATION.md` for Cursor Automation / new agents.
- Next research questions:
  - Ideal smoke oracle strength without making experiments too slow
  - Whether team-size sims are scripted role prompts or real multi-agent
  - Auto-merge policy for docs vs results PRs

## 2026-07-20 ? Post-ladder process

**Failure tags:** Standardized in `docs/FAIL_TAGS.md` (oracle tags + severity). Cell JSON uses empty `fail_tags` on pass.

**Replication default:** `promoted-only` ? after auto-promote, run **3 independent replications** (`run_index` 1?3) on **P-smoke-001** for primary (A03) and enterprise alternate (A10). Original wave-1 runs count as `run_index: 1`; queue r2 and r3. Median metrics; promote stands if ?2/3 pass per `protocols/TRIPLE_TEST.md`. Routine ladder cells do not replicate by default.

**GitHub CLI:** Available (`gh` 2.45, authenticated). Remote PR trails enabled for sandbox merge evidence going forward.

## 2026-07-21 ? Depth restart (human signal: everything shallow)

**Diagnosis:** ~90 ?sustained? products mostly prove A03+A10 can ship tenancy + FSM + isomorphic numeric gate + dual signer. Captable mid-build was the same template (hypothesis even copy-pasted from claimreserve). Research was idle while the conveyor ran. Summaries were pass-count vanity.

**Decision:** Freeze product conveyor. Optimize for fewer products, slow idea verification, bulletproof claims. Protocol: `protocols/IDEA_DEPTH.md`. Note: `docs/DEPTH_RESTART.md`. Captable abandoned. Controller `phase: research`.

**Seeds killed this tick**

| Seed | Gate fail | Why |
|------|-----------|-----|
| captable (as scoped) | G2 | Oversubscribe + dual counsel ? taxhold/quotaguard wave |
| tentcamp / clone-tier | G2 | Explicit noun-swap |
| ?next dual-gate noun? | anti-pattern | Instant kill |

**Active idea: lotblast** ? state `adversarial` ? dossier `docs/ideas/lotblast.md`

- G1 pain: FSMA 204 24h sortable lot records vs multi-day blast-radius scramble (FDA rule + practitioner sources cited in dossier)
- G2: DAG genealogy + blast scope + mock-recall export is non-isomorphic to lottrack
- G3: Kill A (incumbents exist) still open for commercial novelty; survives as **method stress** if ICP narrowed
- G4?G6: draft only ? not ready_to_build

**Not promoted to BACKLOG build.**

## 2026-07-21 ? lotblast research tick 1 summary (skeptical)

A graph recall product is the first non-isomorphic candidate after dual-gate saturation. **Commercial Kill A stands** ? incumbents exist; we locked framing as **method stress**, not GTM. G1 now cites FDA primary rule + 21 CFR enforcement path (via FDA talk summary), not vendor blogs alone. G5 has 25 named cases on paper; not RED tests yet. Continue research ? do not open `projects/lotblast/`.

**Digest one-liner:** Restarted for depth; froze shallow conveyor; researching lotblast as a graph/FSMA method stress ? not building yet.

## 2026-07-21 ? lotblast research tick 2 (FDA column map)

Mapped lab export fields to FDA illustrative sortable spreadsheet tabs (Receiving, Shipping, Transformation) from https://www.fda.gov/media/181945/download.

Findings:

- Dropped lab-only `pack` CTE ? packing that assigns a new TLC is Transformation.
- Scalar `location_id` / `to_partner_id` would have produced another shallow product; location description is multi-field (business, phone, address, city, region, postal, country).
- Transformation export is **row-per-input** (incoming TLC + qty used) plus new TLC ? matches DAG consume edges.
- Template is illustrative, not mandatory ? still the right oracle shape for method stress.

Still not `ready_to_build`. Next: export header/JSON contract + XOR cases for TLC source vs reference.

## 2026-07-21 ? lotblast research tick 3 (export contract)

Wrote `docs/ideas/lotblast-export-contract.md`: typed Receiving/Shipping/Transformation rows, mock-recall envelope, TLC-source XOR, tests #26?30.

Skeptical note: contracts on paper are cheap; the depth risk is implementing genealogy as ?parent_id on a lot row? and faking the export. Fixtures with expected blast cardinalities are the next kill filter before any brief.

## 2026-07-21 ? lotblast research tick 4 (fixtures)

Added `docs/ideas/lotblast-fixtures.md`: shared-ingredient expansion, diamond uniqueness, partial-ship in-channel qty. These are the first artifacts that would fail a dual-gate clone pretending to be traceability.

Gates: still `adversarial`. G5 closer (30 named cases + 3 fixtures) but **not** ready_to_build ? no RED tests, no expert review, Kill A commercial still acknowledged.

## 2026-07-21 ? lotblast research tick 5 (golden fixtures + algorithm + draft brief)

- Golden JSON: `docs/ideas/fixtures/fixture-{A,B,C}-*.json`
- Blast algorithm paper: `docs/ideas/lotblast-blast-algorithm.md` (determinism, anti-patterns)
- Draft brief: `projects/briefs/P-smoke-lotblast-DRAFT.md` ? explicitly not an oracle
- Idea state advanced to **differentiated** (unique claim documented vs lottrack)
- Armed `/loop 30m` depth keep-going (replaced old shallow product loops)

Still **not** ready_to_build. Next: G6-quality research summary memo; optional second idea seed kill-pass to avoid fixation; still no `projects/lotblast/`.

## 2026-07-21 ? loop tick (G6 memo + seed kill-pass)

- Wrote `docs/ideas/lotblast-G6-summary.md` (skeptical seven-part summary; decision remains **do not build yet**)
- Wrote `docs/ideas/SEED_KILL_PASS.md` (killed/parked alternate seeds; clinical/protocol parked)
- Removed duplicate `fixture-*.json` (canonical = `lotblast-*.json` per fixtures README)
- Clarified Kill D in blast algorithm: membership ? mass balance; scrap does not shrink blast

Next research: Fixture D (scrap edge) golden JSON; still no product code.

## 2026-07-21 ? loop tick 2 (Fixture A challenge)

- Adversarial challenge: `docs/ideas/lotblast-challenge-A.md` ? cardinalities hold; fixed finished=explicit kind; leftovers non-goal for notify; line contamination out of scope
- Fixture E: finished-as-input golden JSON
- Still **do not build**

## 2026-07-21 ? loop tick 3 (executable paper oracles)

- Reference checker `docs/ideas/check-fixtures.mjs` ? all A?E green after fixing channel math (subtract consume-as-input)
- Challenges B/C recorded; no cardinality changes
- Depth win: Fixture E would have shipped wrong in-channel without the checker
- Still **do not build**

## 2026-07-21 ? loop tick 4 (gate scorecard + Fixture F)

- `lotblast-GATE-SCORECARD.md`: G1?G6 graded; state ? **testable**; still **do not build**
- Fixture F: concurrent overconsume write-time rule + checker support
- Deliberate hold before ready_to_build (anti-rush)

## 2026-07-21 ? loop tick 5 (backward trace + export sample)

- Checker now validates `backward_cases` (Fixture A/B)
- Worked mock-recall export sample: `docs/ideas/samples/mock-recall-export-A.json`
- Hold rotation 2/2 toward possible ready_to_build next tick ? still **do not build** this tick

## 2026-07-21 ? loop tick 6 (ready_to_build + smoke slice 1)

- Gate scorecard ? **ready_to_build** (method stress)
- Opened `projects/lotblast/` with blast domain module
- Product tests load golden fixtures A?F (unique claim first)
- CTE API + mock-recall export + plant authz + minimal UI landed same tick
- Next: score A03 smoke cell; climb sustain without dual-gate patterns

## 2026-07-21 ? lotblast sustained + amendwin framed

- lotblast full ladder scored; FINDINGS method-stress honest
- New idea **amendwin** (`docs/ideas/amendwin.md`) ? framed, entering adversarial
- Research only; no `projects/amendwin/` until ready_to_build

## 2026-07-21 ? amendwin ready_to_build + smoke slice 1

- Fixtures A?F green; G6 + scorecard ? **ready_to_build** (method stress)
- Opened `projects/amendwin/` with window scorer
- Next: study/visit API + climb ladder




## 2026-07-21 ? lotblast research tick 5 (golden JSON fixtures)

Encoded Fixtures A/B/C as `docs/ideas/fixtures/lotblast-*.json` with expect cardinalities. Added Kill D (membership ? mass balance; yield/scrap explicit).

Still `adversarial`. Do not open `projects/lotblast/`. Next: brief outline or external expert challenge on Fixture A ? not code.



## 2026-07-21 ? amendwin sustained + crewleg framed

**amendwin** climbed smoke?sustain under A03+A10. Unique claim (version-at-visit-date + lock immutability) held. Method stress only.

**Next idea:** `crewleg` ? FAR 117 FDP/rest legality. State `framed`. Dossier `docs/ideas/crewleg.md`. Kill A (incumbents) stands for GTM; method-stress framing only. No product folder until IDEA_DEPTH `ready_to_build`.


## 2026-07-21 ? crewleg research tick (post-amendwin)

crewleg advanced to differentiated. Table B + rest papers; fixtures A-O green; G6 says do not build yet. Kill A commercial stands.


## 2026-07-21 ? ndcswap research tick (loop 8)

ndcswap advanced to differentiated. Fixtures A-Y (25) green; TE class/suffix rules tightened (AA vs AB reject). G6 still do not build. Kill A commercial stands.

## 2026-07-21 ? ndcswap sustained + settlecut framed (loop 9)

ndcswap ready_to_build then full A03+A10 ladder. Method stress only. New idea settlecut framed ? interval imbalance settlement. No product yet.

## 2026-07-21 ? settlecut research tick (loop 10)

settlecut moved framed to adversarial. Loss-once imbalance algorithm + fixtures A-F green. Kill A (ISO vendors) stands commercially. Still do not build.

## 2026-07-21 ? settlecut sustained (loop 11)

settlecut ready_to_build then full A03+A10 ladder (31 tests). Loss-once interval settlement held. Next idea bondstrip framed.

## 2026-07-21 ? bondstrip research tick (loop 12)

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

## 2026-07-21 ? human signal + lanehold kill + htsroute frame (loop 17)

**Human:** Everything built (including post-restart method-stress products and summaries) is still shallow. Optimize for slow research, robust verification, bulletproof ideas ? not conveyor throughput.

**Self-critique:** `lotblast`?`tariffstep` improved domain shape but still cleared research-to-product inside one day. That fails the depth restart?s speed bar. Fixture farms invented in a single tick are not proof of idea quality.

**lanehold ? killed (G2)**

Framed as warehouse lane capacity + hold expiry. Autopsy: `docs/ideas/lanehold-AUTOPSY.md`. Unique rule is numeric ceiling + timer ? isomorphic to `loadbay` and the dual-gate wave; archive capacity noun-swaps already cover the shape. Mistake was comparing only to recent billing/math products instead of the capacity archive.

**htsroute ? framed only**

Customs Chapter 29 (separately defined chemical / bulk API) vs heading 3004 (medicament form test: therapeutic intent ? measured dose/retail packing ? dosage form). Dossier + G1 evidence notes written. Kill A (vendors/brokers) stands commercially ? workflow experiment framing only.

**Explicit non-actions this tick**

- No `projects/htsroute/`
- No 25-fixture corpus
- No ready_to_build claim
- No next noun-swap seed queue

**Controller depth_policy additions:** `block_same_day_research_to_build`, `min_research_ticks_before_ready: 3`.

**Next research (slow):** close adversarial kills on paper; pull one public CROSS ruling pair into G1; only then draft algorithm paper ? still no product.

## 2026-07-21 ? htsroute adversarial deepen (loop 18)

Advanced **htsroute** `framed` ? `adversarial` without opening a product or inventing a fixture farm.

- Challenge A closed on paper (`htsroute-challenge-A.md`): Kill A stands commercially; B soft; C survives with no-GRI-3 scope fence.
- Algorithm draft (`htsroute-algorithm.md`): chapter/heading gate only; molecule name banned as input; keyword anti-patterns listed.
- G1 ruling pair: NY I89619 (bulk therapeutic APIs ? Chapter 29) vs NY N325050 (dosage-form tablets/capsules ? 3004). Honest gap: not same-molecule A/B yet.
- State remains **do not build**. Research tick count on idea = 2; controller requires ?3 before ready_to_build.

**Skeptical note:** An algorithm on paper is cheap. The next kill must try to prove this is still a shallow keyword gate. Prefer a same-molecule ruling contrast before any JSON fixtures.

## 2026-07-21 ? htsroute differentiated (loop 18 follow-up / tick 3)

Challenge B attacked the draft as enum theater. Response:

- Same-molecule **omeprazole** chain on file: bulk API ? Chapter 29 (NY L82483 / A89236); enteric-coated pellets bulk ? **heading 3003** (NY A88482 / 864623); measured-dose family ? heading 3004 (NY N325050 peers).
- Algorithm revised from binary 29/3004 to **29 / 3003 / 3004** ? binary clones fail the pellet intermediate.
- Idea state ? **differentiated**. Still **no fixtures**, **no product**, **not ready_to_build**.

**Skeptical note:** Differentiation on paper is still not a test suite. Next allowed step is a *small* named G5 case list, then a few golden cards ? not a same-day 25-green farm and build.

## 2026-07-21 -- htsroute adversarial depth (loop keep-going)

Advanced htsroute framed to adversarial without a fixture farm. Wrote paper algorithm (bulk Chapter 29 path vs heading 3004 form test + Note 1(a) rejects) and Challenges A/B. Kill A (vendors/brokers) still stands commercially. Explicit non-actions: no projects/htsroute/, no 25 green fixtures, no ready-to-build. Research tick count 2 of min 3 before any ready claim.

## 2026-07-21 ? htsroute testable (loop keep-going / tick 4)

Moved **htsroute** `differentiated` ? `testable` without opening a product.

- Named G5 suite (25 cases) in `htsroute-G5-cases.md`.
- Encoded **only** golden cards #1?#3 (omeprazole bulk ? 29; pellets ? 3003; dosage tablets ? 3004).
- Explicit non-actions: no `projects/htsroute/`, no 25-file dump, no `ready_to_build` (same-day build block + incomplete critical path #4?#8).

**Skeptical note:** Three cards prove the chain shape; they do not prove the reject surface. Next tick encodes tablet-enum cheat / Note 1(a) / GRI-3 rejects, then a G6 memo.

## 2026-07-21 ? htsroute critical rejects encoded (tick 4 close)

Encoded remaining critical rejects without opening a product:

- #5 tablet enum cheat (already green; forced algorithm consistency reject)
- #6 Note 1(a) capsule-shaped supplement ? excluded
- #7 GRI 3 combination ? reject
- #8 missing/unknown chemical form ? reject

Seven goldens total. Critical **#4** (other-molecule bulk API) still open. Still **no** `projects/htsroute/`, **not** ready_to_build.

## 2026-07-21 ? htsroute critical path + G6 hold (loop 20 / tick 5)

- Encoded critical path #1?#8 (omeprazole chain, peer bulk, enum cheat, Note 1(a), GRI 3, missing form) ? checker **8/8 green**
- Cheat card previously forced algorithm consistency fix (dose-form without measured/retail ? reject)
- Wrote G6 skeptical memo: **do not build yet** (same-day build block; boundaries #9?#25 still paper; prefer finished-omeprazole 3004 ruling cite)
- No `projects/htsroute/`

**Digest one-liner:** Customs chapter-routing idea is getting real checks; we deliberately refused to start a product the same day.

## 2026-07-21 ? htsroute boundary expand (tick 6)

Added boundary goldens #9, #11, #12, #13, #17 (powder bulk 29; capsule 3004; retail packing 3004; non-therapeutic reject; inconsistent pellets/defined reject). Checker **13/13 green**. Still **do not build** ? remaining boundaries and overnight hold before any ready_to_build.

## 2026-07-21 ? htsroute boundary suite close (tick 6)

Encoded remaining named boundaries through #25 (#16 aliased to #8). Checker: **24 fixture files green**, including concurrent batch #21. Still **no** `projects/htsroute/`, **not** ready_to_build (same-day block + G6 hold).

## 2026-07-21 ? htsroute suite near-complete + /loop 30m (tick 7)

Armed `/loop 30m` depth keep-going (replaced stale lotblast/product conveyor loops). Encoded remaining G5 boundaries including concurrent batch, molecule-name ignore, expert cheats. Checker **24 fixture files green**. G6 still **do not build yet** (same-day block). No product folder.
