# Harness loop — prove the experiment system works

The portfolio only teaches us something if scoring is **repeatable** and failures are **real**, not noise from flaky tests or agent variation.

## What the harness must guarantee

| Guarantee | How we check |
|-----------|--------------|
| Same oracle, same pass/fail meaning | Oracles under `oracles/` are **immutable during a run**; agents never edit them |
| Cell scores are comparable | Validate `matrix/cells/*.json` against `harness/cell.schema.json` |
| Method changes are fair | Midterm change → `MIDTERM_CHANGE.md` + `TRIPLE_TEST.md` (3 runs) |
| Flakes don’t fake success | Product tests: retry ≤2; if still fail, score fail and document |
| Findings are actionable | Every sustain email lists: tried, worked, failed, **framework recommendation** |

## Loop tick (controller)

```text
pick product phase → freeze brief+oracle → RED→GREEN in projects/<id>/
  → run full suite (deterministic) → score cell JSON → validate schema
  → append FINDINGS (product + matrix) → commit/push/merge
  → notify digest → next phase/product
```

## Repeatability checklist (run after each sustain)

1. **Determinism:** no wall-clock sleeps in pass criteria; seed data via API only; rate-limit tests use lowered limit in `withServer`
2. **Isolation:** each test gets its own in-memory DB + ephemeral port
3. **Oracle coverage:** smoke/crud/workflow/integrate/scale/sustain files all green
4. **Schema:** `python -c` / `jsonschema` validate the new cell (or Node equivalent)
5. **Spread:** if re-running same cell, record `run_index` and median metrics per `TRIPLE_TEST.md`

## When variation is the problem

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Pass then fail same suite | Shared mutable store / port race | Fresh `withServer` per test |
| Different agent, different score | Soft AC / missing negatives | Harden oracle + negative tests |
| “Works on my machine” | Env secrets / real network | Mock deps (`dep.ts`); no external I/O in tests |
| Inflated portfolio score | Clone products only | Prefer multi-aggregate products (see BACKLOG strategy) |

## Valuable vs vanity evidence

- **Vanity:** 60 products that are the same FSM with renamed nouns
- **Valuable:** fewer products that stress RBAC × workflow × integrations × scale × UI, with FINDINGS that name a reusable framework

## Agent rules

- Do not edit `oracles/` or `harness/` to make a run pass
- Do not weaken tests to go green
- Prefer evolving `projects/<id>/` over throwaway sandboxes for portfolio work
