# Memory Risk Desk

**State:** building (paper-sourced)  
**Slug:** `memory-risk-desk`  
**Display name:** Memory Risk Desk  
**Paper id:** `2607.11656`  
**Paper:** https://arxiv.org/abs/2607.11656v2  
**Code:** none published with this paper  

## Paper in plain words

Predicting Alzheimer's-related risk across hospitals is hard when patient records have different missing fields. Many models fill gaps with imputation and then overstate certainty. The paper describes an imputation-free transformer approach with calibrated uncertainty across heterogeneous clinical cohorts. No public authors’ code shipped with the paper.

## Unique claim (dual-gate — not isomorphic)

**Imputation-free + calibrated-uncertainty plans** (native missingness handling, calibrated risk bands across cohorts) vs **naive baselines** (mean/mode imputation then flat classifier; uncalibrated high-confidence scores; single-cohort-only models that ignore site shift). Soft desk simulation — not the authors’ model name as a brand. Distinct from Heart Rhythm Desk and Pathology Vision Desk.

## Build claim

Org desk for memory-risk prediction jobs: projects, lifecycle, scenario compare (imputation-free calibrated vs naive imputed/uncalibrated), audit, goldens, honesty, marketing landing — Next.js + shadcn.

## Honesty

Workflow experiment inspired by the paper — not a clinical diagnostic product and not a claim to replace the authors’ transformer. Never brand this desk as a medical device.
