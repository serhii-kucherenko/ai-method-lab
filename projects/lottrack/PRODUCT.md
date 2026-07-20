# Lottrack

Warehouses + lots (`open → held → cleared`) + inspections. Quarantine hold requires hot severity. Dual QA clear before release from hold.

## Sustain criteria

- [x] API + UI, authz, health, migrations, README, vertical path, FINDINGS
- [x] Domain gate: hold only when max severity ≥ threshold
- [x] Dual distinct QA clears required before held → cleared (when hot)
