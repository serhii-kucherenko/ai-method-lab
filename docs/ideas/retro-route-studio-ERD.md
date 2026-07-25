# ERD — Retro Route Studio

## Aggregates (≥4)

### OrgSettings
- id, name, webhookUrl, webhookSecret, rateLimitPerMin, defaultMemoryBias, defaultMode, honestyAckedAt

### Member
- id, email, role (`owner` | `planner` | `viewer`), invitedAt

### RoutePack
- id, name, version, status (`draft` | `active` | `archived`), targetSmiles, notes, routeCount, createdAt

### CandidateRoute
- id, packId, label, steps, branchingFactor, status (`open` | `tried` | `locked`), createdAt

### SearchMemoryCell
- id, packId, routeId?, triedPathHash, outcome (`dead_end` | `promising` | `solved`), intermediateIds[], notes, createdAt

### Intermediate
- id, packId, smilesLike, properties (mw, logP, reactiveFlags), availability, createdAt

### RouteCompare
- id, packId, routeId, memoryBias, qualityA, qualityB, winner, gap, createdAt

### AuditEntry
- id, action, actor, detail, at

### WebhookEvent
- id, idempotencyKey, payload, acceptedAt
