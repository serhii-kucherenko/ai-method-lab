# Threats — Screenlane

| Surface | Risk | Mitigation |
|---------|------|------------|
| Auth | Credential stuffing | Bearer tokens; plaintext demo passwords noted as lab-only |
| Boards | IDOR across tenants | Membership checks on every board-scoped route |
| Scores | Reviewer privilege abuse | Scores only in `screening`; write roles for decide |
| Webhooks | Spoofed inbound | HMAC SHA-256 + timing-safe compare |
| Scale | Abuse | Per-token rate limit; pagination caps |
| UI | XSS | JSON render in `<pre>`; no `innerHTML` of user content |
