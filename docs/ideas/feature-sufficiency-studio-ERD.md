# ERD — Feature Sufficiency Studio

## Aggregates
1. **Org** — members, webhook, tokens  
2. **FeaturePack** — versioned feature catalog  
3. **ObservationMask** — which features are present  
4. **CohortCase** — patient/case with gold outcomes  
5. **SufficiencyRun** — A/B scores + delta  
6. **AuditEvent** — mutations  

## Relationships
Org 1—* FeaturePack 1—* ObservationMask  
Org 1—* CohortCase  
FeaturePack + ObservationMask + CohortCase → SufficiencyRun  
