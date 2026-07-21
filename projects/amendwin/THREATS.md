# THREATS — amendwin

| ID | Threat | Mitigation |
|----|--------|------------|
| T1 | Cross-study visit leakage | Study membership authz on every route |
| T2 | Unauthorized amendment publish | `sponsor` role required |
| T3 | CRA locking history | Only `cdm`/`sponsor` may lock |
| T4 | Spoofed webhooks | HMAC + eventId idempotency |
| T5 | Retroactive reclassification | Locked visits store classification; scorer honors lock |
| T6 | Abuse of list endpoints | Rate limit + pagination |

Not in scope: full 21 CFR Part 11 product claim.
