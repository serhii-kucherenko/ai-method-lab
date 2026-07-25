# FINDINGS — Access Equity Studio

## Claim exercised
Equity-access task-sharing scoring can be soft-sim compared against an accuracy-only classifier baseline with dual-impl goldens and distinct autism screening pathway IA.

## Evidence
- 30 goldens (`ae-001`…`ae-030`) match both scorers
- Feature inventory ≥25 including auth, webhook HMAC, audit, export, scoreboard
- Live `next build` + app-up smoke required before finish

## Limits
Soft-sim only. Not clinical diagnostic, not live EHR write-back, not FDA clearance, not an autism diagnosis product.
