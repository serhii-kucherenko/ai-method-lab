# Experiment backlog

## Queued (autonomous)

| Priority | Product idea | Method | Notes |
| --- | --- | --- | --- |
| 1 | **datacontract** | A03 + A10 | Data contracts: schemas, producers/consumers, breach→remediate→waived; SLO gates. |
| 2 | tentcamp | A03 + A10 | Deferred clone-tier. |

## Recently completed (comprehensive wave)

| Product | Tests | Gate stressed |
| --- | --- | --- |
| incidentrail | 7 | sev1 ack + postmortem |
| vendorvault | 17 | attestation + critical avg |
| grantlane | 24 | dual sign-off + clawback |
| releasetrain | 19 | dual approval + rollback |
| claimdesk | 17 | payout ≤ reserve |
| screenlane | 18 | scorecards |

## Strategy

Multi-aggregate + cross-entity gates. Clone-tier deferred. Loop continues until hard_stop.
