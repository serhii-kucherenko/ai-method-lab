# htsroute try (research demo)

Standalone form-gate playground for the customs chapter-routing idea. **Not a product** — do not create `projects/htsroute/` from this folder alone.

## Open offline

Open `try.html` in a browser (single file, no build). Or run `npm start` and visit the local page (`index.html` mirrors `try.html`).

## What the examples teach

| Example | Point |
|---------|--------|
| **Pantoprazole Free/Free honesty** | Finished tablets → heading 3004 Free; matching bulk → Chapter 29 also Free. Route matters; duty-savings pitch for this PPI pair is false. |
| **Acetaminophen 6.5% vs Free** | Honest dollar contrast: bulk Chapter 29 base MFN 6.5% (NY R04092) vs finished 3004 Free — with preference/GSP caveats. |
| **Eluxadoline bulk 6% / Viberzi tablets Free** | Same CROSS letter NY N302614 — bulk 6% ↔ tablets Free. Click both presets; cite base MFN, not guaranteed savings. |
| **Vericiguat bulk 6.5% / Verquvo tablets Free** | Same CROSS letter NY N318947 — bulk 6.5% ↔ tablets Free. Second same-letter dollar pair; preference caveats still apply. |
| **Omeprazole pellets → 3003** | Binary 29-vs-3004 fails; mixed enteric pellets (not measured dose) → heading 3003. |
| **Mixture powder → 3003** | 3003 is not pellet-only; therapeutic mixture powder (no dose/retail) → heading 3003. |
| **Tablet enum cheat → reject** | `tablet` without measured dose or retail packing must reject — keyword theater is not classification. |

## Hard disclaimer (also on the page)

- Brokers and existing HS tools already win commercially.
- This is a **workflow experiment**, not a market proof.
- Pantoprazole showcase pairs are often **Free / Free** under ordinary MFN.
- Fixture pass counts are **not** product-market evidence.

See `docs/ideas/htsroute-VALUE-STAKES.md`, `docs/ideas/htsroute-PRODUCT-FRAMING.md`, and `docs/ideas/htsroute-algorithm.md`.
