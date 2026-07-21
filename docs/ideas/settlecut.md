# settlecut — idea dossier

**State:** `framed`  
**Framing:** method stress (not GTM vs ISO/RTO settlement vendors)  
**Opened:** 2026-07-21 after ndcswap sustain

## Problem (G1 draft)

Energy market participants must reconcile meter interval quantities against scheduled positions with loss factors and imbalance prices. Spreadsheet cutovers miss DST boundaries and loss-adjusted kWh.

## Unique claim (G2 candidate)

**If we remove interval meter rollup × loss factor × imbalance price settlement math, the remaining product is a generic ledger FSM.**

Non-isomorphic vs TE tables, FAR tables, protocol windows, lot DAG.

## Decision

**`framed`** — research only. No product until `ready_to_build`.
