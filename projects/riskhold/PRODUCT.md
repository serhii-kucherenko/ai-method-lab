# Riskhold

Books + positions (`open → held → cleared`). Hold only when exposure exceeds risk limit. Dual risk officer clear before release.

## Sustain criteria

- [x] API + UI, authz, health, migrations, README, vertical path, FINDINGS
- [x] Domain gate: hold only when exposure > riskLimit
- [x] Dual distinct risk officer clears required before held → cleared (when breached)
