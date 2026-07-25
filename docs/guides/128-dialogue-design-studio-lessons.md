# Dialogue Design Studio — what we learned

Guide **128** for product `dialogue-design-studio`.

## Category
Eval / soft-sim bench for civic dialogue feed design: versioned feed packs, feed surfaces, open-minded badges, topic threads, dialogue runs, dual scorers, scoreboard.

## Practices shipped
- Dual-impl goldens (`dd-001`…`dd-030`) for `productive_open_minded_design` vs `engagement_maximizing_baseline`
- Distinct domain IA (packs / feeds / badges / topics / runs) — no `/jobs` `/lifecycle` `/scenario` desk clone
- Platform must-haves: bearer auth, members/org, webhook HMAC, audit, export, search, pagination, rate limits, scoreboard
- ≥5 named flows on `/flows` with actor / job / success / empty paths
- Marketing landing sells buyer outcome (productive open-minded dialogue feeds)
- Soft-sim honesty: not live social network, not content moderation authority, not attitude-change clearance, not authors’ platform brand

## Deferred
- Live social network deployment (explicitly out of scope)
- Content moderation enforcement tooling
- Attitude-change clearance claims

## Sources
- Paper: https://osf.io/preprints/socarxiv/dngcj_v3/
- Authors’ code: none
