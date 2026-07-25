# ERD — Video Track Studio

## Aggregates

```
OrgSettings 1──* Member
OrgSettings 1──* AuditEntry
OrgSettings 1──* WebhookEvent

Clip 1──* Character          (cast on episode)
Clip 1──* TrackProbe
Character 1──* TrackProbe
TrackProbe 1──* FailureDiagnosis
Clip + Character + Probe ──> TrackCompare
```

### Clip
id, title, showLabel, durationMin, frameCount, status, notes, createdAt

### Character
id, clipId, name, genderCue, castRank, outfitChangeCount, notes, createdAt

### TrackProbe
id, clipId, characterId, probeKind (name_swap | gender_swap | open_ended | frame_boost), swapTargetName, sensitivity, temporalCoverage, identityBind, fluencyPrior, noise, status, notes, createdAt

### FailureDiagnosis
id, probeId, taxonomy (name_invariant | gender_cue | option_bias | open_ended_collapse | shallow_frames), severity, evidenceNote, createdAt

### TrackCompare
id, name, clipId, characterId, probeId, input, trackAware (A), fluency (B), winner, gap, createdAt

### Supporting
Member, AuditEntry, OrgSettings, WebhookEvent
