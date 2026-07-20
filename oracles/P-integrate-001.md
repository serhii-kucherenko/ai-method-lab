# Oracle — P-integrate-001

Agents must not edit this file during a cell run.

## Required behaviors

1. Outbound call to configurable dependency succeeds and maps response into domain result
2. Webhook with valid HMAC is accepted and processed once
3. Webhook with invalid HMAC is rejected
4. Duplicate webhook delivery (same event id) does not double-apply side effects
5. Dependency 5xx/timeout produces a clear failure result (not silent success)

## Fail tags

`hmac-broken` · `not-idempotent` · `dependency-swallowed` · `approach-violation`
