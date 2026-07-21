# Threats — ndcswap

| ID | Threat | Mitigation |
|----|--------|------------|
| T1 | Cross-pharmacy leak | Bearer + membership |
| T2 | Dispense blocked TE pair | Dispense blocked when `allow_sub=0` |
| T3 | Spoofed webhooks | HMAC + eventId idempotency |
| T4 | AB1/AB2 cheat | Exact TE suffix match |
| T5 | Abuse | Rate limit + pagination |
