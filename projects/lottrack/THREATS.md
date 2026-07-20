# Threats

- Bearer tokens are opaque UUIDs (demo-grade)
- HMAC required on inbound webhooks
- ACL separates qa_lead/inspector/clerk; clear requires qa_lead
- Dual QA clear prevents single-actor release from quarantine
