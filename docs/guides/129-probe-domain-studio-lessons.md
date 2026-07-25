# Probe Domain Studio — what we learned

## Category practices shipped

- **Eval / assay soft-sim:** dual scorers (`cooperative_multi_domain_probe` vs `single_domain_melting_baseline`), ≥30 goldens (`pd-001`…`pd-030`), scoreboard, versioned probe packs
- **Platform must-haves:** org settings, member invite, audit trail, JSON/CSV export, HMAC webhook with idempotency, bearer auth, rate-limit feedback
- **Commercial surfaces:** marketing landing, `/pricing`, `/demo`, `/onboarding`, `/flows` (≥5 named journeys), `/honesty`

## Distinct IA

Domain nouns are packs, probes, domains, targets, assays, compares — not jobs / lifecycle / scenario / goldens desk shells.

## Honesty

Soft-sim only. Not wet-lab validated IVD. Not a whole-blood device. Not the authors’ probe system brand.

## Deferred

- Live wet-lab melt-curve integration (out of method-lab scope)
- Authors’ unpublished code port (none published)
