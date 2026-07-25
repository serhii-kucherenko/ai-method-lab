# ERD — Fail Gate Studio

## Aggregates

### OrgSettings
- name, webhookUrl, webhookSecret, bearerToken, defaultGateBias, defaultMode, rateLimitPerMinute

### Member
- id, email, role (`owner` | `evaluator` | `viewer`)

### FailCase
- id, packId?, label, specialty, promptHash, modelAnswerHash, severityHint, status (`draft` | `open` | `gated` | `archived`), notes, createdAt

### GateTaxonomy
- id, caseId, gateType (`refusal` | `scope` | `harm` | `dosage` | `disclaimer` | `hallucination`), severityBand (`low` | `moderate` | `high` | `critical`), boundaryCode, status, notes, createdAt

### BoundaryInspection
- id, caseId, taxonomyId, boundaryFit (0–1), evidenceStrength (0–1), taxonomyCoherence (0–1), reviewerNotes, status, createdAt

### FailCompare
- id, name, caseId, taxonomyId, inspectionId, input, failGate (A), correctnessOnly (B), winner, gap, createdAt

### CasePack
- id, label, version, specialtyFocus, caseCount, status (`active` | `draft` | `archived`), notes, createdAt

### AuditEntry
- id, at, actor, action, detail

### WebhookEvent
- id, idempotencyKey, receivedAt, payload

## Relationships
CasePack 1—* FailCase *—1 GateTaxonomy *—1 BoundaryInspection *—* FailCompare  
Org 1—* Member; Org owns Audits + WebhookEvents
