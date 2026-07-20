# Threats — Grantlane

| Surface | Risk | Mitigation |
|---------|------|------------|
| Programs | Cross-tenant IDOR | Membership checks |
| Disbursement | Over-budget fraud | paid_total ≤ approved_amount enforced server-side |
| Activation | Single-reviewer bypass | Dual distinct admin/reviewer sign-off gate |
| Webhooks | Spoofing | HMAC timing-safe |
| Scale | Abuse | Rate limit + pagination caps |
