# Commitment Coverage Studio — ERD

Organization · Member · CloudAccount · Commitment · UsageSlice · CoverageSnapshot · GapFinding · RenewalCase · CompareResult · ImportBatch · AuditEntry · WebhookDelivery

## Relations
- Org has many CloudAccounts, Commitments, RenewalCases  
- Commitment belongs to CloudAccount (SP/RI/CUD-like type, term, $ rate)  
- UsageSlice feeds CoverageSnapshot for a window  
- GapFinding = unused commit $ and/or on-demand spill $  
- RenewalCase binds recommended action before renew-by date  
- CompareResult stores path A (commit-matched) vs path B (on-demand-blind)
