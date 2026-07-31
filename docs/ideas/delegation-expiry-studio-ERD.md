# Delegation Expiry Studio — ERD

Organization · Member · AgentFleet · Agent · ToolPermission · DelegationGrant · ExpiryEvent · PolicyTemplate · CompareResult · AuditEntry · WebhookDelivery

## Relations
- Org has AgentFleets → Agents  
- DelegationGrant binds Agent + ToolPermission with `expires_at`  
- ExpiryEvent records auto/manual expiry  
- PolicyTemplate seeds default TTLs  
- CompareResult stores TTL lifecycle (A) vs permanent-scope (B)  
- AuditEntry append-only for grant/expire/deny
