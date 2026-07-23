# Pocket Molecule Desk

**State:** building (paper-sourced)  
**Slug:** `pocket-molecule-desk`  
**Display name:** Pocket Molecule Desk  
**Paper id:** `2607.12349`  
**Paper:** https://arxiv.org/abs/2607.12349v1  
**Code:** none published with this paper  

## Paper in plain words

Designing new drug-like molecules for a protein binding pocket is hard. Many generators chase binding strength alone and leave developability (absorption, toxicity, and related properties) for later. The paper describes pocket-conditioned diffusion plus property-aware optimization so candidates fit the pocket and look more developable. No public authors’ code shipped with the paper.

## Unique claim (dual-gate — not isomorphic)

**Pocket-conditioned + property-aware plans** (pocket multi-scale conditioning, binding + ADMET/developability steering) vs **naive baselines** (unconditioned / ligand-only resemblance, affinity-only with no developability, property-blind pocket fill). Soft desk simulation — not ConDitar / msPRL / paOPT as a brand. Distinct from Drug Discovery Desk (disease-aware language model).

## Build claim

Org desk for pocket molecule design jobs: projects, lifecycle, scenario compare (pocket+property-aware vs naive), audit, goldens, honesty, marketing landing — Next.js + shadcn.

## Honesty

Workflow experiment inspired by the paper — not a claim to replace ConDitar-dev or commercial SBDD tools. Never brand this desk as ConDitar / msPRL / paOPT / CDH.
