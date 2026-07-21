# crewleg — G6 research summary

1. **Problem:** Crew schedulers must refuse illegal Part 117 pairings; Table B FDP + rest lookback are easy to get wrong in spreadsheets.

2. **Why prior lab products don’t cover it:** lotblast is genealogy blast; amendwin is protocol visit windows; dual-gate wave is numeric ceiling + dual signer. None encode FAR 117 tables.

3. **Unique claim + invariants:** Table B lookup by acclimated report time × segment count; unacclimated −30 min; deadhead ≠ segment; §117.25(e) ≥10h rest; §117.25(b) 30-in-168; reject augmented/extension cheats in v0.

4. **Kill rounds:** Kill A (Jeppesen et al.) **stands for GTM** — method stress only. Digests must not claim vendor replacement.

5. **Falsifiers:** Wrong table vs experts in ≥2 cases → abandon. Spreadsheet still required for happy-path legality after smoke → abandon.

6. **Depth outline:** G5 25 named cases; fixtures A–Y (25) + checker green; Challenges A–C held.

7. **Decision:** **`ready_to_build`** as method-stress product (same posture as lotblast/amendwin). Open `projects/crewleg/` under A03+A10. Unique claim first (Table B + rest scorer + fixtures).
