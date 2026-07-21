# tariffstep — Challenge C (offline tariff complexity)

## Attack

“The hard part is legal/tariff interpretation in PDFs, not software. Math alone will not hold value.”

## Probe

- Isolated the checkable core into explicit primitives: ordered blocks, rates, prior peak, current peak, ratchet percentage.
- Added rejects for malformed block structures and invalid ratchet bounds.

## Outcome

Challenge remains partially valid: tariff interpretation can still dominate. However, the computable core is now explicit and testable. Continue research; do not claim end-to-end tariff automation.
