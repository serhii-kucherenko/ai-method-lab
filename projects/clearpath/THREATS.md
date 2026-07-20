# Threat notes — Clearpath smoke

| Surface | Risk | Mitigation |
|---------|------|------------|
| Bearer tokens | Token theft | HTTPS in deploy; tokens opaque random; no token in logs |
| Password storage | Plaintext in memory store | Acceptable for smoke; hash before crud/sustain |
| User enumeration | Register 409 on duplicate email | Documented; consider generic errors later |
| IDOR on `/requests/:id` | Cross-user access | Ownership check → 404 |

No secrets committed. Migration: none this phase (in-memory store).
