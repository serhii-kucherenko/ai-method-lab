# Eval Budget Studio

**Forecast the bill before you burn it.**

Method Lab soft-simulation for AI platform and FinOps teams. Forecast evaluation spend, enforce caps, and compare budget-aware plans against unconstrained always-max runs.

## Run
```bash
cd projects/eval-budget-studio
npm install
npm run dev
```

## Verify
```bash
npm test
npm run build
npm run test:app-up
```

## Dual scorer
- **A — budget-aware:** stay under cap when possible; surface overrun risk
- **B — always-max:** ignore the ceiling; higher spend

## Honesty
Method Lab soft-simulation only. Not live billing write-back. Not a Prompt Cache rebrand.
