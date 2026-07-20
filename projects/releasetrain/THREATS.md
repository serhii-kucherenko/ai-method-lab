# Threats — Releasetrain

| Surface | Risk | Mitigation |
|---------|------|------------|
| Trains | Cross-tenant IDOR | Membership checks |
| Prod ship | Unauthorized deploy | Dual approval from lead/approver roles |
| Staging | Skipped QA | Checklist gate enforced server-side |
| Webhooks | Spoofing | HMAC timing-safe |
| Scale | Abuse | Rate limit + pagination caps |
