# ERD — Sign Stream Studio

## Aggregates (≥4)

```
OrgSettings 1──* Member
OrgSettings 1──* AuditEntry
OrgSettings 1──* WebhookEvent

SignStream 1──* SentenceSegment
SignStream 1──* LatencyBudget
SignStream 1──* GlossaryEntry
SignStream 1──* StreamCompare
```

## Entities

| Entity | Key fields |
|--------|------------|
| **SignStream** | id, label, languagePair, signerPace, motionStability, occlusionNoise, status, notes |
| **SentenceSegment** | id, streamId, glossText, boundaryConfidence, startMs, endMs, status |
| **LatencyBudget** | id, streamId, budgetMs, jitterMs, flushPolicy, status |
| **GlossaryEntry** | id, streamId, term, coverage, priority, notes |
| **StreamCompare** | id, streamId, input, realtime, offlineBatch, winner, gap |
| **OrgSettings** | name, bearerToken, webhookUrl/secret, rateLimit, defaults |
| **Member** | id, email, role |
| **AuditEntry** | id, at, actor, action, detail |
| **WebhookEvent** | id, idempotencyKey, payload |

## Relationships
- Segments, budgets, glossary rows, and compares hang off a stream.
- Compares snapshot soft-sim inputs + A/B scores at compare time.
