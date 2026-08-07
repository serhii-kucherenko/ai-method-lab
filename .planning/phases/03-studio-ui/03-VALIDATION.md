# Phase 3 Validation: Studio UI

**Nyquist:** enabled via workflow.nyquist_validation

## Sampling plan

| After plan | Automated gate |
|------------|----------------|
| 03-01 | `npx tsx --test test/smoke-ui.test.ts` + `npm run build` |
| 03-02 | `npx tsx --test test/smoke-ui.test.ts` + `npm run build` |
| 03-03 | `npm test` + `npm run build` |

## Must hold

- Seven domain pages exist and import StudioShell
- StudioShell primary nav = commit-native IA only (UI-03)
- Scoreboard API + page present (UI-02)
- Loading/empty/error paths present via studio-states usage
