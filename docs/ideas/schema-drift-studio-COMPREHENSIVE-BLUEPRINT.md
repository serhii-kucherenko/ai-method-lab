# Blueprint — Schema Drift Studio

## Pages (≥11)
| Route | Purpose |
|-------|---------|
| `/` | Marketing — sell drift evidence before the gate |
| `/pricing` | Org seats + drift-run usage tiers |
| `/demo` | Import pack → snapshot → drift → evidence pack |
| `/onboarding` | First-run checklist |
| `/flows` | ≥5 journeys (import, drift triage, gate pack, compare, export) |
| `/packs` | Approved migration packs |
| `/schemas` | Live / soft-sim schema snapshots |
| `/drifts` | Drift findings |
| `/gates` | Release gates + evidence cases |
| `/imports` | Pack / snapshot import batches |
| `/compare` | A pack-matched vs B live-as-is |
| `/scoreboard` | Service / drift leaderboard |
| `/settings` | Org, members, webhooks, export |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens`

## Dual score
| Impl | Meaning |
|------|---------|
| **A** | Pack-matched: approved migration pack ↔ live snapshot → drift findings |
| **B** | Live-as-is: ignore pack; treat live schema as ground truth only |

## Feature matrix (≥25)
1–5 Landing, pricing, demo, onboarding, flows  
6–10 Pack CRUD, checksum lock, search, service tag, archive  
11–15 Snapshot import, drift compute, gate case, compare A/B, evidence export  
16–20 Scoreboard, honesty, org settings, members, bearer auth  
21–25 Rate-limit feedback, webhook HMAC, export JSON/CSV, features API, goldens API  
26–28 Audit trail, try.html, in-app guide  

## Aggregates
DataService, MigrationPack, SchemaSnapshot, DriftFinding, ReleaseGate, EvidenceCase, CompareResult (+ Org/Members/Audits)
