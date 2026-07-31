# Online Diff Studio — ERD

Organization · Member · PlantArea · ProgramRevision · OnlineSnapshot · DiffRun · DiffHunk · MocPack · CompareResult · ImportBatch · AuditEntry · WebhookDelivery

## Relations
- Org has many PlantAreas and ProgramRevisions (approved offline)  
- OnlineSnapshot captures imported “running” artifact for an area/window  
- DiffRun compares approved revision ↔ online snapshot → DiffHunks  
- MocPack bundles diff + metadata for change owners  
- CompareResult stores path A (drift pack) vs path B (trust-last-download)
