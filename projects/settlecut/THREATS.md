# Threats — settlecut

| ID | Threat | Mitigation |
|----|--------|------------|
| T1 | Cross-account leak | Bearer + membership |
| T2 | Post rejected interval | Blocked when `ok=0` |
| T3 | Spoofed webhooks | HMAC + eventId idempotency |
| T4 | Double loss / post-price loss | Reject flags in settle math |
| T5 | Abuse | Rate limit + pagination |
