# Usage guide — evidence, tests, and applying methods

This lab does **not** ship a product. It ships **scored evidence** about which development approaches work. Use this guide to:

1. Find and verify all evidence
2. Understand what each oracle tests
3. Apply a passing method to your next real project

---

## 1. What you have (evidence inventory)

| Layer | Path | What it proves |
|-------|------|----------------|
| **Scores** | `matrix/cells/*.json` | Per-run metrics: correctness, cycle time, interventions, team size |
| **Summary** | `matrix/leaderboard.md` | Pass/fail matrix across approaches × stress tiers |
| **Narrative** | `matrix/FINDINGS.md` | Why each cell passed, wave decisions, promote recommendations |
| **Method cards** | `approaches/A01.md` … `A10.md` | The rules you copy into a real repo |
| **Project briefs** | `projects/briefs/P-*.md` | What each stress tier asked agents to build |
| **Oracles** | `oracles/P-*.md` | Pass/fail criteria (agents cannot edit these mid-run) |
| **Runnable proof** | `sandboxes/<cell_id>/` | Git history + `test/oracle.test.ts` that grades each cell |

**Current state (2026-07-20):** 47 cells scored. **All passed** correctness. Wave-6 complete. **Auto-promoted:** A03 (primary), A10 (enterprise). Defaults: `matrix/METHOD_DEFAULTS.json`. Email digest on ladder complete.

---

## 2. Stress tiers and what they test

Each tier has a **brief** (what to build) and an **oracle** (how pass/fail is judged).

### P-smoke-001 — Todo API + auth

- **Brief:** `projects/briefs/P-smoke-001.md`
- **Oracle:** `oracles/P-smoke-001.md`
- **Tests:** register/login, todo CRUD, user isolation (no IDOR), automated tests exist
- **Who ran:** all 10 approaches (A01–A10)

### P-crud-001 — Multi-entity RBAC + migrations

- **Brief:** `projects/briefs/P-crud-001.md`
- **Oracle:** `oracles/P-crud-001.md`
- **Tests:** owner/member/viewer matrix, negative permission tests, ≥1 schema migration
- **Who ran:** finalists A02, A03, A05, A08, A10 + A07

### P-workflow-001 — Approvals state machine

- **Brief:** `projects/briefs/P-workflow-001.md`
- **Oracle:** `oracles/P-workflow-001.md`
- **Tests:** legal/illegal transitions, audit log, concurrent updates don't corrupt state
- **Who ran:** finalists + A07; wave-6 re-ran finalists at team sizes 2, 3, 5

### P-integrate-001 — Webhooks + outbound dependency

- **Brief:** `projects/briefs/P-integrate-001.md`
- **Oracle:** `oracles/P-integrate-001.md`
- **Tests:** HMAC validation, idempotent webhook delivery, dependency failure handling
- **Who ran:** finalists A02, A03, A05, A08, A10

### P-scale-001 — Pagination + rate limits

- **Brief:** `projects/briefs/P-scale-001.md`
- **Oracle:** `oracles/P-scale-001.md`
- **Tests:** paginated walk of ≥250 items, bounded limits, 429 rate limit, stable ordering
- **Who ran:** finalists A02, A03, A05, A08, A10

---

## 3. All scored cells (47)

Open any score: `matrix/cells/<cell_id>.json`  
Open matching sandbox: `sandboxes/<cell_id>/`

### Wave 1 — smoke (10 cells)

| Cell | Score | Sandbox tests |
|------|-------|---------------|
| A01__P-smoke-001__r1 | pass | `sandboxes/A01__P-smoke-001__r1` |
| A02__P-smoke-001__r1 | pass | `sandboxes/A02__P-smoke-001__r1` |
| A03__P-smoke-001__r1 | pass | `sandboxes/A03__P-smoke-001__r1` |
| A04__P-smoke-001__r1 | pass | `sandboxes/A04__P-smoke-001__r1` |
| A05__P-smoke-001__r1 | pass | `sandboxes/A05__P-smoke-001__r1` |
| A06__P-smoke-001__r1 | pass | `sandboxes/A06__P-smoke-001__r1` |
| A07__P-smoke-001__r1 | pass | `sandboxes/A07__P-smoke-001__r1` |
| A08__P-smoke-001__r1 | pass | `sandboxes/A08__P-smoke-001__r1` |
| A09__P-smoke-001__r1 | pass | `sandboxes/A09__P-smoke-001__r1` |
| A10__P-smoke-001__r1 | pass | `sandboxes/A10__P-smoke-001__r1` |

### Waves 2–5 — finalists on crud / workflow / integrate / scale (22 cells)

Finalists: **A02, A03, A05, A08, A10** × each of P-crud, P-workflow, P-integrate, P-scale (20 cells), plus **A07** × P-crud and P-workflow (2 cells).

Pattern: `sandboxes/A0X__P-<tier>-001__r1/` with `test/oracle.test.ts`.

### Wave 6 — team-size sims on workflow (15 cells)

Same P-workflow-001 brief/oracle; `team_size_sim` ∈ {2, 3, 5}. Scripted role handoffs (ROLE_LOG), not real multi-agent.

| Approach | ts2 | ts3 | ts5 |
|----------|-----|-----|-----|
| A03 | `A03__P-workflow-001__ts2__r1` | `ts3` | `ts5` |
| A10 | `A10__P-workflow-001__ts2__r1` | `ts3` | `ts5` |
| A05 | `A05__P-workflow-001__ts2__r1` | `ts3` | `ts5` |
| A02 | `A02__P-workflow-001__ts2__r1` | `ts3` | `ts5` |
| A08 | `A08__P-workflow-001__ts2__r1` | `ts3` | `ts5` |

---

## 4. Verify evidence yourself (run the tests)

Every sandbox with a score has:

```text
sandboxes/<cell_id>/
  package.json          # "test": "tsx --test test/*.test.ts"
  test/oracle.test.ts   # implements the oracle for that brief
  src/                  # implementation built under the approach card
```

### Run one cell

```powershell
cd sandboxes/A03__P-crud-001__r1
npm install   # first time only
npm test
```

Expected: all tests pass (e.g. 3/3 for P-crud).

### Run all sandboxes (batch)

```powershell
Get-ChildItem sandboxes -Directory | ForEach-Object {
  if (Test-Path (Join-Path $_.FullName "package.json")) {
    Write-Host "`n=== $($_.Name) ===" -ForegroundColor Cyan
    Push-Location $_.FullName
    npm test
    if ($LASTEXITCODE -ne 0) { Write-Host "FAILED: $($_.Name)" -ForegroundColor Red }
    Pop-Location
  }
}
```

### What “passing” means

1. **Oracle tests green** in the sandbox (`npm test`)
2. **Approach card followed** — check git log / artifacts (RED_GREEN.md, ERD.md, ROLE_LOG.md, etc.)
3. **Score JSON** has `"correctness_pass": true` and `"interventions": 0` for most cells
4. **FINDINGS entry** documents pros/cons

Sandboxes are local evidence (gitignored). Scores in `matrix/` are the durable record.

---

## 5. Which method to use (picker)

| Your situation | Use | Card |
|----------------|-----|------|
| Default for most backend work | **A03** Test-first | `approaches/A03.md` |
| Security / compliance / prod gates | **A10** Enterprise-lite | `approaches/A10.md` |
| Schema-heavy, API contracts | **A02** PRD + ERD first | `approaches/A02.md` |
| Security review before merge | **A05** Adversarial review | `approaches/A05.md` |
| Unknown stack / big technical fork | **A08** Research-gate | `approaches/A08.md` |
| Tiny spike, throwaway | **A01** Thin PRD | `approaches/A01.md` |
| Solo agent “swarm” | **Avoid A09** | High overhead, low value when simulated |

### Leaderboard at a glance

See `matrix/leaderboard.md`. Finalists **A02, A03, A05, A08, A10** passed all five tiers + team-size sims. **A03** has strongest process signal (red→green commits, contracts before code). **A10** adds security/migration/observability checklist.

**Auto-promoted:** A01, A04, A06, A07, A09 deprioritized — see `matrix/METHOD_DEFAULTS.json`.

---

## 6. Tutorial — apply a passing method to a real project

Do this in your **product repo**, not in `ai-method-lab`.

### Step 1 — Pick method + tier

Match your work to the closest stress tier:

- New auth + CRUD API → smoke/crud level → **A03**
- State machine / approvals → workflow level → **A03** or **A10** if compliance matters
- Webhooks + external APIs → integrate level → **A05** or **A10**
- List endpoints at scale → scale level → **A10**

### Step 2 — Copy the method card into agent rules

Create or update `AGENTS.md` (or a Cursor rule) in your product repo. Paste from the approach card:

**Example — A03 in your repo:**

```markdown
## Development method (A03 — test-first)

### Must
- Write failing tests before production code for each slice
- Red → green → refactor visible in commits
- Contracts checked in CI

### Must not
- Implementation commits before failing test commit (same slice)
- Weakening tests to pass

### Done when
- Tests existed while red; CI green; PR ready
```

Full card: `approaches/A03.md`

### Step 3 — Copy the operating stages

Your agent should follow `docs/OS.md` stages (idea → research → PRD → ERD → plan → implement → verify → PR → review → merge → learn). Compression varies by method; the card says what to skip.

### Step 4 — Use the brief as a template, not the sandbox code

Read the matching brief for structure, e.g. `projects/briefs/P-crud-001.md`:

- In scope / out of scope
- Success metric
- Stress focus

Do **not** copy sandbox source into production. Sandboxes are throwaway proofs.

### Step 5 — Grade yourself with the oracle

Copy oracle behaviors into your test plan. Example from `oracles/P-crud-001.md`:

- Permission matrix enforced
- Viewer cannot mutate
- Migration applied after initial schema
- Negative permission tests exist

Your product tests should cover the same behaviors, adapted to your domain.

### Step 6 — Inspect a winning sandbox for process patterns

Open the sandbox for the method you chose, e.g. `sandboxes/A03__P-crud-001__r1/`:

```powershell
cd sandboxes/A03__P-crud-001__r1
git log --oneline          # red→green commit pattern
cat test/oracle.test.ts    # what “done” looks like
npm test                   # confirm still green
```

Look at **process artifacts**, not code to paste: commit order, test structure, migration files, review notes.

### Step 7 — Cursor session prompt (copy/paste)

```text
You are building [FEATURE] in this repo.

Follow approach A03 (test-first) from our AGENTS.md:
- Failing tests before implementation per slice
- Red → green commits
- No weakening tests

Stages: docs/OS.md compression for team size [1|2|3|5].

Success = behaviors from oracles/P-crud-001.md (adapted to our domain):
- RBAC matrix with negative tests
- At least one migration mid-project

Do not copy from ai-method-lab sandboxes. Match the evidence patterns only.
```

Adjust approach id and oracle tier for your work.

---

## 7. How to read a cell score JSON

```json
{
  "cell_id": "A03__P-crud-001__r1",
  "approach_id": "A03",
  "project_id": "P-crud-001",
  "metrics": {
    "correctness_pass": true,
    "cycle_time_hours": 0.25,
    "interventions": 0,
    "reviewability_notes": "RED then GREEN commits; SQLite migrations...",
    "recoverability_ok": true
  },
  "team_size_sim": "1",
  "notes": "Oracle 3/3. Test-first scaled cleanly to RBAC + migration tier."
}
```

| Field | Meaning |
|-------|---------|
| `correctness_pass` | Oracle suite green |
| `cycle_time_hours` | Idea → scored |
| `interventions` | Human unblocks (0 = fully autonomous) |
| `team_size_sim` | Scripted team size for wave-6 cells |
| `fail_tags` | Empty on pass; see oracle files for tag meanings |
| `notes` | Human-readable summary |

Validate schema: `harness/cell.schema.json` + `jsonschema` (see `AGENTS.md`).

---

## 8. Promotion status (autonomous)

When matrix/CONTROLLER.json has defaults.auto_promote: true, the controller applies promote after the ladder completes — **no action required from you**.

Current defaults: matrix/METHOD_DEFAULTS.json

- **Primary:** A03 (test-first)
- **Enterprise alternate:** A10 (enterprise-lite)

You receive findings + usage links by email (
otify.to in CONTROLLER.json) on ladder_complete / promote_complete.

---

## 9. Quick reference — file map

```text
ai-method-lab/
├── approaches/A03.md          ← copy into product AGENTS.md
├── oracles/P-crud-001.md      ← copy behaviors into your test plan
├── projects/briefs/           ← scope templates
├── matrix/
│   ├── FINDINGS.md            ← narrative evidence + promote decisions
│   ├── leaderboard.md         ← pass matrix
│   └── cells/*.json           ← machine-readable scores
└── sandboxes/<cell_id>/       ← run npm test to verify
```

**Loops:** Research (`docs/RESEARCH.md`) → Experiment (this lab) → **Build/promote** (your product repo, separate session). You are here for experiment evidence; build happens after promote.

---

## 10. FAQ

**Q: Do I ship code from sandboxes?**  
No. Sandboxes prove the *method* works. Your product code is fresh.

**Q: All approaches passed — how do I choose?**  
Use FINDINGS + leaderboard for *process* signal: overhead, reviewability, team fit. Correctness did not separate finalists.

**Q: Tests failed when I ran a sandbox**  
Run `npm install` first. Sandboxes use Node `tsx --test`. If still failing, compare to `matrix/cells/<id>.json` — score may be stale vs local sandbox.

**Q: How do I re-run an experiment?**  
Follow `protocols/RUNBOOK.md`. One cell at a time. Do not edit `oracles/` or `harness/` during a run.

**Q: Where's the email?**  
Autonomous digest on `ladder_complete` / `promote_complete` to `notify.to` in CONTROLLER.json. No reply required. See `protocols/NOTIFY.md`.
