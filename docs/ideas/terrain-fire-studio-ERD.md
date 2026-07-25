# ERD — Terrain Fire Studio

## Aggregates

### TerrainPack
- id, label, region, elevationSpanM, fuelLoadIndex, version, status, notes, createdAt

### AerialRefresh
- id, packId, captureDate, resolutionCm, cloudCover, overlapRatio, status, notes, createdAt

### AlignmentPlan
- id, packId, aerialId, controlPointDensity, elevationPriorStrength, seamBudgetM, status, notes, createdAt

### RefreshCompare
- id, name, packId, aerialId, planId, input, physicsAware (A), naiveOverlay (B), winner, gap, createdAt

### OrgSettings
- name, webhookUrl, webhookSecret, bearerToken, defaultBias, rateLimitPerMinute

### Member
- id, email, role (owner | planner | viewer)

### AuditEntry
- id, at, actor, action, detail

### WebhookEvent
- id, idempotencyKey, receivedAt, payload

## Relationships
- TerrainPack 1—* AerialRefresh
- TerrainPack 1—* AlignmentPlan (* → AerialRefresh)
- RefreshCompare references Pack + Aerial + Plan
- Org owns Members, Audits, WebhookEvents
