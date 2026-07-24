# Neuro Guard Studio

Simulate the fix before you push it.

Industrial IoT security teams register sites and sensors, draft LLM defense plans, run Counterfactual Physics Injection before acting, track interventions, and compare neuro-agentic plans against reactive threshold baselines.

## Run

```bash
cd projects/neuro-guard-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing. Desk entry: **/sites**.

Bearer token for API calls: `ngs-dev-token`.

## Tests

```bash
npm test
npm run test:app-up
```

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/sites` | IIoT site registry |
| `/sensors` | Sensor / time-series context |
| `/plans` | Defense plan drafts |
| `/counterfactuals` | CPI simulations |
| `/interventions` | Proposed / applied interventions |
| `/compare` | Neuro-agentic vs reactive |
| `/settings` | Org, members, webhook, exports |
| `/honesty` | Fence + Sources |

## Honesty

Soft method-lab simulation only. Dual score: **A** neuro-agentic (CPI before act) · **B** reactive (act without counterfactual). Not live ICS control. Paper: https://arxiv.org/abs/2607.09076v1
