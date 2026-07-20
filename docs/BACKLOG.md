# Backlog (product phases queued)

## Done

- Approach ladder waves 1–6 (method discovery) — see matrix/
- Process: failure tags taxonomy (`docs/FAIL_TAGS.md`), replication default, GitHub CLI verified
- **clearpath × P-smoke-001** (A03+A10) — pass
- **clearpath × P-crud-001** (A03) — pass
- **clearpath × P-workflow-001** (A03+A10) — pass
- **clearpath × P-integrate-001** (A03+A10) — pass
- **clearpath × P-scale-001** (A03+A10) — pass
- A03__P-smoke-001__r2 (replication pass)

## Ready (product portfolio)

| Priority | Cell id | Product | Phase | Status |
|----------|---------|---------|-------|--------|
| 1 | A03__P-workflow-001__clearpath__r1 | clearpath | workflow | done |
| 2 | A03__P-integrate-001__clearpath__r1 | clearpath | integrate | done |
| 3 | A03__P-scale-001__clearpath__r1 | clearpath | scale | done |
| 4 | A03__P-sustain__clearpath__r1 | clearpath | sustain | queued |
| 5 | A03__P-smoke-001__ledgerlite__r1 | ledgerlite | smoke | queued |
| 6 | A03__P-smoke-001__signalboard__r1 | signalboard | smoke | queued |

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
