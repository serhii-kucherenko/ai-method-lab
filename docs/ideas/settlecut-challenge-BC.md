# settlecut — Challenge B (interval + anti double-loss)

## Interval alignment

Fixture F: meter and schedule on different `interval_start` → reject. Held.

## Double loss / post-price loss

Fixtures Q and Y: flags that would apply loss twice or after price → reject. Held against algorithm paper.

## DST

Fixture P uses explicit offset (`-06:00`); no phantom hour invention. Soft hold for v0.

## Outcome

Core invariants solid for method stress. Proceed to G6 / scorecard.
