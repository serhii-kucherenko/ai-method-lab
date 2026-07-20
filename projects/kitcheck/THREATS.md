# Threats — kitcheck smoke

| Surface | Risk | Mitigation / waiver |
|---------|------|---------------------|
| Bearer tokens | Theft → full loan CRUD | Ephemeral tokens; short TTL in prod |
| Loan IDOR | Cross-user access | Owner check → 404 |
| Login | Brute force | Waived for smoke |
| Passwords | Plaintext in DB | Smoke/dev only; never commit secrets |
