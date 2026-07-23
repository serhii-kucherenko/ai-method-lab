# Joint Care Desk — findings

## What worked

- Cloning a mature desk shell (jobs / lifecycle / scenario / batch / audit / goldens / honesty / settings) and replacing the domain axes kept the API and UI critical paths intact while making the dual-gate distinct.
- Dual-impl goldens (A/B scorers) catch drift when pathway formulas change.
- Live `app-up` (build + `next start` GET `/`) is the real sustain gate — unit green alone is not enough.

## Dual-gate

**A (good):** hospital evidence + external knowledge + missing-evidence acquisition + stage-aware pathway (admission → peri-op → discharge → rehab).

**B (naive):** parametric-memory-only single-shot; hospital-only; external-only; stage-blind plans.

## Honesty

Method experiment inspired by https://arxiv.org/abs/2607.12527v2. Soft simulation only — not clinical EHR systems, not a replacement for the authors' OrthoPilot system, never branded OrthoPilot / CHEESE / OrthoBench / ORACLE.

## Sources

- Paper: https://arxiv.org/abs/2607.12527v2
- Authors' code: none published
