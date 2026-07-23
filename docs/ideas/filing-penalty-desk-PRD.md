# Filing Penalty Desk — product requirements (architect draft)

**Display name:** Filing Penalty Desk · **Slug:** `filing-penalty-desk`  
**Paper only. Draft.** Do not open `projects/filing-penalty-desk/` yet. Do not brand as `irc6651`.

Real PRD shape for a later build — not a thin smoke brief. Sources: `filing-penalty-desk-VISION.md`, `filing-penalty-desk-COMPREHENSIVE-BLUEPRINT.md`, `filing-penalty-desk-ERD.md`, legacy `irc6651-algorithm.md` + fixtures.

---

## Problem

Controllers budget late returns with spreadsheets that treat “late fee” as a flat percent. Real stacking rules use month-by-month **failure-to-file** and **failure-to-pay** on net bases, **same-month file reduction**, optional **levy-intent pay bump**, and a **minimum lesser-of floor**. Wrong models invent or hide cash.

IRS notices and commercial tax software already assess (Kill honesty). This product is a **forecast / workflow honesty** desk — not assessment software and not CPA advice.

---

## Personas

| Persona | Role enum | Needs |
|---------|-----------|-------|
| **Tax / controller analyst** | `analyst` | Enter return timelines, run statutory addition forecasts, compare naive vs correct, batch cash planning |
| **Compliance auditor** | `auditor` | Read-only catalogs and forecasts; audit trail + goldens; export CSV; cannot mutate timelines |
| **Org admin** | `admin` | Members, API tokens, webhook HMAC secret |
| **CPA partner** (viewer) | often auditor or analyst-read | Separate FTF/FTP lines; scenario dollars for client cash talk — still labeled forecast |

---

## Unique domain claim (must remain)

Month-by-month **file + pay additions** with **same-month reduction** when both accrue, net bases, optional levy-intent rate bump, aggregate caps, and **minimum lesser-of** when applicable — not a flat late-fee toy and not a dual-approval queue.

Internal algorithm reference: legacy `irc6651-algorithm.md` / oracle (research id only).

---

## User stories + acceptance criteria

### US-1 — Catalog return timelines

**As** an analyst, **I want** a paginated list of return timelines filtered by tax year, late status, forecast status, and money sign, **so that** I can find returns that need cash attention.

**AC**

- Org-scoped rows only on `/orgs/:orgId/returns`.
- Search/filter changes the result set.
- Unauthenticated → 401.
- Pagination (integrate+).

### US-2 — Edit timeline and run forecast

**As** an analyst, **I want** to edit net amount due, unpaid-by-month bases, unfiled/FTP months, levy bump index, and minimum floor inputs, then POST forecast, **so that** I lock FTF, FTP, combined, branch, and algorithm version.

**AC**

- PATCH timeline succeeds for analyst; fails for auditor.
- POST forecast returns `{ status: "ok", ftf, ftp, combined, branch, algorithm_version }` on valid inputs.
- Same-month reduction path visible when both FTF raw and FTP accrue in a month.
- Engine rejects flat-55 / dual-approver / interest-as-penalty / silent installment cheats.

### US-3 — Branch / line explanation

**As** an analyst, **I want** a month-line explanation of FTF raw, FTP, same-month reduction, caps, and floor, **so that** I can defend the cash number to finance.

**AC**

- Detail page shows per-month or summarized branch explanation tied to the locked run.
- Cap and floor application are labeled when they bind.

### US-4 — Scenario compare (naive vs correct)

**As** an analyst, **I want** to compare a naive flat late-fee model against the month-walk statutory forecast on the same inputs, **so that** I can show how much cash the spreadsheet hides or invents.

**AC**

- Scenario page shows both dollar totals side by side.
- Naive path is labeled illustrative / wrong-model — never as statutory.
- Correct path matches unique-claim algorithm.

### US-5 — Batch independent forecasts

**As** an analyst, **I want** to queue many return ids for batch forecast, **so that** cash planning covers a book of late returns without shared mutable mid-batch state.

**AC**

- Each run is independent; one failure does not rewrite siblings.
- No dual-approver gate in the batch UI.

### US-6 — Audit trail + CSV

**As** an auditor, **I want** append-only events for create, timeline edit, forecast lock, scenario compare, and reject, plus CSV export, **so that** I can explain who locked what.

**AC**

- GET audit filterable by org/return/actor.
- Auditor/admin can export CSV; auditor cannot mutate timelines.
- Events append-only.

### US-7 — Goldens browser

**As** an auditor, **I want** read-only cards for paper fixtures vs the live engine, **so that** sustain proves unique-claim coverage (≥25).

**AC**

- Pass/fail vs live engine; no mutate controls.
- Fixtures remain green in CI at sustain.

### US-8 — Honesty / disclaimer

**As** any user, **I want** a clear honesty page, **so that** digests and UI never pretend this replaces the IRS or a CPA.

**AC**

- Kill honesty sentence present in DOM.
- Display name is **Filing Penalty Desk** — never `irc6651` as brand.

### US-9 — Org settings and webhook

**As** an admin, **I want** member roles, tokens, and webhook HMAC secret, **so that** inbound return events can land idempotently.

**AC**

- Admin-only settings PATCH.
- Inbound webhook verifies HMAC; duplicate idempotency keys do not double-create.
- Auditor cannot read raw secrets.

### US-10 — Rate-limit feedback + tutor guide link

**As** an analyst, **I want** clear rate-limit feedback when I burst batch calls, and an in-app link to the tutor guide, **so that** ops stays usable and learnings stay findable.

**AC**

- 429 / limit headers surfaced in UI.
- In-app link to `docs/guides/` (or published guide path) present by sustain.

### US-11 — Offline try page

**As** a reviewer, **I want** an offline try artifact that demos same-month reduction / floor / levy bump, **so that** the unique claim is demoable without the full app.

**AC**

- Offline try exists; labeled forecast toy.
- Product remains multi-page — try page does not replace sustain UI.

---

## Non-functional

| Area | Bar |
|------|-----|
| Auth | Bearer token; org membership required |
| Tenancy | No cross-org reads/writes |
| API | Pagination; idempotent webhook; CSV export |
| Tests | ≥25 unique-claim goldens + UI critical path per page |
| Naming | Mature display name everywhere public |
| Guides | Tutor guide before sustain findings email |

---

## Out of scope (v0)

- Reasonable-cause abatement workflows
- Interest computation as a substitute for additions
- E-file / IRS transcript sync as source of truth
- Dual-approval status boards
- Public brand or portfolio row named `irc6651`

---

## Explicit non-action

Draft only. No `projects/` folder. No `ready_to_build` flip from this PRD alone.
