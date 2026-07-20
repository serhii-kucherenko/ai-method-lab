# Findings

Evidence log. Promote methods only per `docs/RUBRIC.md`.

## 2026-07-19 — Bootstrap

Lab scaffolded. No cells scored yet. First cell queued: **A01 × P-smoke-001**.

## 2026-07-20 — A01 × P-smoke-001 (pass)

- **Cell:** `A01__P-smoke-001__r1`
- **Correctness:** pass (oracle 4/4)
- **Approach fit:** Thin one-paragraph PRD → immediate impl worked for P-smoke. No ERD needed; in-memory maps sufficient.
- **Merge:** Controller merged feature branch locally (designated owner). Remote `gh` CLI not installed — note for future cells if GitHub PR trail is required evidence.
- **Interventions:** 0
- **Takeaway:** A01 is viable for smoke-tier auth+CRUD. Next: A02 on same brief to compare ERD-first overhead.

## 2026-07-20 — A02 × P-smoke-001 (pass)

- **Cell:** `A02__P-smoke-001__r1`
- **Correctness:** pass (oracle 4/4)
- **Approach fit:** PRD+ERD committed before impl; schema matched ERD. Extra ~one commit of ceremony vs A01; same end code shape.
- **Interventions:** 0
- **Takeaway:** For P-smoke, ERD-first cost is small and improves reviewability. Compare against A03+.

