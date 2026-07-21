# Threats — crewleg

| ID | Threat | Mitigation |
|----|--------|------------|
| T1 | Cross-carrier data leak | Bearer auth + carrier membership |
| T2 | Illegal pairing released | Release blocked when `legal=0` |
| T3 | Spoofed webhooks | HMAC `x-signature` + eventId idempotency |
| T4 | Theater clock cheat | Report local must be last-acclimated theater (fixture V) |
| T5 | Abuse | Per-token rate limit; pagination |
