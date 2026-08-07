# Phase 3 UI-SPEC: Studio UI

**Phase:** 03-studio-ui  
**Source:** product `DESIGN.md` + CONTEXT D-01–D-08  
**Scope:** Domain IA pages only (not `/` hero redesign)

## Shell

- Header: brand link → `/` · primary nav: Commitments · Coverage · Gaps · Renewals · Imports · Compare · Scoreboard
- Soft-sim hint line OK; no desk-clone chrome
- Do not put marketing hero stats into studio chrome

## Page contracts

| Route | Work surface | Filter | Empty | Error |
|-------|--------------|--------|-------|-------|
| `/commitments` | Inventory table | search / provider / archived | Import or add first commit | 401/load fail copy |
| `/coverage` | Snapshot $/% + coverage bar fill | account / window | Need usage import | 422/missing usage surfaced |
| `/gaps` | Findings table | kind / account | No gaps in window | load fail |
| `/renewals` | Renew-by queue from lock ends | account / date | No renew-by dates | load fail |
| `/imports` | Batch list + failed detail | status | No imports yet | failed batch detail |
| `/compare` | A vs B + delta $ | account / run | Need inventory + usage | 422 soft-sim |
| `/scoreboard` | Account gap leaderboard | provider / account | Empty org | load fail |

## Motion

1. Coverage bar fill on `/coverage` (commit-matched)  
2. Gap/compare row highlight when A/B result loads  

## Anti-patterns

- Cards wrapping non-interactive summary grids
- Primary nav to audit/goldens or isomorphic desk shells
- Dark cyber FinOps skin
