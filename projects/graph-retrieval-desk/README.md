# Graph Retrieval Desk

Method-lab product sourced from a simple-papers digest. Display name stays **Graph Retrieval Desk**. Never brand this desk with the paper project's short name.

## Paper

- **Id:** 2607.11683
- **Title:** RAGU: A Multi-Step GraphRAG Engine with a Compact Domain-Adapted LLM
- **URL:** https://arxiv.org/abs/2607.11683v1
- **Code:** https://github.com/RaguTeam/RAGU

## Honesty

This desk is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' multi-step graph retrieval engine at the paper's code URL.

## Feature matrix (18 ≥15)

See [PRODUCT.md](./PRODUCT.md) for the full list. Highlights: org tenancy, roles, projects, retrieval jobs, lifecycle + illegal rejects, optimistic versions, batch transitions, scenario compare, audit CSV, goldens (≥25), webhooks HMAC/idempotency, settings RBAC, pagination/search, rate-limit feedback, offline try, tutor guide link.

## Pages (9 ≥6)

Home · Jobs · Lifecycle · Scenario · Batch · Audit · Goldens · Honesty · Settings — each has a UI critical-path test.

## Aggregates (≥4)

Organization · Project · RetrievalJob · AuditEntry (+ OrgSettings, Member)

## Run

```bash
cd projects/graph-retrieval-desk
npm install
npm test
npm start
```

Open `http://127.0.0.1:3847/` (or `PORT`). Offline demo: open [`try.html`](./try.html) in a browser (no server fetch).

## Browser playground

https://stackblitz.com/fork/github/serhii-kucherenko/ai-method-lab/tree/main/projects/graph-retrieval-desk?startScript=start

## Tutor guide

[docs/guides/06-graph-retrieval-desk-lessons.md](../../docs/guides/06-graph-retrieval-desk-lessons.md)

## Status

Smoke GREEN · CRUD GREEN · Workflow GREEN · Integrate GREEN · Scale GREEN · **Sustain GREEN**
