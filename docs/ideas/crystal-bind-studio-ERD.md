# ERD — Crystal Bind Studio

## Aggregates

```text
OrgSettings 1──* Member
OrgSettings 1──* AuditEntry
OrgSettings 1──* WebhookEvent

CrystalPack 1──* StructureLane
CrystalPack 1──* DiffractionLane
CrystalPack 1──* DosLane
CrystalPack 1──* LanguageLane
CrystalPack 1──* BindProjection
CrystalPack 1──* RetrieveCompare
```

## Entities

| Entity | Key fields |
|--------|------------|
| **CrystalPack** | id, name, formula, spaceGroup, status (draft/ready/archived), notes |
| **StructureLane** | id, packId, name, fidelity, atomCountProxy, notes |
| **DiffractionLane** | id, packId, name, matchScore, peakRichness, notes |
| **DosLane** | id, packId, name, alignment, bandGapProxy, notes |
| **LanguageLane** | id, packId, name, clarity, descriptorText, notes |
| **BindProjection** | id, packId, name, coherence, crossModalAgreement, noiseLevel, modalityBias, status |
| **RetrieveCompare** | id, packId, bindId, name, multimodal (A), single (B), winner, gap |
| **Member** | id, email, role |
| **AuditEntry** | id, at, actor, action, detail |
| **OrgSettings** | name, bearer, webhook, rate limit, defaults |

Persistence: in-memory store (SQLite-shaped API surface; method-lab soft-sim).  
