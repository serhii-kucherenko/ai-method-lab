# Backlog (product phases queued)

## Done

- Approach ladder waves 1–6 (method discovery) — see matrix/
- Process: failure tags taxonomy (`docs/FAIL_TAGS.md`), replication default, GitHub CLI verified
- **clearpath × P-smoke-001** (A03+A10) — pass
- **clearpath × P-crud-001** (A03) — pass
- **clearpath × P-workflow-001** (A03+A10) — pass
- **clearpath × P-integrate-001** (A03+A10) — pass
- **clearpath × P-scale-001** (A03+A10) — pass
- **clearpath × P-sustain** (A03+A10) — pass — product sustained
- **ledgerlite × P-smoke-001** (A03+A10) — pass
- **ledgerlite × P-crud-001** (A03+A10) — pass
- **ledgerlite × P-workflow-001** (A03+A10) — pass
- **ledgerlite × P-integrate-001** (A03+A10) — pass
- **ledgerlite × P-scale-001** (A03+A10) — pass
- **ledgerlite × P-sustain** (A03+A10) — pass — product sustained
- A03__P-smoke-001__r2 (replication pass)

## Ready (product portfolio)

| Priority | Cell id | Product | Phase | Status |
|----------|---------|---------|-------|--------|
| 1 | A03__P-smoke-001__signalboard__r1 | signalboard | smoke | in progress |
| 2 | A03__P-crud-001__signalboard__r1 | signalboard | crud | queued |

## Ready (replication — promoted defaults)

| Cell | Status |
|------|--------|
| A03__P-smoke-001__r3 | queued |
| A10__P-smoke-001__r2 | queued |
| A10__P-smoke-001__r3 | queued |

(`r1` scored in wave-1; A03 `r2` scored this run.)

## Research / process

- [x] Portfolio model: `projects/` = product testing folder
- [x] Product runbook + autonomous product loop
- [x] Standardize failure tags taxonomy
- [x] Decide replication default (`promoted-only` in CONTROLLER.json)
- [x] GitHub CLI for remote PR trails
