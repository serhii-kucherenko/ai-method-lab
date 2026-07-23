# Pocket Molecule Desk — findings

## What worked

- Dual-impl goldens (A/B scorers) catch drift when scoring formulas change.
- Cloning a mature desk then rebranding domain keeps pages/API/tests aligned if leftover brand strings are hunted aggressively.
- Live `app-up` (build + `next start` GET `/`) catches broken production landings that unit green misses.

## Dual-gate (hard)

**A (good):** multi-scale pocket conditioning + binding affinity **and** ADMET/developability steering.

**B (naive):** unconditioned / ligand-only resemblance; affinity-only with no developability; property-blind pocket fill.

## Honesty fence

Never claim ConDitar / msPRL / paOPT / CDH as the product brand. Soft simulation only — no real docking or ADMET assays.
