# Enterprise Agent Studio

Roles that plan together.

Multi-agent role-orchestrated resource planning studio inspired by Agentic ERP research. **Not** branded as Agentic ERP. **Not** an isomorphic lab desk shell.

## Paper
- https://arxiv.org/abs/2607.17331v1
- Authors’ code: none

## Run

```bash
cd projects/enterprise-agent-studio
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
| `/domains` | ERP domain workspaces |
| `/agents` | Role agent roster / orchestration |
| `/plans` | Resource plan console |
| `/compare` | Multi-agent vs single-agent |
| `/runs` | Audit + export |
| `/settings` | Org, members, webhook |
| `/honesty` | Fence + Sources |

## Dual score
- **A (multi):** role-orchestrated plan quality
- **B (single):** unchecked single-agent baseline

## Auth
Dev bearer token: `eas-dev-token`
