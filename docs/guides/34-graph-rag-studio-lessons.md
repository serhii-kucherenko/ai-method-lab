# Graph RAG Studio — what we learned

## Product

**Graph RAG Studio** — a Next.js + Tailwind + shadcn workspace for multi-step GraphRAG: corpora, extract→consolidate pipelines, graph hop highlight, ask trails, and multi-step vs single-shot scenarios. Inspired by RAGU (arXiv 2607.11683); not a desk noun-swap and not a RAGU rebrand.

## Lessons

1. **IA is the product identity.** `/corpora` `/pipelines` `/graph` `/ask` is what makes this a studio; copying `/jobs` `/lifecycle` `/batch` fails the comprehensive bar even with green tests.
2. **Dual-impl needs identical clamp order.** Profile boosts applied outside vs inside `clamp` silently diverge on edge fixtures.
3. **Landing must sell the hop-trail outcome** — brand-first Fraunces + teal/slate, not a generic lab chrome.
4. **Live app-up is non-negotiable.** Unit goldens alone do not prove `next start` serves the marketing page.

## Checklist for the next GraphRAG-shaped product

- [ ] Buyer story + DESIGN before code
- [ ] GraphRAG-native routes (not desk shells)
- [ ] ≥20 features, ≥8 pages, ≥30 agreeing goldens
- [ ] `test/app-up.test.ts` green before finish email
