# 133 — Liver Organoid Studio lessons

## What we shipped

A comprehensive soft-sim studio for **multicellular liver organoid (HLO)** vs **single-lineage hepatocyte-like cell (HLC)** baselines aimed at organoid-platform / MASLD screening analytics leads.

## Category practices that landed

| Practice | Where |
|----------|--------|
| Versioned model packs | `/packs` |
| Lineage + assay workspace | `/lineages`, `/assays` |
| MASLD phenotype cases | `/masld` |
| Dual A/B compare + scoreboard | `/compare`, `/scoreboard` |
| Goldens ≥30 (`lo-001`…`lo-030`) | `src/goldens.ts` + fixtures |
| Org / members / audit / export / webhook | `/settings` + APIs |
| Commercial surfaces | `/pricing`, `/demo`, `/onboarding`, `/flows` |
| Honesty fence | `/honesty` + landing |

## What not to claim

- Wet-lab validated organoid GMP manufacture
- Live patient transplant
- Clinical MASLD diagnosis
- Authors’ organoid system branding

## Anti-clone note

Domain nouns are packs, models, lineages, assays, MASLD cases — not jobs / lifecycle / scenario shells.

## Paper

https://www.biorxiv.org/content/10.64898/2026.06.02.729501v3
