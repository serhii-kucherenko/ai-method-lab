# AI development workflow

**How to build product experiments** under `projects/<id>/` with AI (frontend, backend, full-stack).

The Method Lab’s job: verify **few, deep ideas**, then climb those to **sustain** with this workflow, and publish findings worth reading.  
Depth gate before code: `protocols/IDEA_DEPTH.md`. Restart note: `docs/DEPTH_RESTART.md`.  
Lab-operator docs (oracles, scoring): `docs/USAGE_GUIDE.md`.

Evidence so far: approach ladder + A03/A10 defaults still stand; the high product count was mostly isomorphic dual-gate throughput — not comprehensive depth. **Primary: A03 (test-first). Enterprise overlay: A10.**

---

## What this is

A staged workflow for building software with AI where:

- Each stage has a clear **artifact**, **exit criteria**, and **who (human vs AI) does what**
- Work ships in **small vertical slices** (auth → one feature → next feature)
- **Tests and contracts come before code** (backend API + frontend behavior)
- Security, migrations, and observability are **day-one**, not “later” (when using A10 overlay)

```text
Idea → Research? → PRD → Contracts/ERD → Plan → RED tests → GREEN impl → Verify → PR → Review → Merge → Learn
         ↑ optional (A08)     ↑ A02 gate on schema-heavy work
```

---

## Pick your workflow variant

| Situation | Base | Add overlay |
|-----------|------|-------------|
| Default full-stack or backend feature | **A03** test-first | — |
| Auth, payments, PII, prod compliance | **A03** | **+ A10** enterprise gates |
| New schema / multi-service API | **A03** | **+ A02** ERD-before-code |
| Unknown framework or big tech choice | **A03** | **+ A08** research merge first |
| Security-sensitive surface | **A03** | **+ A05** adversarial review pass |
| 30-minute throwaway spike | **A01** thin PRD only | skip ceremony |

Promoted defaults: `matrix/METHOD_DEFAULTS.json`

---

## The 11 stages (full-stack)

Every slice walks these stages. Compression = skip or shorten when risk is low.

### 1. Idea / intake

**Artifact:** One paragraph — problem, success metric, non-goals.  
**Human:** Writes intent (or approves AI draft).  
**AI:** Clarifies scope, flags ambiguity.

```text
Problem: Users cannot reset password securely.
Success: Reset flow works E2E; tokens expire; no user enumeration.
Non-goals: SSO, magic links, admin impersonation.
```

### 2. Research (optional — use A08 overlay)

**When:** New library, infra choice, unfamiliar domain, >1 viable architecture.  
**Artifact:** `docs/research/<topic>.md` — options, risks, **decision**, link merged before code.  
**Human:** Approves decision.  
**AI:** Drafts options; must not start app code until research is merged.

### 3. PRD

**Artifact:** User stories + testable acceptance criteria + explicit out-of-scope.  
**Human:** Owns priority and AC truth.  
**AI:** Expands stories into AC bullets testable by automation.

**Frontend AC example:** “Submit disabled until valid”; “Error shown inline, not alert”.  
**Backend AC example:** “401 on missing token”; “User A cannot read User B’s resource”.

### 4. ERD / contracts (A02 overlay on schema/API work)

**Artifact:**

| Layer | Artifact |
|-------|----------|
| Backend | OpenAPI or route contract, DB schema/migration plan, auth boundaries |
| Frontend | API client types (generated or hand-written from OpenAPI), route map, component data boundaries |
| Shared | Error shape, pagination, id types |

**Rule:** No implementation that invents fields/routes not in the contract without updating the contract first.

**AI:** Drafts OpenAPI + ERD; human signs before RED tests.

### 5. Plan / slice breakdown

**Artifact:** Task list with Definition of Done per task; **one vertical slice** selected.  
**Human:** Picks slice order (riskiest or highest value first).  
**AI:** Sequences tasks; estimates unknowns.

**Slice example:** “POST /auth/register + login form + session cookie” — not “all auth”.

### 6. Implement — RED then GREEN (A03 core)

**This is the promoted default.**

#### Backend RED

1. Write failing integration/API tests for the slice (auth, RBAC, state transitions, webhooks — match your domain).
2. Commit: `test: red — <slice>` (tests fail).

#### Frontend RED

1. Component or integration tests for AC (Testing Library, Playwright component, or E2E stub).
2. Mock API from contract; tests fail before UI exists.
3. Commit with backend RED or immediately after in same slice branch.

#### GREEN

1. Minimal code to pass tests — backend routes/handlers, then frontend wiring.
2. Commit: `feat: green — <slice>`.
3. Refactor only with tests green.

**Must not:** Implementation commit before failing test commit on the same slice.  
**Must not:** Weaken tests to pass.

### 7. Verify

**Gates (CI, same for FE/BE):**

| Check | Backend | Frontend |
|-------|---------|----------|
| Unit / integration | API tests, permission negatives | Component tests |
| Contract | OpenAPI diff or schema test | Types match API |
| Lint / types | tsc, eslint | tsc, eslint |
| E2E (when slice warrants) | — | Critical path Playwright/Cypress |
| Regression | Full suite on PR | Full suite on PR |

**AI:** Runs tests locally; fixes until green.  
**Human:** Spot-checks AC coverage in tests, not only happy path.

### 8. PR

**Artifact:** PR description linking PRD AC, contract diff, test evidence.  
**Template:**

```markdown
## Slice
<one sentence>

## AC covered
- [ ] ...

## Artifacts
- Contract: ...
- Tests added: ...

## A10 checklist (if overlay)
- [ ] Authz stated  [ ] No secrets  [ ] Migration/rollback  [ ] Health/logs  [ ] Threat notes
```

### 9. Review

| Mode | Who |
|------|-----|
| Default | Human skim + CI |
| A05 overlay | Second AI or person as **adversary** — security, scope creep, missing negatives |
| A10 overlay | Checklist gate required before merge |

**Adversary prompt:**

```text
You are adversarial reviewer. Builder PR attached. Find: missing tests, IDOR, auth gaps,
scope creep vs PRD, secrets, impl-before-test violations. Output findings or LGTM with gaps waived (reason required).
```

### 10. Merge + ship

- Trunk-based; small slices merge often.
- Feature flags if slice is incomplete UX but backend ready.
- Rollback story documented when schema changes (A10).

**Autonomous agent policy:** merge when CI green; do not wait for human if repo policy says so.

### 11. Learn

One note per slice: what broke, what to reuse, workflow friction.  
(In product repos: `CHANGELOG`, retro note, or team doc — not Method Lab FINDINGS.)

---

## A10 enterprise overlay (add to any slice touching prod risk)

Apply when: auth, permissions, PII, payments, webhooks, schema changes, public APIs.

| Gate | Backend | Frontend |
|------|---------|----------|
| Authz | Role matrix documented; negative tests | Hide/disable by role; no UI-only security |
| Secrets | Env only; never committed | No API keys in client bundle |
| Migrations | Forward + rollback note | N/A unless local storage schema |
| Observability | Structured logs, `/health` | Error boundary + client error reporting |
| Threats | Short STRIDE-style note per new surface | XSS, CSRF, token storage called out |

**Must not:** “We’ll harden later.”

---

## Full-stack slice walkthrough (example)

**Slice:** Todo list for authenticated user (smoke-tier pattern from lab evidence).

| Step | Backend | Frontend |
|------|---------|----------|
| PRD | CRUD + owner isolation AC | List/create/edit/delete UI AC |
| Contract | `GET/POST/PATCH/DELETE /todos`, Bearer auth | Types from OpenAPI |
| RED | Tests: 401 unauth, 403 wrong user, CRUD happy path | Tests: empty state, add todo, error on 401 |
| GREEN | Handlers + in-memory or SQLite | Page + hooks |
| Verify | `npm test` API suite | `npm test` + optional E2E login flow |
| A10 | Rate limit note, auth boundary in THREATS.md | Tokens not in localStorage if httpOnly preferred |

Evidence that this pattern passes: lab smoke oracle (all 10 approaches); **A03** strongest process signal on harder tiers.

---

## Harder patterns (from scored tiers)

Use the same RED→GREEN loop; expand **tests**, not ceremony.

| Pattern | Backend focus | Frontend focus |
|---------|---------------|----------------|
| **RBAC / CRUD** | Permission matrix + negative tests; migrations | Role-aware UI; disable forbidden actions |
| **Workflow / state machine** | Legal/illegal transitions; audit log; concurrency | Status UI reflects server state; optimistic UI with conflict handling |
| **Integrations** | HMAC webhooks, idempotency, dependency failures | Polling or webhook-driven refresh; error states |
| **Scale** | Pagination, rate limits, stable sort | Infinite scroll / virtual list; 429 handling |

Finalists (A03, A10, A05, A02, A08) passed all these tiers in lab sandboxes.

---

## Team size: who does what

Same stages; different owners. AI assists builders at every size.

| Size | Human lanes | AI |
|------|-------------|-----|
| **1 + AI** | Intention, merge, spot-check AC | Tests first, impl, first review draft |
| **2** | A: product/AC · B: arch/review | Drafts under each owner |
| **3** | Intake · eng lead · builder | Builder+AI; lead signs contracts |
| **5** | + design/data · 2 builders · QA/review | QA lane owns contract/E2E suite |

**WIP limit:** 1–2 slices in flight. Lab evidence: ceremony grows with team size but correctness holds if stages don’t change.

---

## Drop into your product repo

Copy this block into `AGENTS.md` or a Cursor rule:

```markdown
# Development workflow (Method Lab A03 + A10)

## Stages
Follow: Idea → PRD → Contracts → Plan → RED tests → GREEN impl → Verify → PR → Review → Merge.

## Must (every slice)
- Failing tests before production code (backend API tests + frontend component/integration tests)
- Red commit then green commit per slice
- Contracts drive types (OpenAPI / shared types)
- CI must pass before merge

## Must (A10 — auth, PII, schema, public API)
- Authz documented + negative tests
- No secrets in repo
- Migration/rollback note on schema change
- /health or structured logs on backend; error boundaries on frontend
- THREATS.md one-liner for new attack surface

## Must not
- Implementation before failing tests on same slice
- Weaken tests to pass
- UI-only authorization
- Skip review on security-sensitive diffs

## Review
Default: CI + human skim. Security-sensitive: run adversarial reviewer (separate agent pass).

## Done when
AC covered by tests; CI green; PR merged.
```

---

## Cursor session prompt (start a slice)

```text
Build slice: [DESCRIPTION].

Workflow: Method Lab A03 (test-first) + A10 where applicable.
1. Confirm PRD AC (bullet list)
2. Update contract if needed (OpenAPI + types)
3. RED: failing backend tests, then failing frontend tests — commit
4. GREEN: minimal impl — commit
5. Run full CI; fix until green
6. Open PR with AC checklist + A10 checklist if applicable

Do not implement before tests exist for this slice.
```

---

## Workflow pieces quick reference

| Piece | Purpose | Owner |
|-------|---------|-------|
| Intake one-pager | Align problem/metric | Human |
| Research doc | De-risk tech choice (A08) | Human approves |
| PRD + AC | Testable scope | Human + AI draft |
| OpenAPI / ERD | Single source of truth (A02) | Human signs |
| RED tests | Lock behavior before code | AI writes, human checks negatives |
| GREEN impl | Minimal pass | AI |
| CI pipeline | Independent gate | Repo |
| Adversarial review | Catch security/scope (A05) | Second agent/human |
| A10 checklist | Prod-ready gate | Human or CI |
| Small slices | Limit blast radius | Human prioritizes |

---

## What the lab proved (so you trust this workflow)

- **Correctness:** 47/47 cells passed oracle suites (auth, RBAC, workflows, integrations, scale).
- **Differentiator was process, not pass/fail:** A03 (test-first) showed the strongest evidence across tiers.
- **A10** added security/observability without breaking correctness.
- **Team sizes 1–5:** viable with scripted handoffs; more ceremony, same gates.
- **Avoid:** simulated multi-agent “swarm” (A09) on solo AI — high overhead, no quality gain.
- **2026-07-20 pivot:** Prefer multi-aggregate products (see `docs/FRAMEWORKS.md`) over noun-swap FSMs; verify harness repeatability via `protocols/HARNESS_LOOP.md`. Screenlane (boards + scorecards) sustained 18/18 under A03+A10.

Details: `matrix/FINDINGS.md`, `matrix/leaderboard.md` (evidence only — you don’t need these to execute the workflow).

---

## Related files

| File | Audience |
|------|----------|
| **This file** | Product teams — daily AI dev workflow |
| `docs/FRAMEWORKS.md` | Proven ready-to-use patterns from lab products |
| `protocols/HARNESS_LOOP.md` | How to keep scores repeatable and valuable |
| `docs/OS.md` | Stage definitions (reference) |
| `approaches/A03.md`, `A10.md` | Method cards |
| `matrix/METHOD_DEFAULTS.json` | Promoted defaults |
| `docs/USAGE_GUIDE.md` | Lab operators — sandboxes, oracles, scoring |
