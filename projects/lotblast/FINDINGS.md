# Lotblast findings

## Status

**Sustained** (smoke → crud → workflow → integrate → scale). Method-stress product after depth restart.

## Framing

Method stress on A03+A10 for DAG lot genealogy — not GTM, not dual-gate clones. Kill A (commercial tools exist) still acknowledged. Unique claim is deterministic blast radius + FDA-shaped CTE export; removing genealogy would make the product look like lottrack and fail the idea.

## What held

1. Golden fixtures A–F drive forward/backward/channel/overconsume
2. CTE writes enforce location KDEs + TLC source XOR; overconsume rejects
3. Mock recall `draft → locked → closed` with audit + optimistic version
4. HMAC webhooks idempotent by `eventId`; partner notify maps dep 5xx → 502
5. Paginated lots (≥250 walk); rate limit 429 + Retry-After
6. Plant roles: ops write, qa read-only, recall_admin opens/locks recalls

## Method note

A03+A10 still workable for a graph domain without collapsing to dual-signer ceiling gates. Next portfolio product must clear `protocols/IDEA_DEPTH.md` — do not queue isomorphic dual-gate nouns.
