# Amendwin findings

## Status

**Sustained** through smoke → crud → workflow → integrate → scale under A03+A10.

## Framing

Method stress, not GTM. Kill A (EDC exists) stands commercially — digests must not claim Medidata/Veeva replacement.

## Unique claim held

- Visits scored against protocol version effective on visit date
- Locked visits never reclassify after later amendments
- Important = missed/out_of_window ∩ sponsor important codes
- Unordered `effective_at` publish rejected

Fixtures A–F green in product tests.

## Ladder notes

1. Smoke: study/visit API, amendment split, important list, UI, THREATS
2. Crud: list pagination indexes; CRA cannot publish
3. Workflow: visit `open→locked` only; audit actor/from/to; optimistic version conflict
4. Integrate: HMAC inbound webhooks + `eventId` idempotency; amendment publish maps dep fail → 502
5. Scale: ≥250 visits walk without gaps/dupes; rate limit 429 + Retry-After

## Method stress takeaway

A03+A10 can sustain a **temporal protocol-window** product without collapsing to dual-gate. Temporal effective_at + lock immutability is the non-isomorphic core.
