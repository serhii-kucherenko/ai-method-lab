# Model Compiler Desk

Method-lab product sourced from a simple-papers digest. Display name stays **Model Compiler Desk**.

## Paper

- **Id:** 2607.15865
- **Title:** An MLIR-Based Compilation Method for Large Language Models
- **URL:** https://arxiv.org/abs/2607.15865v1
- **Code:** https://github.com/sophgo/tpu-mlir

## Honesty

This desk is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' MLIR compiler at the paper's code URL.

## What we built (CRUD)

- Bearer-token auth stub (`POST /auth/register`)
- Orgs with roles: admin / operator / viewer
- Projects under an org (model name + target backend)
- **Compile jobs** aggregate: create, list, patch status, delete
- Minimal HTML: home, compile jobs form, honesty page

## Run

```bash
cd projects/model-compiler-desk
npm install
npm test
npm start
```

Open `http://127.0.0.1:3847/` (or `PORT`).

## Status

Smoke GREEN · CRUD GREEN · next: workflow
