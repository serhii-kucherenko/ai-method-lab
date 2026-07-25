# PRD — Attest Proof Studio

## Problem

Fluent LLM answers invent evidence. Trust/eval teams need empirical answers tied to tool calls and checkable soft-sim proof steps — without Lean 4 production kernels or debate-only shells.

## Solution

A studio to:

1. Register claims that need empirical grounding
2. Record tool attestations (calc, search, code, retrieval)
3. Walk soft-sim kernel proof chains step-by-step
4. Keep an evidence grounding ledger
5. Compare attested verified quality vs fluent-only baseline
6. Fence honesty: method-lab soft-sim, not EG-VAR / Lean production cert

## Users

| Role | Job |
|------|-----|
| Trust/eval lead | Catch fluent-only wins that lack tool proof |
| Platform eng | Wire attestations + export for benches |
| Reader | Review ledger and compare winners |

## Requirements

- ≥20 user-visible features, ≥8 pages including marketing `/`
- Bearer auth, org + members, rate limit, idempotent webhook, CSV/JSON export
- Dual goldens ≥30 (A ≡ B dual-impl)
- Forbidden IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens` as primary desk; no `/rules` `/debates` or fleet-monitor shells

## Success

Live build + app-up; stranger recognizes tool-attested proof product; business tier B story (~68–72) preserved.
