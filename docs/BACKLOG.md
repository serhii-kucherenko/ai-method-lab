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
- **signalboard × P-smoke-001** (A03+A05) — pass
- **signalboard × P-crud-001** (A03+A05) — pass
- **signalboard × P-workflow-001** (A03+A05) — pass
- **signalboard × P-integrate-001** (A03+A05) — pass
- **signalboard × P-scale-001** (A03+A05) — pass
- **signalboard × P-sustain** (A03+A05) — pass — product sustained
- A03__P-smoke-001__r2 (replication pass)
- A03__P-smoke-001__r3 (replication pass — A03 triple-test 3/3)

## Ready (product portfolio)

| Priority | Cell id | Product | Phase | Status |
|----------|---------|---------|-------|--------|
| — | (portfolio wave complete) | — | — | all three products sustained |

## Ready (replication — promoted defaults)

| Cell | Status |
|------|--------|
| A10__P-smoke-001__r2 | queued |
| A10__P-smoke-001__r3 | queued |

(`r1` scored in wave-1; A03 r2+r3 scored this run — primary triple-test complete.)

## Research / process

- [x] Portfolio model: `projects/` = product testing folder
- [x] Product runbook + autonomous product loop
- [x] Standardize failure tags taxonomy
- [x] Decide replication default (`promoted-only` in CONTROLLER.json)
- [x] GitHub CLI for remote PR trails
