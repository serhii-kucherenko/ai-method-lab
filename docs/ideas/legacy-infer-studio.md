# Legacy Infer Studio

**State:** ready_to_build  
**Slug:** `legacy-infer-studio`  
**Paper:** https://arxiv.org/abs/2607.14568v1  
**Authors’ code:** none  

## Buyer
Edge / ML platform teams who must run modern multimodal assistants on severely constrained legacy GPUs — not hope that offload-to-host plans fit in 6 GB.

## Outcome
A studio to register legacy devices, define stage-validated inference plans, track kernel/memory budgets, run all-GPU validation passes, and compare against naive offload baselines that OOM.

## Why this paper
Clear extreme-optimization software claim (stage-validated all-GPU Fermi inference). Distinct from prior studios. No public authors’ code — Method Lab product inspired by the pattern, not a rebrand of MiniCPM/Fermi work.
