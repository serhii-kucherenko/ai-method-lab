# Threats

- Bearer tokens are opaque UUIDs (demo-grade)
- HMAC required on inbound webhooks
- ACL separates treasurer/clerk/viewer; final release requires treasurer
- Dual treasurer release prevents single-actor fund release
