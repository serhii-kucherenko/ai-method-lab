# ERD — Drive Horizon Studio

## Aggregates (≥4)

```
OrgSettings 1──* Member
OrgSettings 1──* AuditEntry
ScenarioPack 1──* CoarseScene
CoarseScene 1──* DetailGenerator
CoarseScene + DetailGenerator ──* HorizonCompare
ScenarioPack *──* HorizonCompare (optional packId)
WebhookEvent (idempotent by key)
```

## Entities

### OrgSettings
name, webhookUrl, webhookSecret, bearerToken, defaultHorizonBias, defaultMode, rateLimitPerMinute

### Member
id, email, role (owner | evaluator | viewer)

### ScenarioPack
id, label, version, corridorFocus, sceneCount, status, notes, createdAt

### CoarseScene
id, packId?, label, corridor, structureHash, horizonSteps, structureFit, status, notes, createdAt

### DetailGenerator
id, sceneId, fidelity, temporalConsistency, textureRichness, reviewerNotes, status, createdAt

### HorizonCompare
id, name, sceneId, generatorId, input, hierarchical (A), flat (B), winner, gap, createdAt

### AuditEntry
id, at, actor, action, detail

### WebhookEvent
id, idempotencyKey, receivedAt, payload
