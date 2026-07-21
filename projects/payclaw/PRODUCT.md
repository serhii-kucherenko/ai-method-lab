# Payclaw

Firms + payroll runs + clawbacks (`requested → held → released`). Clawbacks must fit overpay headroom. Dual HR release before funds recovery.

## Sustain criteria

- [x] API + UI, authz, health, migrations, README, vertical path, FINDINGS
- [x] Domain gate: amount ≤ (paid − owed) − outstanding
- [x] Dual distinct HR releases required before held → released
