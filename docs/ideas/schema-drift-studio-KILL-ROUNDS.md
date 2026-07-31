# Schema Drift Studio — kill rounds

## Kill 1 — Migration tools already detect drift
**Attack:** Flyway / Liquibase / Atlas already validate.  
**Answer:** Survive as a **release-gate evidence pack** with dual baseline (pack-matched vs live-as-is) and buyer UX for freeze/release owners - not a vendor CLI wrapper. If IA is migrate-up only, kill.  
**Verdict:** answered conditional.

## Kill 2 — Isomorphic Online Diff
**Attack:** Noun-swap of OT online↔offline diff.  
**Answer:** Spine is **DB/API schema vs approved migration pack**. Fail if screens are PLC programs or plant MOC.  
**Verdict:** answered with fence.

## Kill 3 — Live prod write claims
**Attack:** Claiming to apply migrations to production is out of method-lab honesty.  
**Answer:** Soft-sim inventory + diff only; refuse live DDL authority. If we brand as prod migrator, kill.  
**Verdict:** answered with fence.

## Outcome
Survives research pending score; prefer if release-evidence pack claim stays locked.
