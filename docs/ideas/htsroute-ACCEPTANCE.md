# htsroute — paper product acceptance (pre-build)

**Not a green light.** Same-day build still blocked. This is the acceptance outline to use *if/when* ready_to_build flips.

## Unique-claim first (must land before CRUD theater)

1. Domain module implements `routeSku` per `htsroute-algorithm.md`
2. Load all `docs/ideas/fixtures/htsroute-*.json` in product tests — expect routes match
3. Reject dual-approver / capacity / status-FSM as the “domain rule”

## Minimum smoke shape (when allowed)

- Tenancy: importer org + analyst identity
- Resources: SKU fact cards + route decisions (immutable once posted, or versioned)
- Workflow: draft facts → classify → locked route record
- Domain rule: 29 / 3003 / 3004 / Note 1(a) / reject (unique claim)
- Webhook: route-locked event (HMAC)
- Pagination: list classifications
- Authz: analyst vs auditor roles (not dual-signer ceiling)

## Sustain bar (later)

- ≥25 unique-claim tests still green (fixtures + API negatives)
- Expert cheat cases (enum tablet without dose; bulk+measured; pellets+retail) reject
- Concurrent two-SKU classify independence
- FINDINGS must say workflow experiment — not broker replacement

## Explicit defer

Full 10-digit HTS, Section 301, GRI 3 UI, CSOS/Form 222.
