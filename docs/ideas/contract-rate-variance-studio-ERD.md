# Contract Rate Variance Studio — ERD

Organization · Member · Vendor · ContractCatalog · CatalogSku · InvoiceBatch · InvoiceLine · RateVariance · DisputeCase · CompareResult · ImportBatch · AuditEntry · WebhookDelivery

## Relations
- Org has many Vendors, ContractCatalogs, InvoiceBatches, DisputeCases  
- CatalogSku belongs to ContractCatalog (SKU, unit, contracted rate, effective window)  
- InvoiceLine belongs to InvoiceBatch and optionally matches a CatalogSku  
- RateVariance = (invoice unit rate − contracted rate) × qty → $  
- DisputeCase binds recommended action before payment-run cutoff  
- CompareResult stores path A (catalog-matched) vs path B (invoice-as-billed)
