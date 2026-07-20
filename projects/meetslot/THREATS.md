# Threats — meetslot smoke

| Surface | Risk | Mitigation / waiver |
|---------|------|---------------------|
| Bearer tokens | Theft | Ephemeral; short TTL in prod |
| Booking IDOR | Cross-user | Owner check → 404 |
| Login brute force | Waived for smoke |
| Passwords | Plaintext smoke-only |
