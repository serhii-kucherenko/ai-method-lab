# ERD — Attest Proof Studio

## Aggregates (≥4)

| Aggregate | Key fields |
|-----------|------------|
| **Claim** | id, title, statement, domain, status (draft/open/verified/archived), specificity, notes |
| **ToolAttestation** | id, claimId, toolKind (calc/search/code/retrieval), toolName, payloadDigest, coverage, freshness, status |
| **ProofChain** | id, claimId, name, status (draft/walking/sealed/archived), integrity, stepCount, currentStep |
| **KernelStep** | id, proofId, ordinal, ruleLabel, premiseRefs, conclusion, softSimOk |
| **EvidenceEntry** | id, claimId, attestationId?, sourceLabel, groundingScore, citationText |
| **AttestCompare** | id, claimId, proofId, input snapshot, attested quality, fluent quality, winner, gap |
| **Org / Member / Audit / WebhookEvent** | multi-tenant ops |

## Relationships

```
Org 1—* Member
Claim 1—* ToolAttestation
Claim 1—* ProofChain 1—* KernelStep
Claim 1—* EvidenceEntry
Claim 1—* AttestCompare
ProofChain *—1 AttestCompare (optional)
```

## Dual score inputs (soft-sim)

toolCoverage, evidenceGrounding, proofChainIntegrity, attestationFreshness, claimSpecificity, fluentConfidence, unsupportedClaims, noiseLevel, toolBias, profile
