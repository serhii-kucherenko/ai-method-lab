# Midterm change → redo → triple-test

Approaches are versioned. Do not silently rewrite a card and keep old wins.

## When

A run reveals a real process flaw (wrong gate, missing artifact, systemic review miss).

## Steps

1. **Hit issue** — Tag failure (stage + root cause). Stop claiming the old cell score as current.
2. **Change** — Fork `A03.md` → `A03.1.md` (diff of rules/gates only). Set `supersedes: A03` / mark A03 `superseded`.
3. **Redo** — Clean sandbox; re-run affected brief(s) under the new version.
4. **Triple-test** — See `TRIPLE_TEST.md`. Promote only if rule passes.
5. **Update matrix** — Mark old cells `superseded`; score new cells; note what changed in FINDINGS.

## Freeze vs adapt

| When | Rule |
|------|------|
| During one cell | Frozen |
| Between cells / after hard fail | Version, redo, triple-test |
| Never | Edit in place and keep old leaderboard wins |
