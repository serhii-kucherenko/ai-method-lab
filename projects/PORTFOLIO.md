# Product portfolio

Registry of product experiments. Controllers pick work from here + `docs/BACKLOG.md`.

**Depth restart (2026-07-21):** Shallow dual-gate conveyor frozen. Build only `ready_to_build` ideas. See `docs/DEPTH_RESTART.md`.

## Active

| ID | Status | Workflow | Current phase | Hypothesis (short) |
|----|--------|----------|---------------|--------------------|
| **depositgap** | **in progress** | A03 + A10 | crud → workflow | Deposit vs assessed + interest forecast (catalog + RBAC live) |
| tariffstep | **sustained** | A03 + A10 | done | Stepped rate blocks + demand ratchet (workflow experiment) |
| bondstrip | **sustained** | A03 + A10 | done | Day-count accrued + cashflow strip (method stress) |
| settlecut | **sustained** | A03 + A10 | done | Loss-adjusted interval imbalance settlement (method stress) |
| ndcswap | **sustained** | A03 + A10 | done | Orange Book TE substitution + DAW/BMN (method stress) |
| crewleg | **sustained** | A03 + A10 | done | FAR 117 Table B FDP + rest legality (method stress) |
| amendwin | **sustained** | A03 + A10 | done | Amendment-aware visit windows + important PD class (method stress) |
| lotblast | **sustained** | A03 + A10 | done | DAG lot genealogy + deterministic blast radius + mock-recall export (method stress) |

## Abandoned this restart

| ID | Status | Notes |
|----|--------|-------|
| captable | **abandoned** | Mid-smoke stop. Isomorphic oversubscribe + dual counsel; hypothesis was copy-paste from claimreserve. |

## Archive — shallow / isomorphic wave (evidence of throughput, not depth)

These remain in-repo as historical evidence that A03+A10 can ship template products. They are **not** models for the next build. Do not extend the wave.

| Tier | IDs (summary) |
|------|----------------|
| Early portfolio | clearpath, ledgerlite, signalboard, kitcheck, meetslot, briefpad, clipvault, formqueue, tasklane, invoicelink, guestpass, waitlist, tipjar, … (noun-swap FSMs) |
| Dual-gate comprehensive wave | screenlane → taxhold (multi-aggregate + ceiling/floor/days + dual control). Proven pattern; **saturated**. |
| Design-lab | orbitfolio (A08) — separate track |

Full historical table preserved in git history prior to depth restart; rows below kept only for the last dual-gate cluster + early notables.

| ID | Status | Workflow | Notes |
|----|--------|----------|-------|
| clearpath | sustained (archive) | A03 + A10 | First portfolio product |
| screenlane | sustained (archive) | A03 + A10 | Scorecards — first richer multi-aggregate |
| claimdesk | sustained (archive) | A03 + A10 | Claims + evidence |
| releasetrain | sustained (archive) | A03 + A10 | Dual approval + rollback |
| taxhold | sustained (archive) | A03 + A10 | Last dual-gate sustain before restart |
| orbitfolio | design-lab | A03 + A08 | Live https://orbitfolio-kohl.vercel.app |

## Next autonomous actions

1. Slow IDEA_DEPTH on **htsroute** (differentiated) — small G5 case list next; no same-day build
2. Digests: plain language; may report kills and “not ready”
3. Multi-tick research before fixtures; never same-day framed→build
4. Depth-restart sustained (still under speed critique): lotblast … tariffstep
5. Killed: lanehold (G2)
