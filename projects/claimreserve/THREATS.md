# Threats

- Bearer tokens are opaque UUIDs (demo-grade)
- HMAC required on inbound webhooks
- ACL separates adjuster/clerk/viewer; final settle requires adjuster
- Dual settle prevents single-actor reserve payout
