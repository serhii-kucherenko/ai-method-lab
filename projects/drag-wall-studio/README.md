# Drag Wall Studio

Soft-sim studio for fluid-control leads who compare **evolution-strategy closed-loop wall controllers** against **open-loop / gradient baselines** before locking a turbulent drag-reduction pack.

Paper: [arXiv 2607.12626](https://arxiv.org/abs/2607.12626v1) · authors’ code: none

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Bearer token for APIs: `dws-dev-token`.

```bash
npm test
npm run build
npm run test:app-up
```

Offline scorer: open `try.html` in a browser.

## Surfaces

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/channels` | Channel pack registry |
| `/actuators` | Wall actuator plans |
| `/sensors` | Sensor layouts |
| `/controllers` | ES closed-loop controller runs |
| `/compare` | Dual A/B score |
| `/scoreboard` | Ranked gaps |
| `/flows` | ≥5 named user journeys |
| `/demo` | Guided steps |
| `/onboarding` | Checklist |
| `/pricing` | Tiers |
| `/settings` | Org, members, webhook, export, audit |
| `/honesty` | Soft-sim fence |

## Honesty

Method-lab soft-sim only. Not live plant control. Not certified CFD. Not the authors’ system.
