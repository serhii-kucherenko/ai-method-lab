# Schema Drift Studio — PM GO

**Decision:** GO (research → depth pack; no `projects/` until DESIGN + blueprint exist)  
**Buyer:** Platform / data eng leads with migration-gated releases  
**Outcome:** See live schema vs approved migration pack drift before the release gate  
**Dual claim:** pack-matched evidence path (A) vs live-as-is / ignore-pack path (B)  
**Score:** B 74 (`biz-rubric-v2`)  
**Fence:** Release-evidence pack claim; refuse Flyway UI clone, live DDL authority, Online Diff OT mirror
