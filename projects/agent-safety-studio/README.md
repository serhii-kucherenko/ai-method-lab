# Agent Safety Studio

Structural agent deployment safety studio — manage fleets, configure graph-delta monitors, review regression alerts, and compare against unchecked / threshold-only baselines.

**Not** IFG as a brand. **Not** an isomorphic lab desk shell (`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens`).

## Paper
- https://arxiv.org/abs/2607.14570v1
- Authors’ code: none published with this paper

## Buyer
Platform teams deploying AI agents who need structural monitoring for security regressions — not hope-and-check after incidents.

## Run

```bash
cd projects/agent-safety-studio
npm install
npm run dev
```

Open http://localhost:3000 — landing CTA → `/fleets`.

## Pages
| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/fleets` | Agent deployment fleets |
| `/monitors` | Structural monitor config |
| `/alerts` | Regression alert console |
| `/compare` | Structural vs unchecked / threshold-only |
| `/runs` | Audit + export |
| `/settings` | Org, members, webhook |
| `/honesty` | Fence + Sources |

## Tests

```bash
npm test
npm run test:app-up
```

Bearer token (dev): `ass-dev-token`

## Honesty
Soft simulation for method-lab evaluation. Not a live agent control plane. Inspired by structural monitoring research — never branded as IFG.
