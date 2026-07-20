# Product portfolio

Registry of product experiments. Controllers pick the next **queued** product phase from here + `docs/BACKLOG.md`.

| ID | Status | Workflow | Current phase | Hypothesis (short) |
|----|--------|----------|---------------|--------------------|
| clearpath | **sustained** | A03 + A10 | sustain complete | Test-first + enterprise gates can grow an approvals product from zero to sustainable MVP |
| ledgerlite | **sustained** | A03 + A10 | sustain complete | Same workflow on a personal finance ledger (schema-heavy) |
| signalboard | **sustained** | A03 + A05 | sustain complete | Adversarial review overlay improves security outcomes on a public status board |
| kitcheck | **sustained** | A03 + A10 | sustain complete | Same workflow on equipment checkout / inventory loans (availability + return cycle) |
| meetslot | **sustained** | A03 + A10 | sustain complete | Same workflow on meeting-room booking (hold → confirm → complete) |
| briefpad | **queued** | A03 + A10 | smoke | Same workflow on shared notes with revision loops |
| orbitfolio | **phase-complete** | A03 + A08 | design-lab 50 variants scored | External `orbitfolio` repo — champion hybrid promoted; see github.com/serhii-kucherenko/orbitfolio |

## Status meanings

| Status | Meaning |
|--------|---------|
| queued | Not started |
| in progress | Building current phase |
| phase-complete | Last phase scored; next phase queued |
| sustained | Met PRODUCT.md sustain criteria; findings published |
| abandoned | Stopped; reason in product FINDINGS |

## Next autonomous actions

1. Start briefpad smoke → sustain
2. Parallel: orbitfolio design lab as tracked
3. Keep email digests on phase/product/wave complete
