# Webhook Retry Debt Studio — ARS brief

Platform reliability wedge (software-native).  
Related: `docs/ideas/webhook-retry-debt-studio-RELATED-WORKS.json` (retry / dead-letter neighbors).

## Job to be done

Platform leads need a **debt queue of failed and aging webhook deliveries** with destination blast radius before incident review - not another org-settings “test webhook” screen.

## Unique claim vs prior lab products

| Prior | Difference |
|-------|------------|
| Stale Flag Studio | Feature-flag hygiene - not webhook DLQ |
| Schema Drift Studio | Migration pack drift - not delivery backlog |
| Service Credit Studio | SLA credit $ - not webhook retry debt |
| Lab settings webhooks | Platform must-have test endpoint - not debt console |

**Claim:** If we remove **failed/pending delivery → age + blast-radius queue**, the remainder is a generic webhook config page.

## Buyer / money
- Buyer: Platform / reliability eng leads running outbound event fleets  
- Money: org seats + delivery-debt sync usage  
- Software-solvable: yes (CSV/JSON soft-sim deliveries; refuse live broker rewrite claims)

## Falsifiers
1. Teams already clear DLQs with zero pain → weak wedge  
2. No destination ownership map → theater  
3. Shipping only vendor queue UI (SQS/Kafka console) → kill

## Recommendation
Score under biz-rubric-v2. Queue behind six pack-ready climbs unless score clears A and a human arms it earlier.
