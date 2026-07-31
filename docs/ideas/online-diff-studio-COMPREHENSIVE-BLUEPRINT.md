# Blueprint — Online Diff Studio

## Pages (≥11)
| Route | Purpose |
|-------|---------|
| `/` | Marketing — sell MOC-ready online↔offline evidence |
| `/pricing` | Plant seats + diff-run usage |
| `/demo` | Import → diff → MOC pack → compare |
| `/onboarding` | Checklist + progress |
| `/flows` | ≥5 journeys |
| `/programs` | Approved offline revisions |
| `/online` | Online snapshots |
| `/diffs` | Diff runs + hunks |
| `/moc-packs` | Evidence packs for change owners |
| `/imports` | Artifact import batches |
| `/compare` | A drift vs B trust-last-download |
| `/scoreboard` | Area / drift leaderboard |
| `/settings` | Org, members, webhooks, export |
| `/honesty` | Soft-sim fence (no live PLC write) |

Forbidden: `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary nav

## Dual score
| Impl | Meaning |
|------|---------|
| **A** | Online↔approved offline diff + MOC pack |
| **B** | Trust-last-download baseline (no drift evidence) |

## Feature matrix (≥25)
1–5 Landing, pricing, demo, onboarding, flows  
6–10 Program revisions CRUD, online snapshots, import batches, search, archive  
11–15 Diff run, hunk list, MOC pack create, compare A/B, scoreboard  
16–20 Honesty, org, members, bearer auth, rate-limit feedback  
21–25 Webhook HMAC, export, features API, goldens API, audit trail  
26–28 try.html, in-app guide, plant-area filter  

## Aggregates
ProgramRevision, OnlineSnapshot, DiffRun, DiffHunk, MocPack, CompareResult (+ Org/Members/Audits)
