# Threats

- Bearer tokens are opaque UUIDs (demo-grade)
- HMAC required on inbound webhooks
- ACL separates hr_lead/payroll/viewer; final release requires hr_lead
- Dual release prevents single-actor clawback fraud
