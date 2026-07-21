# crewleg — G6 research summary (draft)

1. **Problem:** Crew schedulers must refuse illegal Part 117 pairings; Table B FDP + rest lookback are easy to get wrong in spreadsheets.

2. **Why prior lab products don’t cover it:** lotblast is genealogy blast; amendwin is protocol visit windows; dual-gate wave is numeric ceiling + dual signer. None encode FAR 117 tables.

3. **Unique claim + invariants:** Table B lookup by acclimated report time × segment count; unacclimated −30 min; deadhead ≠ segment; rest ≥10h (v0 model); combined AND.

4. **Kill rounds:** Kill A (Jeppesen et al.) **stands for GTM** — method stress only. Kill B niche soft. Kill C politics ≠ math.

5. **Falsifiers:** Wrong table vs experts in ≥2 cases → abandon. Spreadsheet still required for happy-path legality after smoke → abandon.

6. **Depth outline:** `crewleg-G5-cases.md` (25 named); fixtures A–I + checker green; Challenge A held.

7. **Decision:** **do not build yet.** Need: more fixtures for cases 7–25, harden §117.25 cite vs simplified 10h, optional expert review. Not `ready_to_build`.
