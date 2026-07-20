# Threats

- Bearer tokens are opaque UUIDs (demo-grade)
- HMAC required on inbound webhooks
- ACL separates owner/dispatcher/mechanic; close requires owner
- Dual sign-off prevents single-actor close fraud
