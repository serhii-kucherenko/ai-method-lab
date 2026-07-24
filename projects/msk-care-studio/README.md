# MSK Care Studio

Evidence-grounded MSK care decisions across admission → rehab — hospital state streams + external medical knowledge, compared against an ungrounded LLM baseline.

**Not** clinical certification. **Not** a live EHR. **Not** OrthoPilot. Method-lab experiment inspired by [arXiv:2607.12527](https://arxiv.org/abs/2607.12527v1).

## Run

```bash
cd projects/msk-care-studio
npm install
npm run dev
```

Open http://localhost:3000 — CTA goes to `/episodes`.

## Tests

```bash
npm test
npm run test:app-up
```

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/episodes` | Care episode registry |
| `/streams` | Hospital state streams |
| `/knowledge` | External medical knowledge |
| `/decisions` | Evidence-grounded decision ledger |
| `/pathways` | Admission → rehab pathways |
| `/compare` | Grounded vs ungrounded LLM |
| `/settings` | Org, members, webhook |
| `/honesty` | Fence + Sources |

## Dual score

- **A** — evidence-grounded plan quality (streams + knowledge → decisions)
- **B** — ungrounded LLM baseline (skips stream/knowledge grounding)

## Offline demo

Open `try.html` for a single-file approximate compare. Full fidelity needs the Next app.

## Sources

- Paper: https://arxiv.org/abs/2607.12527v1
- Authors’ code: none
- Guide: `docs/guides/52-msk-care-studio-lessons.md`
