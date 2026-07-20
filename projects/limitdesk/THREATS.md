# Threats

- Bearer tokens are opaque UUIDs (demo-grade)
- HMAC required on inbound webhooks
- ACL separates credit_officer/analyst/viewer; final release requires credit_officer
- Dual release prevents single-officer fund release
