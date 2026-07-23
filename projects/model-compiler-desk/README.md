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

### Integrate

- Inbound webhook `POST /webhooks/jobs` with HMAC (`x-mcd-signature`) + idempotency key (no double-create)
- Org settings: admin sees webhook secret; operator/viewer get redacted; only admin rotates
- Project and job lists: `limit` / `offset` pagination and `q` search
- Over-limit requests return **429** with `Retry-After: 1`
- Settings page live

### Scale

- Seed and page-walk **250** compile jobs (default page 20, hard cap 100)
- Concurrent batch transitions on disjoint jobs all succeed
- Overlapping optimistic batches: one ok, one reject (`version_conflict` / illegal)
- Duplicate job in one batch → `duplicate_in_batch`
- Rate limit still returns **429** + `Retry-After: 1` under load

## Run

```bash
cd projects/model-compiler-desk
npm install
npm test
npm start
```

Open `http://127.0.0.1:3847/` (or `PORT`).

## Status

Smoke GREEN · CRUD GREEN · Workflow GREEN · Integrate GREEN · Scale GREEN · next: sustain
