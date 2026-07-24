# Data World Studio — lessons

## What worked
- Distinct DS-agent IA (`workspaces` / `operations` / `forecasts` / `agents` / `rollouts`) avoided desk and Ladder Bomb noun-swaps.
- Dual score (world-model vs trial-and-error) made the efficiency claim testable without shipping a production LLM simulator.
- Cost signals on operations plus planned-vs-executed rollouts matched the buyer story better than a generic compare page alone.

## What to watch
- Soft sims must keep honesty fences loud — buyers will assume “world model” means a live training oracle.
- Exploration noise and retry budget should clearly hurt the trial-and-error path so A beats B on waste avoided.
- Never brand as DSWorld; keep Sources pointing at the paper only.

## Sources
- Paper: https://arxiv.org/abs/2607.15901v1
- Product: `projects/data-world-studio/`
- Guide index: this file under `docs/guides/`
