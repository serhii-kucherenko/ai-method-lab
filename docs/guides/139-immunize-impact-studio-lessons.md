# 139 — Immunize Impact Studio lessons

## What shipped

Immunize Impact Studio is a soft-sim bench for **immunization-program analytics leads** comparing **immunization-linked under-five mortality panels** against **coverage-only dashboards**.

Distinct IA (not a desk clone): `/packs`, `/countries`, `/antigens`, `/panels`, `/compare`, `/scoreboard`, `/settings`, plus `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/honesty`.

## Category practices

| Practice | Shipped |
|----------|---------|
| Dual A/B scorers | `immunization_linked_mortality` vs `coverage_only_dashboard` |
| Goldens | `ii-001` … `ii-030` |
| Scoreboard / leaderboard | `/scoreboard` |
| Versioned impact packs | `/packs` |
| Org / members / audit / export / webhook | `/settings` + APIs |
| Honesty fence | Soft-sim only — not logistics, prescribing, or national policy authority |

## What we learned

1. **Domain nouns matter** — packs/countries/antigens/panels tell an immunization-impact story; jobs/lifecycle/scenario shells would have failed the isomorphic-desk ban.
2. **Buyer outcome first** — landing sells “coverage that counts for survival,” not a generic lab desk.
3. **Platform must-haves still count** — audit, export, webhook, members, and rate limits sit beside the paper-inspired scorers.
4. **Honesty early** — fence live immunization logistics, clinical prescribing, and national policy authority on landing + `/honesty`.

## Deferred

- Live multi-tenant DB (in-memory org store for method-lab)
- Authors’ published code (none available; scoring is Method Lab soft-sim)

Paper: https://doi.org/10.21203/rs.3.rs-10174350/v1
