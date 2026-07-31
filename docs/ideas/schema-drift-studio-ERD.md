# Schema Drift Studio — ERD

Organization · Member · DataService · MigrationPack · SchemaSnapshot · DriftFinding · ReleaseGate · EvidenceCase · CompareResult · ImportBatch · AuditEntry · WebhookDelivery

## Relations
- Org has many DataServices, MigrationPacks, ReleaseGates, EvidenceCases  
- MigrationPack is the approved golden (version, checksum, object list)  
- SchemaSnapshot is live (or soft-sim) schema at a point in time  
- DriftFinding = added / removed / changed objects vs pack  
- EvidenceCase binds recommended action before gate-by date  
- CompareResult stores path A (pack-matched) vs path B (live-as-is)
