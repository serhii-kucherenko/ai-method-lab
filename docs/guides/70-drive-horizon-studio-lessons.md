# 70 — Drive Horizon Studio lessons

## What we built
**Drive Horizon Studio** is an industrial AV soft-sim eval bench for hierarchical world-model scoring (coarse scene structure + detail generator) versus a flat single-level / naive rollout baseline. Inspired by arXiv 2607.15898 (Orbis 2 pattern) — not branded as Orbis.

## Category practices shipped
| Practice | How |
|----------|-----|
| Versioned scenario packs | `/packs` + API |
| Dual compare | Hierarchical (A) vs flat (B) on `/compare` |
| Scoreboard | Ranked by hierarchical overall |
| Audit + export | Settings trail + scenes JSON / compares CSV |
| Org / members / webhook | Bearer auth, HMAC idempotent ingest |
| Multi-flow | ≥5 named journeys on `/flows` |
| Commercial surfaces | `/pricing` `/demo` `/onboarding` |
| Honesty fence | Soft-sim; not live vehicle deployment; not certification |

## What worked
- Domain IA (`/packs` `/scenes` `/generators`) beats desk noun-swap for this claim.
- Dual-impl goldens (~30) catch drift between A/B scorers early.
- Landing brand-first with horizon atmosphere without stuffing stats in the first viewport.

## Deferred
- Live vehicle / closed-loop control (honesty fence).
- Authors’ code port (none published).
- Real card checkout (method-lab packaging only).

## Stack
Next.js App Router + Tailwind + shadcn · TypeScript dual score · Vitest-style node:test goldens · app-up live smoke.
