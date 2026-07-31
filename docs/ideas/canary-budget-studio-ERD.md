# Canary Budget Studio — ERD

Organization · Member · Service · CanaryRollout · ErrorBudget · SignalSlice · PromoteDecision · CompareResult · ImportBatch · AuditEntry · WebhookDelivery

## Relations
- Org has many Services, CanaryRollouts, PromoteDecisions  
- CanaryRollout has window, traffic %, status  
- ErrorBudget has SLO target, remaining %, burn rate soft-sim  
- SignalSlice feeds error/latency samples for a window  
- PromoteDecision = promote / hold / rollback recommendation  
- CompareResult stores path A (budget-aware) vs path B (ship-anyway)
