# Loadbay

Bays + docks + loads (`staged → sealed → departed`). Weight must fit dock capacity. Dual checker seals before depart.

## Sustain criteria

- [x] API + UI, authz, health, migrations, README, vertical path, FINDINGS
- [x] Domain gate: weightKg ≤ dock.maxWeightKg
- [x] Dual distinct seals required before sealed → departed
