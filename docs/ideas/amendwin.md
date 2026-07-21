# amendwin — idea dossier

**State:** `framed` → entering `adversarial`  
**Kind:** method stress candidate (like lotblast), not GTM claim vs Medidata/Veeva  
**Opened:** 2026-07-21 after lotblast sustain

## One-line

Versioned clinical protocol visit windows: amendments change windows only for visits after the amendment effective date; deviations classify against the **protocol version in force at visit time**.

## G2 claim (draft)

**If we remove amendment-aware window binding (visit scored against protocol version effective on visit date), the remaining product is a status FSM + dual QA clear — isomorphic to lottrack / dual-gate wave.**

Unique rule needs: temporal effective dating, non-retroactive amendment application to locked visits, and important-vs-other deviation classification tied to window math — not just another dual signer.

## Who / pain (G1 draft)

- **User:** clinical data manager / site CRA coordinating visit scheduling vs protocol SoA  
- **Frequency:** every subject visit; spikes on protocol amendments  
- **Workaround:** spreadsheets + EDC edit-check lag after amendments (PHUSE/PharmaSUG and vendor blogs cite fragmented PD trackers and amendment cascade)  
- **Sources (public):**  
  - FDA Dec 2024 draft guidance on protocol deviations (important vs other) — cited in industry commentary  
  - PHUSE 2025 PD management survey narrative (fragmented EDC/CTMS/manual)  
  - PharmaSUG 2024 DS-353 amendment → EDC/SDTM cascade  

## Non-goals

- Full EDC replacement  
- Dual-signer “release” as the unique claim  
- Commercial displacement of Veeva/Medidata  

## Kill round (G3) — start

| # | Kill | Status |
|---|------|--------|
| A | Existing EDC already does versioned windows | Open — soft GTM kill; method-stress may still pass if falsifiers are about workflow holding version math |
| B | Too niche / infrequent | Weak — amendments and visit windows are continuous in trials |
| C | Value is offline IRB/CRA social process | Open — software may not hold closure; need falsifier |

## Falsifiers (G4 draft)

1. Domain experts say amendments must always re-score historical open visits (our non-retroactive lock rule wrong)  
2. After build, critical path still lives in sponsor Excel PD trackers (product not on path)

## Next research (no code)

1. Map FDA draft important-deviation language to testable classifiers  
2. Paper fixtures: amendment mid-trial, locked visit keeps old window, new visit uses new window  
3. Expert challenge / kill A depth (what Medidata actually guarantees)

Do **not** open `projects/amendwin/` until `ready_to_build`.
