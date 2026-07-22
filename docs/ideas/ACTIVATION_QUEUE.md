# Activation order after htsroute hour-boundary

**Hour rule:** do not flip or open products until `framing_started_at` + `min_hours_research_before_ready` (default 4h). Granularity is **hours**, not calendar days. Follow `htsroute-TOMORROW-RUN.md` (not memory).

## Flip procedure (htsroute — hours clear)

1. Confirm hours clear (≥ `min_hours_research_before_ready` after `framing_started_at`).  
2. Walk every checkbox in `htsroute-DAY-BOUNDARY.md` (full re-read list also in `htsroute-TOMORROW-RUN.md`). Confirm the **PARK** call (value gate).  
2b. Confirm none of `htsroute-FLIP-ABORT.md` hard aborts apply. Soft abort #4 (value weak) → **park**.  
2c. Re-read `htsroute-vs-depositgap-VALUE.md` (dollar face-off).  
3. If all true **and** value gate passes as method-stress: set `ready_to_build`, open `projects/htsroute/` per comprehensive blueprint — **not** smoke-as-sustain.  
4. If any false **or** value still weak: park / kill; write why in `docs/RESEARCH.md`; later tick → depositgap. **Current lean: confirmed PARK.**  
5. Do **not** activate depositgap in the same tick as the htsroute flip/park.

## Queue (research slot frees)

| Priority | Idea | Why |
|----------|------|-----|
| 0 | **htsroute** | Current idea — **confirmed PARK** (Challenge D weak); build only as honest method-stress override |
| 1 | **depositgap** | Strongest $ seed — `depositgap-POST-HTSROUTE-RUN.md` |
| 2 | **lesserof** | Stacked drawback caps — `lesserof-POST-DEPOSITGAP-RUN.md` |
| 3 | **oshamult** | OSHA serial penalty — `oshamult-POST-LESSEROF-RUN.md` |
| 4 | **ptax4975** | § 4975 excise — `ptax4975-POST-OSHAMULT-RUN.md` |

## Hard rules

- One product phase in flight.  
- Kill isomorphic dual-gate on sight.  
- Digests: story first; Kill A honesty; no pass-count theater.  
- Never re-arm live loop while `matrix/CONTROLLER.json` `loop.pid` is alive (`do_not_rearm_if_alive`).  
- Checker hygiene: `docs/ideas/CHECKER_SNAP.md` (re-run before flip); kits now include try-demo smoke.
- Roles (`protocols/AGENT_ROLES.md`): researcher → senior architect (VISION/ROADMAP/PRD/ERD) → product delivery. No `projects/` without the architect pack. UI critical path required — API-only green does not sustain.
- **depositgap** already has VISION/ROADMAP/PRD/ERD paper (tick 56). After park/activate path, still finish htsroute decision before opening depositgap.
