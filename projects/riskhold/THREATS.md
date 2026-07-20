# Threats

- Bearer tokens are opaque UUIDs (demo-grade)
- HMAC required on inbound webhooks
- ACL separates risk_officer/trader/viewer; clear requires risk_officer
- Dual clear prevents single-officer release from risk hold
