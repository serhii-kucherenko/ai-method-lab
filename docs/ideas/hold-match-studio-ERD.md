# ERD — Hold Match Studio

## Aggregates

```
OrgSettings 1──* Member
OrgSettings 1──* AuditEntry
OrgSettings 1──* WebhookEvent

MatchCandidate 1──* HoldDecision
MatchCandidate 1──* ExperienceLane
MatchCandidate 1──* MatchTimeline
HoldDecision + MatchCandidate ──> HoldCompare
```

### MatchCandidate
id, orderLabel, driverLabel, zone, pickupEtaMin, fareProxy, supplyDemandStress, status, notes, createdAt

### HoldDecision
id, matchId, tier (release_now | hold_short | hold_long | guardrail_block), holdBudgetSec, passengerWaitRisk, driverIdleCost, cancelBeforeAccept, cancelAfterAccept, status, notes, createdAt

### ExperienceLane
id, matchId, side (passenger | driver), waitScore, cancelScore, completionScore, incomeOrFareScore, notes, createdAt

### MatchTimeline
id, matchId, events (JSON array of {atSec, kind, detail}), horizonSec, notes, createdAt

### HoldCompare
id, name, matchId, holdId, input, experienceAware (A), firstFeasible (B), winner, gap, createdAt

### Supporting
Member, AuditEntry, OrgSettings, WebhookEvent
