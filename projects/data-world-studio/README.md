# Data World Studio

Forecast operation outcomes **before** autonomous data science agents spend the run.

Inspired by [arXiv:2607.15901](https://arxiv.org/abs/2607.15901v1). Method-lab soft simulation — **not** branded as DSWorld, not a production LLM simulator SaaS.

## Buyer outcome

Teams building DS agents register workspaces, catalog costly ops, forecast with a world-model plan (structured state, cost-aware decisions, lightweight sim), configure agents, review rollouts, and compare against trial-and-error baselines.

## Run

```bash
cd projects/data-world-studio
npm install
npm run dev
```

Open http://localhost:3000 — landing CTA goes to `/workspaces`.

Bearer token for API routes: `dws-dev-token`.

## Tests

```bash
npm test
npm run test:app-up
```

## Pages

`/` · `/workspaces` · `/operations` · `/forecasts` · `/agents` · `/rollouts` · `/compare` · `/settings` · `/honesty`

Offline demo: `try.html`

## Honesty

Dual score **A** = world-model plan quality; **B** = trial-and-error. See `/honesty` for Sources.
