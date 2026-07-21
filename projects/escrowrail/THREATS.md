# Threats

- Bearer tokens are opaque UUIDs (demo-grade)
- HMAC required on inbound webhooks
- ACL separates escrow_officer/clerk/viewer; final release requires escrow_officer
- Dual release prevents single-actor escrow drain
