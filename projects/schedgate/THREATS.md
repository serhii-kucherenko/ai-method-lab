# Threats

- Bearer tokens are opaque UUIDs (demo-grade)
- HMAC required on inbound webhooks
- ACL separates owner/admin/member; override requires owner or admin
- Dual override prevents single-admin force-book fraud
