# Legacy Infer Studio

Fit the model on the GPU you actually have.

Stage-validated all-GPU inference plans for edge / ML teams on tight legacy VRAM — compared against naive host-offload baselines that spill or OOM.

## Claim

Edge and ML platform teams run modern multimodal assistants on tight legacy GPU VRAM with stage-validated all-GPU plans — not naive host-offload plans that spill or OOM.

Inspired by [arXiv:2607.14568](https://arxiv.org/abs/2607.14568v1). Not a live CUDA driver. Not MiniCPM branding. Authors’ public code: none.

## Run locally

```bash
cd projects/legacy-infer-studio
npm install
npm run dev
```

Open http://localhost:3000 — landing CTA goes to `/devices`.

Dev API bearer token: `lis-dev-token`.

## Tests

```bash
npm test
npm run test:app-up
```

## Pages

`/` · `/devices` · `/stages` · `/budgets` · `/kernels` · `/runs` · `/compare` · `/settings` · `/honesty`

## Offline demo

Open `try.html` in a browser for an approximate dual-score demo.

## Guide

`docs/guides/53-legacy-infer-studio-lessons.md`
