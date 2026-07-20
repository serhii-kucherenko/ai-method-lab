# P-integrate-001 — External API + webhook stub

```yaml
id: P-integrate-001
tier: P-integrate
effort: 3–5 days
oracle: oracles/P-integrate-001.md
```

## Goal

Integrate a third-party-like HTTP dependency (mockable) and accept inbound webhooks with signature verification.

## In scope

- Outbound client to a fake payment/status API (URL configurable; default mock server in tests)
- Inbound webhook endpoint with HMAC signature check
- Idempotent webhook handling (duplicate delivery safe)
- Failure modes: timeout / 5xx from dependency surfaced cleanly

## Out of scope

- Real vendor accounts, retries UI, multi-region failover

## Success metric

Oracle green for happy path, bad signature, duplicate webhook, and dependency failure.

## Stress focus

Integration boundaries, idempotency, secret handling.
