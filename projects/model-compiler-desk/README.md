# Model Compiler Desk

Method-lab product sourced from a simple-papers digest. Display name stays **Model Compiler Desk**.

## Paper

- **Id:** 2607.15865
- **Title:** An MLIR-Based Compilation Method for Large Language Models
- **URL:** https://arxiv.org/abs/2607.15865v1
- **Code:** https://github.com/sophgo/tpu-mlir

## Honesty

This desk is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' MLIR compiler at the paper's code URL.

## What we built

### CRUD

- Bearer-token auth stub (`POST /auth/register`)
- Orgs with roles: admin / operator / viewer
- Projects under an org (model name + target backend)
- Compile jobs: create, list, patch, delete

### Workflow

- Compile-job lifecycle: **draft → queued → running → succeeded / failed** (cancel from draft/queued/running)
- Illegal transitions rejected (`illegal_transition`)
- Audit log (actor, from, to, time) + CSV export
- Optimistic `expected_version` → `version_conflict` on stale writes
- Batch transitions: each job succeeds or rejects independently
- Scenario compare: naive opaque monolith vs paper-inspired MLIR layered passes
- HTML: home, jobs, lifecycle, scenario, audit, honesty

## Run

```bash
cd projects/model-compiler-desk
npm install
npm test
npm start
```

Open `http://127.0.0.1:3847/` (or `PORT`).

## Status

Smoke GREEN · CRUD GREEN · Workflow GREEN · next: integrate
