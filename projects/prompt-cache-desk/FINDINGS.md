# Prompt Cache Desk — findings

Cache-aware prompt compression under a two-tier hit-rate cost model (prefix size, compression ratio, ~3500 tier threshold, ρ, write vs read) vs vanilla / cache-only / query-aware baselines. Dual-impl goldens (≥28 fixtures) agree on A/B. Desk pattern: marketing landing at `/`, org, projects, cache jobs, lifecycle, batch, audit, webhooks, honesty. Never branded CAPC / Sonnet / PayPal. Authors' code: none published.

## What worked

- Closed-form session cost matching a loop dual-impl keeps goldens honest.
- Tier-preserving `r_max = floor(P / threshold)` is a crisp, testable design rule.
- Query-aware as the primary "naive" path makes cache breakage visible next to cache-aware savings.

## Limits

Method sketch only — not measured Anthropic spend, not a gateway product.
