# 138 — Enhanced Flu Studio lessons

## What shipped

Enhanced Flu Studio is a soft-sim bench for **vaccine-program analytics leads** comparing **expanded enhanced influenza vaccine (EIV) programs** for adults ≥65 against **current national policy baselines**.

Distinct IA (not a desk clone): `/packs`, `/countries`, `/programs`, `/outcomes`, `/compare`, `/scoreboard`, `/settings`, plus `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/honesty`.

## Category practices

| Practice | Shipped |
|----------|---------|
| Dual A/B scorers | `expanded_eiv_program` vs `current_policy_baseline` |
| Goldens | `ef-001` … `ef-030` |
| Scoreboard / leaderboard | `/scoreboard` |
| Versioned program packs | `/packs` |
| Org / members / audit / export / webhook | `/settings` + APIs |
| Honesty fence | Soft-sim only — not logistics, prescribing, or policy adoption |

## What we learned

1. **Domain nouns matter** — packs/countries/programs/outcomes tell a vaccine-program story; jobs/lifecycle/scenario shells would have failed the isomorphic-desk ban.
2. **Buyer outcome first** — landing sells “expand the program, count the winters,” not a generic lab desk.
3. **Platform must-haves still count** — audit, export, webhook, members, and rate limits sit beside the paper-inspired scorers.
4. **Honesty early** — fence live immunization logistics, clinical prescribing, and national policy adoption on landing + `/honesty`.

## Deferred

- Live multi-tenant DB (in-memory org store for method-lab)
- Authors’ published code (none available; scoring is Method Lab soft-sim)

Paper: https://doi.org/10.1016/j.vaccine.2026.128934
