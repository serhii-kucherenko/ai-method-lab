# Papers intake — pick then build

Fully autonomous. No human confirmation between pick and product finish.

## Rule

When digests are available and the lab is idle (no `current_product`):

1. Run `node scripts/pick-paper-idea.mjs --days 14 --write-shortlist --choose 1`
2. Email **validated idea** — full plain narrative; assume the reader knows **no** acronyms (`protocols/NOTIFY.md`)
3. Climb the product ladder on `projects/<slug>/` until sustain
4. Ship README + tutor guide + try.html
5. Email **product finished** — detailed simple story a stranger can follow; try page + browser playground; no jargon dump
6. Clear product slot → pick again

Never invent freehand statute-code seeds while simple-papers digests exist.

## Eligibility

Same contract as simple-papers [`docs/METHOD_LAB_INTAKE.md`](https://github.com/serhii-kucherenko/simple-papers/blob/main/docs/METHOD_LAB_INTAKE.md):

- `code.url`, **or**
- `cs.*` + software tags + non-empty `impact.forTech`

Refuse wet-lab-only without code. Refuse clones of Filing Penalty Desk (late tax additions).

## Naming

Mature display name (2–4 English words). Slug = hyphenated lowercase. Never brand with arXiv ids or statute codes.

## Artifacts every product must ship

| Artifact | Path |
|----------|------|
| README | `projects/<slug>/README.md` |
| Design note | `docs/ideas/<slug>-DESIGN.md` |
| App stack | Next.js + Tailwind + shadcn; Python sidecar when needed (`docs/PRODUCT_STACK.md`) |
| Tutor guide | `docs/guides/NN-<slug>-lessons.md` |
| Offline try | `projects/<slug>/try.html` |
| StackBlitz | `https://stackblitz.com/fork/github/serhii-kucherenko/ai-method-lab/tree/main/projects/<slug>?startScript=start` |

## Human email only

| Event | When |
|-------|------|
| `idea_validated` | Paper chosen + folder opened |
| `product_complete` | Sustain + README + guide + try |
| `hard_stop` | Credential/tool failure only |

See `protocols/NOTIFY.md`.
