# Proven development frameworks (lab evidence)

Ready-to-use approaches tested across the Method Lab portfolio. Update after each **comprehensive** sustain — not after every noun-swap clone.

## 1. Default build loop — A03 + A10

**When:** Any production-shaped product (auth, data, workflow).

**Recipe:**

1. One paragraph intent → PRD with testable AC
2. Contract first (routes + states + roles) before impl
3. RED integration tests → GREEN minimal impl → refactor
4. A10 gates on every risky slice: authz negatives, migrations+rollback note, `/health` + structured logs, THREATS.md
5. Vertical UI path only after API oracle green

**Evidence:** Finalist ladder (smoke→scale) + 65 portfolio sustains. Primary: A03. Enterprise overlay: A10.

**Do not:** Impl before failing tests on the same slice; “harden later.”

---

## 2. Multi-aggregate product shape (preferred portfolio unit)

**When:** You need signal about scale / components / production — not “can AI rename a FSM.”

**Recipe — one product must include:**

| Layer | Minimum |
|-------|---------|
| Tenancy | Board/org + membership roles |
| Resources | ≥2 owned resources (e.g. jobs + candidates) |
| Join + workflow | Application (or equivalent) with legal/illegal transitions + audit |
| Domain rule | Scorecard / capacity / money / inventory constraint beyond status |
| Integrate | HMAC webhook + idempotency |
| Scale | Cursor/offset pagination + rate limit |
| Sustain | Minimal UI + health + migrations + FINDINGS |

**Falsifier:** If removing the domain rule still leaves the same tests as a prior product, the product is a clone — queue something harder.

---

## 3. Component / UI testing without a heavy SPA

**When:** Sustain needs UI but stack is Node HTTP + static public/.

**Recipe:**

1. Keep UI as static HTML + small ES modules
2. Extract **pure domain helpers** (e.g. score average, transition labels) into `src/` and unit-test them
3. HTTP tests assert UI shell served + full API path (login→happy path)
4. Defer Playwright until the product outgrows static UI

**Why:** Proves component logic without binding the lab to browser flake.

---

## 4. Harness trust framework

See `protocols/HARNESS_LOOP.md`.

**Short form:** immutable oracles → deterministic suites → schema-valid cells → triple-test on method change → FINDINGS with frameworks, not just pass counts.

---

## 5. Email digest template (story first, then proof)

Subject: `[Method Lab] Results: <one-line outcome>` — **no internal codes or acronyms** (see `protocols/NOTIFY.md`).

Body must answer, without opening the repo:

1. **The idea** — who, pain, what we set out to prove
2. **The project / what we built** — concrete product pieces in plain words
3. **What we proved** — tests and caveats (workflow experiment vs commercial claim)
4. **Next** — one line
5. Optional: one findings or dossier URL — not a stack of static docs

Vanity pass counts alone are not enough.


---

## Open questions (depth restart)

Dual-gate / multi-aggregate questions from screenlane→taxhold are **answered and saturated**. Do not re-ask them with new nouns.

- Can A03+A10 sustain a **graph-domain** product (lot genealogy DAG + blast radius + mock-recall export) without collapsing to lottrack? → answered by **lotblast** sustain; temporal windows answered by **amendwin**; next open: **crewleg** FAR 117 (`docs/ideas/crewleg.md`)
- Where does static-UI testing stop being enough? → still deferred until a deep product needs it
- Does IDEA_DEPTH reduce shallow sustains without stalling the lab forever? → measure: ideas killed vs products started over next N ticks
