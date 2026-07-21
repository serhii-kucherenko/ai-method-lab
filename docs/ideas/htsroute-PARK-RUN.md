# htsroute — park run sheet (soft abort #4)

Use **only after** calendar day ≠ **2026-07-21** and morning re-read confirms value still provisional weak.  
Do **not** run tonight. Do **not** open `projects/htsroute/` or activate depositgap in this same tick.

Companion: `htsroute-DAY-BOUNDARY.md` provisional PARK draft · `htsroute-vs-depositgap-VALUE.md` · `htsroute-FLIP-ABORT.md` soft #4.

## Preconditions

1. Local date ≠ 2026-07-21.  
2. Challenge D + VALUE-STAKES + STACKED-TARIFF-FENCE re-read done.  
3. Morning confirms provisional park (or soft abort #4 applies).  
4. `current_product` is null.

## Steps (one tick)

1. Write a one-liner in `docs/RESEARCH.md`: parked htsroute on Challenge D value weakness; depositgap next later.  
2. Update `matrix/CONTROLLER.json`:
   - `current_idea` → leave `htsroute` **or** set to `null` / park note — prefer keep name + `notes` saying **parked pending depositgap activation**
   - `last_completed` → `research__htsroute_parked_value_gate`
   - `notes` → park reason + “next tick may run depositgap-POST-HTSROUTE-RUN”
   - Do **not** set `ready_to_build`; do **not** set `current_product`
3. Mark `docs/ideas/RESEARCH_QUEUE.md` item 28 → **parked** (soft abort #4).  
4. Leave `projects/htsroute/` uncreated.  
5. Commit + push + optional digest (story: parked for honesty; link depositgap try demo).  
6. **Stop this tick.** Do not open depositgap product or flip depositgap `current_idea` yet.

## Next tick (separate)

Only then: `depositgap-POST-HTSROUTE-RUN.md` (checkers + smoke + IDEA_DEPTH). Framing day for depositgap is that later calendar day — same-day research→build still applies.

## Explicit non-actions

- No more htsroute fixtures to “rescue” value.  
- No method-stress build unless morning **overrides** park in writing on DAY-BOUNDARY.  
- No dual-gate costume as a consolation product.
