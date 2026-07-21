# amendwin window algorithm (paper)

Deterministic rules. Golden fixtures under `docs/ideas/fixtures/amendwin-*.json` are the oracle.

## Model

- **ProtocolVersion** `{ id, effective_at: YYYY-MM-DD, visits: { [code]: Window } }`
- **Window** `{ target_day: number, before: number, after: number }` — days relative to subject **anchor** (enrollment date)
- **Subject** `{ id, enrollment: YYYY-MM-DD }`
- **Visit** `{ subject_id, code, actual: YYYY-MM-DD | null, locked: boolean, scored_version_id?: string, classification?: Class }`
- **Class** = `on_time` | `early` | `late` | `missed` | `out_of_window`

Versions sorted by `effective_at` ascending, then `id` ascending for ties.

## resolveVersion(versions, as_of)

```
candidates := versions where effective_at <= as_of
if empty: error unknown_version
return last candidate in sort order
```

## scoreVisit(versions, subject, visit, as_of_missed?)

If `visit.locked` and `visit.classification` set → return stored classification (never recompute).

```
v := resolveVersion(versions, visit.actual ?? as_of_missed)
w := v.visits[visit.code]  // missing ⇒ error unknown_visit_code
target := enrollment + w.target_day days
open := target - w.before
close := target + w.after
```

If `visit.actual` is null:
- if `as_of_missed` > close → `missed`
- else → not yet classifiable (`pending`)

If `visit.actual` set:
- if actual < open → `early` if still ≥ open-… wait: early means before target but within window: `open <= actual < target` → `early`; `actual == target` → `on_time`; `target < actual <= close` → `late`; else `out_of_window`

## importantDeviation(class, visit_code, important_codes)

```
important := class in {missed, out_of_window} AND visit_code in important_codes
```

(FDA draft: sponsor defines important; we pin important_codes in fixtures.)

## Amendment publish

```
reject if new.effective_at < prior.max(effective_at) without explicit supersede flag
// Fixture F: unordered effective dates rejected
append version; does not mutate locked visits
```

## Required properties

1. Determinism  
2. Non-retroactive lock (Fixture B)  
3. Mid-amendment split (Fixture A)  
4. Important classification only on missed/out_of_window for listed codes (Fixture C)  
5. Anchor fixed at enrollment — late prior visits do not shift later targets (Fixture E)  
6. Not a dual-signer FSM — no “dual QA clear” as unique claim  

## Anti-patterns

- Status rename of lottrack  
- Dual counselor/officer release  
- Ignoring `locked` and re-scoring history on amendment
