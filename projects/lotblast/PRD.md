# PRD — lotblast smoke

## Problem

Need deterministic recall blast radius from lot genealogy edges, with FDA-shaped CTE export.

## Success

- Forward blast / backward trace / channel math / overconsume match `docs/ideas/fixtures/lotblast-*.json`
- Receiving / transformation / shipping writes enforce location KDEs + TLC source XOR
- Mock recall lock returns blast-scoped export envelope
- Plant isolation; `recall_admin` opens recalls; webhook on `recall.opened`; blast member pagination; rate limit; `/health` migrations

## Non-goals

Full FSMA product, harvesting tabs, dual-signer ceiling gates, commercial GTM.
