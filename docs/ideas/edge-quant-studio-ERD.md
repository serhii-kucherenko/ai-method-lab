# ERD — Edge Quant Studio

## Aggregates (≥4)

```
OrgSettings 1──* Member
OrgSettings 1──* ModelPack
OrgSettings 1──* EdgeTarget
OrgSettings 1──* ChannelPlan
OrgSettings 1──* RuntimePlan
OrgSettings 1──* MemoryBudget
OrgSettings 1──* CompareResult
OrgSettings 1──* AuditEntry
OrgSettings 1──* WebhookEvent
```

## Entities

| Entity | Key fields |
|--------|------------|
| **ModelPack** | id, name, paramScaleB, layerCount, activationSkew, status, notes |
| **EdgeTarget** | id, name, cpuClass (workstation\|laptop\|mobile), memoryMb, lutAffinity, simdWidth, notes |
| **ChannelPlan** | id, packId, targetId, name, avgBitBudget, saliencySkew, activationEnergy, paletteSpan, clusterRegularity, layoutMerge, memoryHeadroom, status, scores… |
| **RuntimePlan** | id, planId, name, clusterBlocks, kernelPaths, reorderTrafficPct, status |
| **MemoryBudget** | id, targetId, name, weightMb, kvMb, activationMb, headroomMb |
| **CompareResult** | id, name, input, channelAware, uniform, winner, gap |
| **Member** | id, email, role |
| **AuditEntry** | id, at, actor, action, detail |
| **WebhookEvent** | id, idempotencyKey, payload |
| **OrgSettings** | name, webhookUrl/secret, bearerToken, defaults, rateLimit |

## Scoring input (soft-sim)

`QuantInput`: saliencySkew, activationEnergy, avgBitBudget, paletteSpan, clusterRegularity, layoutMerge, memoryHeadroom, targetAffinity, profile (`channel` \| `uniform`).
