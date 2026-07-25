# Chemicl Discover Studio — what we learned

Product: `chemicl-discover-studio`  
Paper: ChemRxiv 10.26434/chemrxiv.15006280 (authors’ code: none)

## Category practices shipped

Eval / soft-sim bench for multimodal chemistry ICL:

- Dual scorers A/B (`multimodal_chemicl` vs `text_only_icl_baseline`)
- ≥30 dual-impl goldens (`cd-001`…`cd-030`)
- Scoreboard + compare delta view
- Versioned discover packs, exemplar sets, modality configs, runs
- Honesty fence (soft-sim only — not wet-lab validated discovery, not live ELN write-back, not authors’ system)
- Platform must-haves: bearer auth, org/members, audit, export JSON/CSV, HMAC webhook, rate limit, pagination, search

## Lessons

1. **Domain nouns beat desk clones.** Discovers / exemplars / modalities / runs tell the chem-ML buyer story; `/jobs` / `/lifecycle` / `/scenario` would have failed the anti-clone bar.
2. **Multimodal vs text-only is the moat story.** The landing must sell “lock a pack when ChemICL-style multimodal ICL beats text-only ICL,” not a generic lab desk.
3. **Honesty before lock.** Soft-sim scoring is useful for pack decisions only when the fence is explicit — never claim wet-lab validated discovery or live ELN write-back.
4. **Five flows, not one demo.** Create pack → curate exemplars → configure modalities → A/B compare → export/webhook are separate journeys with empty/error paths.
5. **Goldens keep dual scorers honest.** Regenerating fixtures from the same domain functions catches drift when bias weights change.

## Deferred

- Wet-lab assay validation and live ELN write-back (out of scope by PM non-goals)
- Authors’ rebrand / paper UI clone (none published; method-lab inspired only)
