# Escrowrail

Workspaces + escrow accounts + disbursements (`requested → held → released`). Disbursements must keep balance above the floor. Dual escrow officer release before payout.

## Sustain criteria

- [x] API + UI, authz, health, migrations, README, vertical path, FINDINGS
- [x] Domain gate: amount ≤ balance − floor − outstanding
- [x] Dual distinct escrow officer releases required before held → released
