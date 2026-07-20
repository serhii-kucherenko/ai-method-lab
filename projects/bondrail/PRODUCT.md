# Bondrail

Workspaces + bonds + draws (`requested → held → released`). Draws must leave collateral above floor. Dual treasurer release before released.

## Sustain criteria

- [x] API + UI, authz, health, migrations, README, vertical path, FINDINGS
- [x] Domain gate: amount ≤ collateral − floor − outstanding
- [x] Dual distinct treasurer releases required before held → released
