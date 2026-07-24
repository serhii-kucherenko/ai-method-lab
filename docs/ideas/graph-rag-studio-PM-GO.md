# PM GO — Graph RAG Studio

**Go:** yes  
**Date:** 2026-07-24  

## Buyer story

Teams building GraphRAG prototypes waste days on one-shot graph extraction that produces duplicate entities and weak retrieval. They need a **studio** to run multi-step extraction/consolidation, inspect the graph, and evaluate retrieval — inspired by RAGU’s architecture, without claiming to be RAGU.

## Selling points

1. Multi-step extract → consolidate (dedupe + summarize) instead of one noisy pass  
2. Hop-trail answers: see which graph edges grounded the reply  
3. Compact vs heavy construction profiles (inspired by Meno-Lite accessibility claim)  
4. Scenario compare: multi-step vs single-shot graph build quality  
5. Corpus projects with auditable pipeline runs  

## Non-goals

- Shipping RAGU binary or Meno-Lite weights as our product  
- Isomorphic jobs/lifecycle/scenario/goldens desk shell  
- Clinical diagnostic claims  

## Go criteria

≥20 real features, ≥8 distinct pages with GraphRAG-native IA, DESIGN note, live app smoke, honesty fence.
