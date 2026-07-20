# Migrations

| Version | Change | Rollback |
|---------|--------|----------|
| 001_initial | users, tokens, bookings | Drop tables |
| 002_rooms_rbac | rooms, members, tasks (+ notes), comments | Drop new tables |
| 003_booking_workflow | booking version + audit | Drop audit |
| 004_integrate | payments + webhook_events | Drop tables |
