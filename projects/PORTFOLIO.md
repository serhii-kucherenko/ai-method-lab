# Product portfolio

Registry of product experiments. Controllers pick the next **queued** product phase from here + `docs/BACKLOG.md`.

| ID | Status | Workflow | Current phase | Hypothesis (short) |
|----|--------|----------|---------------|--------------------|
| clearpath | **sustained** | A03 + A10 | sustain complete | Test-first + enterprise gates can grow an approvals product from zero to sustainable MVP |
| ledgerlite | **sustained** | A03 + A10 | sustain complete | Same workflow on a personal finance ledger (schema-heavy) |
| signalboard | **phase-complete (crud)** | A03 + A05 | **next: workflow** | Adversarial review overlay improves security outcomes on a public status board |

## Status meanings

| Status | Meaning |
|--------|---------|
| queued | Not started |
| in progress | Building current phase |
| phase-complete | Last phase scored; next phase queued |
| sustained | Met PRODUCT.md sustain criteria; findings published |
| abandoned | Stopped; reason in product FINDINGS |

## Next autonomous actions

1. Complete **signalboard** through sustain under A03+A05
2. Email product findings digests at each phase and at sustain
3. Queue next portfolio product after signalboard sustained
