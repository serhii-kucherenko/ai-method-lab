# Threat notes — Clearpath

| Surface | Risk | Mitigation |
|---------|------|------------|
| Bearer tokens | Token theft | HTTPS in deploy; opaque tokens; no token in logs |
| Password storage | Plaintext in SQLite | Lab MVP; hash before sustain |
| User enumeration | Register 409 | Documented |
| IDOR on requests | Cross-user access | Ownership → 404 |
| Project RBAC | Over-privileged roles | owner/member/viewer checks |
| Illegal transitions | Bypass review | Explicit legal graph; 409 on illegal |
| Concurrent updates | Lost updates / corruption | Optimistic `version`; one wins, one 409 |
| Audit gaps | No accountability | `request_audit` actor/from/to/at |

No secrets committed. Migrations: `001_initial` → `002_add_priority` → `003_request_workflow`.
