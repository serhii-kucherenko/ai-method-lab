# Threats

- Bearer tokens are opaque UUIDs (demo-grade)
- HMAC required on inbound webhooks
- ACL separates counsel/clerk/viewer; final close requires counsel
- Dual close prevents single-actor share issuance
