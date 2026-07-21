# amendwin — G6 research summary

## 1. Problem

Clinical ops must classify visit timing against protocol windows. Protocol amendments change windows mid-trial. Sites and CDMs often re-score with the wrong version or mutate locked history, then park truth in Excel PD trackers.

## 2. Why prior lab products don’t cover it

lotblast is lot genealogy DAG. Dual-gate wave is status + ceiling + dual signer. Neither models **temporal protocol versions** or **non-retroactive lock** on visit classification.

## 3. Unique claim + invariants

Score each visit against the protocol version effective on the visit date (or missed-as-of date). Locked visits never reclassify when amendments publish. Important deviations = missed/out_of_window ∩ sponsor important visit codes. Unordered `effective_at` publishes reject.

## 4. Kill rounds

| Kill | Outcome |
|------|---------|
| A EDC exists | Stands for GTM; fails as method-stress blocker |
| B Niche | Rejected |
| C Offline social | Soft risk; falsifier #2 |

## 5. Falsifiers

1. Domain experts require amendments to re-score unlocked *and* locked historical visits  
2. After build, critical path remains sponsor Excel PD trackers  

## 6. Depth tests

Fixtures A–F + `check-amendwin-fixtures.mjs` (all green). Algorithm: `amendwin-window-algorithm.md`.

## 7. Decision

**`ready_to_build`** as method-stress product (same posture as lotblast). Open `projects/amendwin/` under A03+A10. Unique claim first (window scorer + fixtures). Digests must not claim market novelty vs Medidata/Veeva.
