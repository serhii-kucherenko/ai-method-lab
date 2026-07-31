# Stale Flag Studio — ERD

Organization · Member · FlagProject · FeatureFlag · FlagOwner · DebtFinding · FreezeWindow · CleanupCase · CompareResult · ImportBatch · AuditEntry · WebhookDelivery

## Relations
- Org has many FlagProjects, FreezeWindows, CleanupCases  
- FeatureFlag belongs to FlagProject (key, default, last-eval, expiry, status)  
- FlagOwner maps flag → member/squad  
- DebtFinding = expired / stuck-true / unused / orphaned  
- CleanupCase binds recommended action before freeze-by date  
- CompareResult stores path A (debt-aware) vs path B (ignore-stale)
