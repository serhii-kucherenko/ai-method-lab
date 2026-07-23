# Secure Tutor Desk — comprehensive blueprint

**Slug:** `secure-tutor-desk`  
**Display name:** Secure Tutor Desk  
**Paper:** https://arxiv.org/abs/2607.14601v1 (code: none published)

## Unique claim

Multi-LLM orchestrated tutor scoring (pedagogical role tags × learner intent) versus a flat single-model baseline. Not the authors' SYNAPSE platform.

## Pages (≥9)

Landing `/` · Jobs · Lifecycle · Scenario · Batch · Audit · Goldens · Honesty · Settings

## Features (≥15)

Org tenancy; roles; projects; tutor job CRUD; lifecycle; illegal reject; version conflict; batch siblings; scenario compare; audit; CSV; goldens; honesty; webhooks HMAC; rotate; pagination/search; rate-limit; try.html

## Aggregates (≥4)

Organization · Project · TutorJob · AuditEntry (+ OrgSettings, Member)

## Tests

≥25 dual-impl tutor-fit goldens; UI critical path per page; CRUD/workflow/integrate/scale/sustain suites
