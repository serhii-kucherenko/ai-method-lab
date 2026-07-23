# Product manager intake checklist

Reusable gate for the **product manager** role (`protocols/AGENT_ROLES.md`).  
Complete **every** item before anyone opens a new `projects/<id>/` folder.

**Bar:** problem framing + prioritized roadmap + explicit go — not “fixtures are green.”  
**Shape:** must clear `docs/COMPREHENSIVE_PRODUCT.md` (multi-page, multi-feature), not a calculator costume.

Copy this into `docs/ideas/<id>-PM-GO.md` (and fill `docs/ideas/<id>-ROADMAP.md` from `PM_ROADMAP_TEMPLATE.md`). Check boxes only when evidence is on file.

---

## 0. Preconditions (research handoff)

- [ ] Researcher cleared `protocols/IDEA_DEPTH.md` → status `ready_to_build` (not same-day theater)
- [ ] Idea id and unique domain claim recorded (non-isomorphic; not a noun-swap of a prior product)
- [ ] Calendar / hours / tick gates satisfied per controller depth policy
- [ ] No other product in flight; `notify.product_complete_pending` is **false** (or prior findings email already sent)

**Stop if any box is unchecked.** Do not invent domain math; send back to Researcher.

---

## 1. Problem statement

- [ ] One-sentence problem: who loses what money / time / risk today without this product
- [ ] Unique claim named in plain language (what the product computes or decides that spreadsheets / prior products do not)
- [ ] Explicit “we refuse to become” list (e.g. single-route dual-gate smoke, flat widget, silent policy parity)
- [ ] Money honesty: Kill A / value stakes reviewed; digests will not claim mitigated guidance as statutory truth

**Write here (or link):**

| Field | Answer |
|-------|--------|
| Problem | |
| Unique claim | |
| Refuse to become | |
| Money honesty note | |

---

## 2. User

- [ ] Primary user / persona named (job + context)
- [ ] Secondary users or roles called out if multi-tenant / RBAC matters
- [ ] Job-to-be-done: the primary action they take in the product weekly
- [ ] Out-of-scope users (who we are **not** building for)

**Write here:**

| Field | Answer |
|-------|--------|
| Primary user | |
| Secondary roles | |
| Primary job | |
| Out of scope | |

---

## 3. Frequency

- [ ] How often the primary job happens (daily / weekly / per shipment / per filing / etc.)
- [ ] Why that frequency justifies a durable multi-page product (not a one-off calculator)
- [ ] What “done enough to leave” means for this user’s cadence (sustain exit)

**Write here:**

| Field | Answer |
|-------|--------|
| Frequency | |
| Why product (not toy) | |
| Done-enough for user | |

---

## 4. Kill rounds reviewed

- [ ] G3 adversarial kill round(s) read; surviving claim still honest
- [ ] Challenge / value gates (money honesty) reviewed — no silent PD / guideline costume
- [ ] Instant-fail patterns from `docs/COMPREHENSIVE_PRODUCT.md` checked against this idea
- [ ] Explicit **abandon mid-build** triggers listed (collapse to shallow shape → park)

**Write here:**

| Kill / challenge | Outcome | Still true? |
|------------------|---------|-------------|
| | | |
| | | |

**Abandon if:**

- …

---

## 5. Roadmap phases with exit criteria

- [ ] Ordered phases: **smoke → crud → workflow → integrate → scale → sustain**
- [ ] Each phase has a **user-visible unlock** (not only API green)
- [ ] Each phase has **testable exit criteria** (RED→GREEN + UI critical path where pages unlock)
- [ ] In-phase vs deferred priorities listed
- [ ] Roadmap committed as `docs/ideas/<id>-ROADMAP.md` using `docs/ideas/PM_ROADMAP_TEMPLATE.md`
- [ ] Comprehensive minimums planned: ≥3 aggregates, ≥4 pages/views, ≥6 features beyond CRUD, auth + org + pagination + idempotent webhook, depth suite + UI paths, offline try artifact at sustain

Paste the filled phase table (or link the ROADMAP file):

| Phase | User-visible unlock | Exit criteria | In / deferred |
|-------|---------------------|---------------|---------------|
| smoke | | | |
| crud | | | |
| workflow | | | |
| integrate | | | |
| scale | | | |
| sustain | | | |

---

## 6. Go / no-go

- [ ] Roadmap reviewed end-to-end (not “fixtures green”)
- [ ] Explicit decision recorded in `docs/ideas/<id>-PM-GO.md`

| Field | Value |
|-------|--------|
| `decision` | `go` \| `no-go` |
| Date | |
| Reason | |
| Next owner if go | Senior architect — VISION / ROADMAP detail / PRD / ERD / blueprint / contracts **before** `projects/` |
| Next owner if no-go | Researcher — park / autopsy; no product folder |

**Hard rules**

- `go` only after Researcher `ready_to_build` **and** this checklist + roadmap
- `no-go` parks the idea; do not open `projects/`
- After PM `go`, architect pack must land before delivery (`docs/COMPREHENSIVE_PRODUCT.md` role pack table)

---

## 7. Findings-email gate reminder

Product manager owns the **findings digest gate** after sustain (or abandon with autopsy).

- [ ] Acknowledged: **do not** switch `current_product` / open the next `projects/` folder until the product-finished email is sent
- [ ] Email follows `protocols/NOTIFY.md`: story first (idea + what we built + proof), plain language, no internal codes
- [ ] Product finished requires try page + StackBlitz try link (when UI/core math exists)
- [ ] Delivery hands off try.html + FINDINGS; PM sends digest; only then research / next idea

**Reminder line for CONTROLLER:** findings email before next product — always.

---

## Exit (PM tick complete)

| Outcome | Artifacts |
|---------|-----------|
| **Go** | This checklist satisfied + `<id>-ROADMAP.md` + `<id>-PM-GO.md` with `decision: go` |
| **No-go** | `<id>-PM-GO.md` with `decision: no-go` + park reason; idea returned to research |

**Does not own:** production code, domain goldens invention, opening `projects/`.

**Handoff order:** Researcher → **PM (this checklist)** → Senior architect → Product delivery → **PM (findings email)** → next idea.
