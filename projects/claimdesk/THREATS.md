# Threats — Claimdesk

| Surface | Risk | Mitigation |
|---------|------|------------|
| Desks | Cross-tenant IDOR | Membership checks |
| Payout | Over-reserve fraud | payout ≤ reserve enforced server-side |
| Webhooks | Spoofing | HMAC timing-safe |
| Scale | Abuse | Rate limit + pagination caps |
