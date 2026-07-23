# Model Compiler Desk

Method-lab product sourced from a simple-papers digest. Display name stays **Model Compiler Desk**.

## Paper

- **Id:** 2607.15865
- **Title:** An MLIR-Based Compilation Method for Large Language Models
- **URL:** https://arxiv.org/abs/2607.15865v1
- **Code:** https://github.com/sophgo/tpu-mlir

## Honesty

This desk is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' MLIR compiler at the paper's code URL.

## Feature matrix (18 ≥15)

See [PRODUCT.md](./PRODUCT.md) for the full list. Highlights: org tenancy, roles, projects, compile jobs, lifecycle + illegal rejects, optimistic versions, batch transitions, scenario compare, audit CSV, goldens (≥25), webhooks HMAC/idempotency, settings RBAC, pagination/search, rate-limit feedback, offline try, tutor guide link.

## Pages (9 ≥6)

Home · Jobs · Lifecycle · Scenario · Batch · Audit · Goldens · Honesty · Settings — each has a UI critical-path test.

## Aggregates (≥4)

Organization · Project · CompileJob · AuditEntry (+ OrgSettings, Member)

## Run

```bash
cd projects/model-compiler-desk
npm install
npm test
npm start
```

Open `http://127.0.0.1:3847/` (or `PORT`). Offline demo: open [`try.html`](./try.html) in a browser (no server fetch).

## StackBlitz

https://stackblitz.com/fork/github/serhii-kucherenko/ai-method-lab/tree/main/projects/model-compiler-desk?startScript=start

## Tutor guide

[docs/guides/05-model-compiler-desk-lessons.md](../../docs/guides/05-model-compiler-desk-lessons.md)

## Status

Smoke GREEN · CRUD GREEN · Workflow GREEN · Integrate GREEN · Scale GREEN · **Sustain GREEN**
