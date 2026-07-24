# PRD — Graph RAG Studio

## Problem

Single-pass knowledge-graph construction for RAG is noisy (dupes, weak links). Operators cannot see why an answer was retrieved.

## Solution

A GraphRAG **studio** with:

- Corpus projects  
- Multi-step pipelines: extract → consolidate (dedupe/summarize)  
- Graph explorer (nodes/edges, hop highlight)  
- Ask playground with citations + hop trail  
- Scenario compare (multi-step vs single-shot)  
- Pipeline run audit + export  

## Users

- Applied AI engineer (primary)  
- Domain analyst reviewing hop trails (secondary)  

## Success

Named scenarios show multi-step consolidation scoring better than single-shot noisy builds; live app serves marketing landing; honesty clear.
