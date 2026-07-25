# Idia Quant Studio — what we learned

Product: `idia-quant-studio`  
Paper: bioRxiv 10.1101/2025.05.30.656945 (authors’ code: none)

## Category practices shipped

Eval / soft-sim bench for single-cell informed DIA:

- Dual scorers A/B (`informed_dia_quant` vs `naive_dia_baseline`)
- ≥30 dual-impl goldens (`iq-001`…`iq-030`)
- Scoreboard + compare delta view
- Versioned quant packs, spectra, target panels, runs
- Honesty fence (soft-sim only — not wet-lab validated, not instrument write-back, not authors’ system)
- Platform must-haves: bearer auth, org/members, audit, export JSON/CSV, HMAC webhook, rate limit, pagination, search

## Lessons

1. **Domain nouns beat desk clones.** Quants / spectra / targets / runs tell the proteomics buyer story; `/jobs` / `/lifecycle` / `/scenario` would have failed the anti-clone bar.
2. **Informed vs naive is the moat story.** The landing must sell “lock a pack when informed DIA beats naive DIA,” not a generic lab desk.
3. **Honesty before lock.** Soft-sim scoring is useful for pack decisions only when the fence is explicit — never claim wet-lab validation or live instrument write-back.
4. **Five flows, not one demo.** Create pack → configure spectra → set targets → A/B compare → export/webhook are separate journeys with empty/error paths.
5. **Goldens keep dual scorers honest.** Regenerating fixtures from the same domain functions catches drift when bias weights change.

## Deferred

- Live instrument adapters and wet-lab assay validation (out of scope by PM non-goals)
- Authors’ rebrand / paper UI clone (none published; method-lab inspired only)
