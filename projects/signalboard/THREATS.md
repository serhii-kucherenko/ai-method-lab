# Threat notes — Signalboard smoke

| Surface | Risk | Mitigation |
|---------|------|------------|
| Bearer tokens | Theft | Opaque random |
| Passwords | Plaintext | Lab only |
| IDOR | Cross-user status access | Ownership → 404 |

Adversarial review: see `ADVERSARIAL_REVIEW.md`.
