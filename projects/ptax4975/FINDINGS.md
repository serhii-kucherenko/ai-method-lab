# ptax4975 findings

## Research hold (pre-product)

- Framing started **2026-07-22T12:25:00.000Z**; hours hold + tick floor cleared → flip
- **35** dual-green paper fixtures; Kill A stands (counsel / Form 5330)
- Three honesty fences: FMV, taxable-period end dates, excess-compensation

## Ladder

| Phase | Cell | Tests |
|-------|------|-------|
| smoke | `A03__P-smoke-001__ptax4975__r1` | 37 |
| crud | `A03__P-crud-001__ptax4975__r1` | 38 |
| workflow | `A03__P-workflow-001__ptax4975__r1` | 39 |
| integrate | `A03__P-integrate-001__ptax4975__r1` | 42 |
| scale | `A03__P-scale-001__ptax4975__r1` | 44 |
| sustain | `A03__P-sustain__ptax4975__r1` | **58** |

## Sustain — GREEN (product complete)

- 7 pages + offline `try.html`; 35 dual goldens; Kill A + three fences in digests
- Concurrent batch independence; rate-limit 429; webhook idempotent; cross-org isolation
- Counsel / Form 5330 still win commercially — method / FP&A experiment only

## Digests

Use `docs/ideas/ptax4975-DIGEST-HOLD.md` language — counsel still wins; toys not filed returns.
