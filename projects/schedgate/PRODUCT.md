# Schedgate

Calendars + bookings (`held → confirmed | cancelled`). Confirming into an overlap requires dual admin override.

## Sustain criteria

- [x] API + UI, authz, health, migrations, README, vertical path, FINDINGS
- [x] Domain gate: overlap with confirmed bookings blocks confirm
- [x] Dual distinct admin overrides required to force-confirm conflicts
