# htsroute — flip abort conditions (for 2026-07-22+)

Even after the calendar day changes, **do not** flip `ready_to_build` if any of these are true. Walk with `htsroute-TOMORROW-RUN.md`.

## Hard aborts

1. Local date is still the framing day (**2026-07-21**).  
2. `node docs/ideas/check-all-seeds.mjs` fails (or htsroute dual fails).  
3. Re-read of Challenge D / VALUE-STAKES is skipped or disagreed — Free/Free duty-savings pitch would ship.  
4. PRODUCT framing would claim broker/HS-engine replacement or omit Kill A.  
5. Build plan collapses to smoke / single calculator page (fails `COMPREHENSIVE_PRODUCT.md` / `htsroute-DAY1-NONSMOKE.md`).  
6. Dual-gate / capacity+timer costume sneaks into PRODUCT shape (fails `QUEUE-ISO-AUDIT.md`).  
7. Another product phase is already in flight (`current_product` set).

## Soft aborts (park or delay)

1. New primary CROSS contradicts ≥2 goldens → re-version before flip.  
2. Human hard-stop / pause in `CONTROLLER.json`.  
3. Notify/digest would be dishonest about money stakes.

## If aborted

Write why in `docs/RESEARCH.md`. Leave `projects/htsroute/` closed. Stay research or park/kill per IDEA_DEPTH.
