# Webhook Retry Debt Studio — ERD

Organization · Member · Destination · DeliveryAttempt · DebtFinding · IncidentReview · CleanupCase · CompareResult · ImportBatch · AuditEntry · WebhookDelivery

## Relations
- Org has many Destinations, IncidentReviews, CleanupCases  
- Destination has URL, owner, severity class  
- DeliveryAttempt belongs to Destination (status, age, payload hash soft-sim)  
- DebtFinding = failed / pending / dead-letter by age bucket  
- CleanupCase binds recommended action before review-by date  
- CompareResult stores path A (debt-aware) vs path B (ignore-backlog)
