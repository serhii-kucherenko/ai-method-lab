# Product portfolio

Registry of product experiments. Controllers pick the next **queued** product phase from here + `docs/BACKLOG.md`.

| ID | Status | Workflow | Current phase | Hypothesis (short) |
|----|--------|----------|---------------|--------------------|
| clearpath | **sustained** | A03 + A10 | sustain complete | Test-first + enterprise gates can grow an approvals product from zero to sustainable MVP |
| ledgerlite | **queued (next)** | A03 + A10 | smoke | Same workflow on a personal finance ledger (schema-heavy) |
| signalboard | queued | A03 + A05 | — | Adversarial review overlay improves security outcomes on a public status board |

## Status meanings

| Status | Meaning |
|--------|---------|
| queued | Not started |
| in progress | Building current phase |
| phase-complete | Last phase scored; next phase queued |
| sustained | Met PRODUCT.md sustain criteria; findings published |
| abandoned | Stopped; reason in product FINDINGS |

## Next autonomous actions

1. Start **ledgerlite** smoke under A03+A10 (clearpath sustained)
2. Email product findings digest at each phase and at sustain
3. Start **signalboard** after ledgerlite sustained (or if abandoned)
