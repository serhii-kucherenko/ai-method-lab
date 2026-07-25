# PRD — Crystal Bind Studio

## Problem

Materials teams search crystals with one modality at a time. Structure neighbors ≠ diffraction neighbors ≠ DOS neighbors ≠ language-spec neighbors. Disagreement is expensive and hard to audit.

## Solution

Crystal Bind Studio lets a team:

1. Register a **crystal pack** (formula, space group hint, notes)  
2. Attach **descriptor lanes** for structure, diffraction, DOS, and language  
3. Explore a soft-sim **bind space** projection  
4. Run **retrieve / compare**: multimodal bind quality (A) vs single-modality baseline (B)  
5. Keep settings, members, webhook, exports, and an honesty fence  

## Dual score

| Impl | Meaning |
|------|---------|
| **A** | Multimodal bind retrieve quality — structure + diffraction + DOS + language + bind coherence + cross-modal agreement |
| **B** | Single-modality baseline — strongest biased lane only; ignores cross-modal agreement |

## Success metrics (method lab)

- ≥20 user-visible features, ≥8 pages, ≥4 aggregates  
- ≥30 dual goldens locked  
- Marketing landing sells materials multimodal retrieve outcome  
- Honesty visible: soft-sim / not MatBind / not wet-lab  

## Out of scope

Live XRD instruments, DFT solvers, MatBind weights, clinical products.  
