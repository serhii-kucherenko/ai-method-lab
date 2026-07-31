# Egress Spill Studio — ERD

Organization · Member · CloudAccount · TransferBudget · EgressSlice · SpillFinding · InvoiceCase · CompareResult · ImportBatch · AuditEntry · WebhookDelivery

## Relations
- Org has many CloudAccounts, TransferBudgets, InvoiceCases  
- TransferBudget has window, $ cap, service/region scope  
- EgressSlice feeds usage for a window (GB + $ rate soft-sim)  
- SpillFinding = over-budget egress $ and/or unexpected path spill  
- InvoiceCase binds recommended action before invoice-by date  
- CompareResult stores path A (budget-aware) vs path B (ignore-egress)
