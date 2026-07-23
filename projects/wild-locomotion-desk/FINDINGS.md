# Wild Locomotion Desk — findings

## What worked

- Copying a mature desk scaffold (jobs / lifecycle / scenario / goldens) and rewriting the domain axes to skill · perception · transitions kept the 1h climb on track.
- Dual-impl goldens (≥30) force the multi-skill vs naive-flat delta to stay checkable.
- Marketing landing at `/` with desk behind `/jobs` passes the brand-first test without dumping CRUD into the hero.

## What failed or was hard

- Naïve string rebrand from a prior desk leaves broken axis names (`stage_gate`) and doubled honesty phrases — domain rewrite must be intentional, not find-replace only.
- Offline `try.html` must mirror the live scorer; partial renames break the offline path.

## Honesty

Method experiment inspired by https://arxiv.org/abs/2607.13579v1. Soft simulation only — not robot hardware, not a replacement for the authors' quadruped controller, never branded APT-RL.

## Sources

- Paper: https://arxiv.org/abs/2607.13579v1  
- Authors' code: none published  
