# Graph RAG Studio — product

**Display name:** Graph RAG Studio  
**Slug:** `graph-rag-studio`  
**Paper:** https://arxiv.org/abs/2607.11683v1  
**Authors’ code:** https://github.com/RaguTeam/RAGU  

## Buyer outcome

Applied-AI engineers run **multi-step GraphRAG** (extract → consolidate) on a corpus, ask questions with **hop trails + citations**, and prove multi-step quality beats single-shot noisy builds.

## Claim (A vs B)

- **A (good):** multi-step extract + consolidate (dedupe/summarize) quality  
- **B (naive):** single-shot noisy graph score  

Soft simulation; dual-impl goldens ≥30 agreeing. Not a rebrand of RAGU / Meno-Lite.

## Pages (≥8)

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/corpora` | Corpus projects |
| `/pipelines` | Multi-step runs + stage timeline |
| `/graph` | Graph explorer + hop highlight |
| `/ask` | Retrieval playground |
| `/scenarios` | Multi-step vs single-shot |
| `/runs` | Audit + CSV export |
| `/settings` | Org, members, webhook, goldens |
| `/honesty` | Experiment fence + Sources |

## Features (≥20)

Landing, corpus CRUD/search, pipeline create, stage advance, illegal stage reject, compact/heavy profile, extract stats, consolidate/dedupe stats, graph list/search, hop highlight, ask session, citations, trail JSON export, scenario compare, scenario export, audit log, CSV export, members/roles, webhook HMAC, rate-limit 429, pagination, dual-impl goldens panel, honesty, try.html, in-app guide link.

## Sustain checklist

- [x] ≥20 features, ≥8 pages, GraphRAG-native IA (not desk clone)
- [x] Dual-impl goldens ≥30
- [x] `npm run build` + `test/app-up.test.ts`
- [x] PRODUCT / README / FINDINGS / try.html / guide
- [x] PORTFOLIO Complete
