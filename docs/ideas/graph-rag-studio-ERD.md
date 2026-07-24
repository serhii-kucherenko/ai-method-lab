# ERD — Graph RAG Studio

Aggregates:

1. **Organization** — tenancy, members, webhook settings  
2. **CorpusProject** — name, domain tag, doc count  
3. **PipelineRun** — stage (extract|consolidate|ready|failed), profile (compact|heavy), version  
4. **GraphSnapshot** — entities, relations, dedupe stats  
5. **AskSession** — query, answer, hop trail, citations  
6. **AuditEntry** — who/what/when  

Relations: Org 1—* CorpusProject 1—* PipelineRun 1—1 GraphSnapshot; CorpusProject 1—* AskSession; Org 1—* AuditEntry.
