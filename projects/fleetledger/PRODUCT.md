# Fleetledger

Fleet assets + work orders (`open → parts → closed`). Domain gate: work order only when hours due exceed service interval. Dual mechanic sign-off before close.

## Sustain criteria

- [x] API + UI, authz, health, migrations, README, vertical path, FINDINGS
- [x] Domain gate: hoursDue > asset.serviceIntervalHours
- [x] Dual distinct sign-offs required before parts → closed
