# Realtime Deploy Studio

Ship multimodal live — with a harness.

Agent-harnessed realtime multimodal deployment workspace inspired by FlashRT research. **Not** branded as FlashRT. **Not** an isomorphic lab desk shell.

## Paper
- https://arxiv.org/abs/2607.18171v1
- Authors’ code: https://github.com/Infini-AI-Lab/FlashRT

## Run

```bash
cd projects/realtime-deploy-studio
npm install
npm run dev
```

Open http://localhost:3000

## Test

```bash
npm test
npm run test:app-up
```

## Pages
| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/apps` | Deploy apps / environments |
| `/deploy` | Harnessed deploy console |
| `/readiness` | Latency / multimodal readiness |
| `/compare` | Harnessed vs naive single-shot |
| `/runs` | Audit + export |
| `/settings` | Org, members, webhook |
| `/honesty` | Fence + Sources |

## Dual score
- **A** — agent-harnessed multi-check deploy plan (IR → validate → transform → measure)
- **B** — naive single-shot deploy

## Auth
Default bearer token: `rds-dev-token` (change in Settings).
