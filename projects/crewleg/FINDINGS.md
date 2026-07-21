# Crewleg findings

## Status

**Sustained** through smoke → crud → workflow → integrate → scale under A03+A10.

## Framing

Method stress, not GTM. Kill A (crew systems exist) stands commercially — digests must not claim Jeppesen/AIMS replacement.

## Unique claim held

- Table B FDP by acclimated report time × segment count
- Unacclimated −30 minutes
- §117.25(e) ≥10h rest; §117.25(b) 30-in-168
- Deadhead ≠ segment; augmented/extension cheats rejected in v0
- Illegal pairings cannot be released

Fixtures A–Y green in product tests (25).

## Ladder notes

1. Smoke: legality API, illegal list, UI, THREATS
2. Crud: list/indexes; scheduler cannot release
3. Workflow: draft→released→closed; audit; version conflict
4. Integrate: HMAC webhooks; release dep fail → 502
5. Scale: ≥250 pairings walk; rate limit 429 + Retry-After

## Method stress takeaway

A03+A10 can sustain a **regulatory table-lookup** product (FAR 117) without collapsing to dual-gate.
