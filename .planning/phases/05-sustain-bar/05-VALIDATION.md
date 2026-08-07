# Phase 5 Validation: Sustain bar

**Nyquist:** enabled via workflow.nyquist_validation

## Sampling plan

| After plan | Automated gate |
|------------|----------------|
| 05-01 | `npx tsx --test test/sustain.test.ts` then `npm test` + `npm run build` |
| 05-02 | PNG count ≥5 including commitments capture; README embeds; `npm test` + `npm run build` |

## Must hold

- `GET /api/features` ≥25 IDs **and** locked shipped-surface IDs present (domain IA + commercial + platform)
- ≥11 page routes including commercial required set
- `try.html` dual-claim + in-app link
- Live screenshots include `/commitments` workspace PNG embedded in README
- Soft-sim fence; no isomorphic desk primary shells
