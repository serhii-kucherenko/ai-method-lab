# PRD — Edge Quant Studio

## Problem

Edge CPU LLM deployers face coarse W3/W4 operating points that either leave memory slack unused or overshoot latency/memory. Channel-aware mixed precision exists in research, but teams lack a studio to **plan** per-channel bit widths under a fractional budget, compare against uniform baselines, and soft-sim the compile/runtime path — with honesty that numbers are method-lab estimates, not silicon.

## Buyer outcome

“I can defend a channel-aware bit plan vs uniform W3/W4 before I spend a week on device.”

## Personas

| Role | Need |
|------|------|
| ML platform eng | Model packs, bit budgets, exportable plans |
| Edge infra eng | Target profiles, runtime/cluster plan, memory fence |
| Eng manager | Compare board + honesty for go/no-go |

## Functional requirements

1. Model pack registry (CRUD + search/filter)  
2. Edge CPU target profiles (class, memory envelope, SIMD/LUT affinity)  
3. Channel bit-width plan board (palette {2,3,4,8,16}, average-bit budget)  
4. Dual score: channel-aware (A) vs uniform baseline (B)  
5. Compare view with winner + gap  
6. Compile/runtime plan soft-sim (cluster regularity, layout merge)  
7. Latency/memory honesty budgets  
8. Org settings, members, bearer auth, rate limit, webhook + idempotency  
9. CSV/JSON export of plans and compares  
10. Features inventory API + goldens sample API  
11. Marketing landing with selling points, features, Sources  
12. Honesty page  

## Non-functional

- Soft-sim only; fence on every scored surface  
- Not isomorphic desk; not clone of Legacy Infer / Prompt Cache / Model Compile IA  
- ≥20 features, ≥8 pages, ≥30 dual goldens, live build + app-up  

## Acceptance

All blueprint pages live; dual goldens green; `npm test` + `npm run test:app-up` green; README + try.html + guide 62 shipped.
