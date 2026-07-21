# Lotblast findings

## Status

Smoke implementation complete enough to score — blast fixtures, CTE writes, mock-recall export, plant authz, UI path, THREATS.

## Framing

Method stress on A03+A10 for DAG lot genealogy — not GTM, not dual-gate clones. Kill A (commercial tools exist) still acknowledged; value is whether the workflow holds a graph domain without collapsing to lottrack-style dual QA.

## Slice notes

1. Unique claim: forward/backward/channel/overconsume vs `docs/ideas/fixtures/`
2. CTE validation: TLC source XOR, location phone/street, transform inputs required
3. Mock recall lock exports blast-scoped sheets; `recall.opened` webhook; blast member pagination
4. Minimal UI seeds receiving → transform → ship → blast → recall
