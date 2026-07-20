# Threat notes — Ledgerlite smoke

| Surface | Risk | Mitigation |
|---------|------|------------|
| Bearer tokens | Theft | Opaque random; HTTPS later |
| Passwords | Plaintext | Lab only; hash before sustain |
| IDOR on entries | Cross-user access | Ownership → 404 |

No secrets committed.
