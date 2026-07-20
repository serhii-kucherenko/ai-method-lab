# Schedgate PRD

## Problem
Shared calendars need hard overlap prevention, with a dual-admin escape hatch for intentional double-books.

## Scope
- Calendars with ACL (owner / admin / member)
- Bookings: held → confirmed | cancelled
- Gate: confirm blocked when range overlaps a confirmed booking
- Gate: dual admin override unlocks conflict confirm
- HMAC webhooks, pagination, rate limits, minimal UI

## Non-goals
Recurring series, time zones UI, external calendar sync.
