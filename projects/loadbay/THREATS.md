# Threats

- Bearer tokens are opaque UUIDs (demo-grade)
- HMAC required on inbound webhooks
- ACL separates owner/dispatcher/checker; depart requires owner
- Dual seal prevents single-actor departure fraud
