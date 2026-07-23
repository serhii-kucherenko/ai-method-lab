# Product roadmap template

**Role:** Product manager owns phase order and exit criteria (`protocols/AGENT_ROLES.md`).  
**Senior architect** fills engineering detail under this order after PM go.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md` — comprehensive multi-page product, not a smoke costume.

Copy to `docs/ideas/<id>-ROADMAP.md`. Fill **before** RED tests or `projects/<id>/`.

---

## Header

| Field | Value |
|-------|--------|
| Idea id | `<id>` |
| Unique claim | |
| Primary user | |
| PM decision | link `docs/ideas/<id>-PM-GO.md` |
| Comprehensive targets | ≥3 aggregates · ≥4 pages · ≥6 features beyond CRUD · auth + org + pagination + idempotent webhook · try.html at sustain |

**Paper only until PM `decision: go` and architect pack are committed.** Do not open `projects/<id>/` from this file alone.

---

## Phase table

| Phase | User-visible unlock | Pages / views unlocked | Aggregates / APIs touched | Exit criteria (testable) | In-phase vs deferred |
|-------|---------------------|------------------------|---------------------------|--------------------------|----------------------|
| **smoke** | | | | RED→GREEN for unique claim + depth goldens; PRODUCT honesty fences; no UI-as-sustain | |
| **crud** | | | | Catalog + detail mutate paths; RBAC mutate-forbid where required; UI critical path for unlocked pages | |
| **workflow** | | | | Multi-step / batch / audit (or domain equivalent) green; UI critical path for workflow pages | |
| **integrate** | | | | Auth + multi-tenant org + pagination + idempotent webhook (accept/reject); settings / inbound path; UI critical path | |
| **scale** | | | | Load / concurrency / rate-limit (or documented scale suite) green; dual-impl or stability bar met | |
| **sustain** | | | | ≥4 distinct views live; ≥3 aggregates; ≥6 beyond-CRUD features; UI critical path **all** blueprint pages; offline `try.html`; Kill A / money honesty in FINDINGS | |

---

## Phase notes (optional detail)

### smoke

- Unlock:
- Exit:
- Abort if:

### crud

- Unlock:
- Exit:
- Abort if:

### workflow

- Unlock:
- Exit:
- Abort if:

### integrate

- Unlock:
- Exit:
- Abort if:

### scale

- Unlock:
- Exit:
- Abort if:

### sustain

- Unlock:
- Exit:
- Abort if:

---

## Priorities

| In this build | Deferred |
|---------------|----------|
| | |

## Instant abort (shallow / dishonest)

- Single calculator page + dual approval costume
- Noun-swap of a prior sustained product
- Sustain with &lt;4 pages or &lt;3 aggregates
- Claiming mitigated / guideline outcomes as statutory or policy truth without honesty fences

## Findings gate

After sustain scores: product manager sends product-finished digest per `protocols/NOTIFY.md` (try page + StackBlitz). **No next `projects/` folder until that email is sent.**
