# THREATS — lotblast

| ID | Threat | Mitigation |
|----|--------|------------|
| T1 | Cross-plant genealogy / recall leakage | Plant membership authz on every CTE and blast route; non-members get 403/404 |
| T2 | Unauthorized recall lock / partner notify | `recall_admin` role required for `POST .../recalls` |
| T3 | Spoofed inbound webhooks | HMAC `x-signature` with shared secret; timing-safe compare |
| T4 | Overconsume inventing phantom genealogy | Transform writes reject when `wouldOverconsume` |
| T5 | Incomplete location KDEs in export | Reject CTE writes missing phone/street; TLC source XOR |
| T6 | Abuse / scrape of blast endpoints | Per-token rate limit; pagination on blast members |

Not in scope for smoke: full FSMA attestation, encryption at rest, SSO.
