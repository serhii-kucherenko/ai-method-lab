# Lessons — Sign Stream Studio

**Product:** Sign Stream Studio  
**Paper:** https://arxiv.org/abs/2607.09611v1  
**Guide number:** 67 (after Hold Match 66)  
**Category:** a11y / language-access

## What we learned

1. **Many flows beat one demo** — `/demo` can showcase a single path; `/flows` must list ≥5 named journeys with actor, job, steps, success, and empty/error.
2. **A11y buyers need stream-vs-batch honesty** — institutions often ship offline gloss dumps as if they were real-time access. A latency budget board makes the trade-off visible.
3. **Category platform must-haves are not optional** — glossary, latency budgets, export, org/settings, search/filter, audit, dual compare, honesty fence, and keyboard/contrast notes ship alongside the paper-inspired score.
4. **Distinct IA beats desk clones** — streams / sentences / latency / glossary / flows is a language-access story, not jobs/lifecycle/scenario.
5. **Soft-sim fencing matters** — never claim live interpreter certification or WCAG product certification from soft-sim notes alone.
6. **Commercial surfaces are product** — `/pricing`, `/demo`, `/onboarding`, and `/flows` must be real before sustain.

## Category practices shipped

| Practice | Where |
|----------|--------|
| Glossary coverage | `/glossary` |
| Latency / SLA budgets | `/latency` |
| Dual compare (realtime vs offline-batch) | `/compare` |
| Search / filter on streams | `/streams` |
| Org settings + member invite | `/settings` |
| Audit trail + JSON/CSV export | `/settings` |
| Onboarding checklist | `/onboarding` |
| Multi-flow index | `/flows` (8 named flows) |
| Honesty fence + Sources | `/honesty` |
| Keyboard / contrast honesty notes | `/honesty` (soft-sim documentation) |
| Bearer auth, rate limit, idempotent webhook | APIs |

## Deferred (with why)

| Practice | Why deferred |
|----------|----------------|
| Live webcam / production SLT models | Soft-sim climb only; no authors’ code |
| Formal WCAG audit / certification claim | Honesty fence — document practices, don’t fake certification |
| Paid checkout | Method-lab packaging honesty on `/pricing` |

## What to reuse next time

- `/flows` index pattern with actor/job/steps/success/empty for every product
- Stream → segment → budget → compare happy path for temporal a11y claims
- Institution seats + stream-minutes money hook
- Caption-wave visual system (ink / aqua / lime) as an anti-clone palette

## Honesty reminder

Method Lab packaging only. Not the authors’ system. Not clinical ASL adjudication. Not live interpreter certification.
