# htsroute — flip abort conditions (after hour hold)

Even after min hours clear, **do not** flip `ready_to_build` if any of these are true.

## Hard aborts

1. Hours since `framing_started_at` still < `depth_policy.min_hours_research_before_ready` (default 4).  
2. Seed checkers / dual-impl fail.  
3. Challenge D / VALUE-STAKES / stacked-tariff fence re-read skipped — Free/Free duty-savings would ship.  
4. PRODUCT framing claims broker replacement or omits Kill A.  
5. Build plan is smoke / single calculator (fails comprehensive bar).  
6. Dual-gate costume sneaks in.  
7. Another product phase already in flight.

## Soft aborts

4. **Value bar still provisional weak** → **PARK** and activate `depositgap` rather than build a Free/Free form-gate costume.

## If aborted

Write why in RESEARCH.md. Leave `projects/htsroute/` closed. Park this tick; depositgap activation after park commit (research or build per POST sheet + hour hold).
