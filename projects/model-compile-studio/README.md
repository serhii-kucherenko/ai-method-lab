# Model Compile Studio

See every pass to the target.

ML systems studio for registering LLM projects, configuring accelerator targets, running multi-pass MLIR-style compile plans, inspecting IR/binary artifacts, and comparing against naive single-pass / target-blind baselines.

**Not** TPU-MLIR / Sophgo as a brand. Soft simulation only — no fake chip timing claims. **Not** an isomorphic lab desk shell.

## Paper
- https://arxiv.org/abs/2607.15865v1
- Authors' code: https://github.com/sophgo/tpu-mlir

## Run

```bash
cd projects/model-compile-studio
npm install
npm run dev
```

Open http://localhost:3000

## Test

```bash
npm test
npm run test:app-up   # live next build + start smoke
```

## Pages
`/` `/models` `/compile` `/targets` `/artifacts` `/compare` `/runs` `/settings` `/honesty`

## Dual score
- **A:** multi-pass MLIR-style compile plan quality
- **B:** naive single-pass / target-blind
