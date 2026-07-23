# Chest Xray Desk

**State:** sustain (paper-sourced)  
**Slug:** `chest-xray-desk`  
**Display name:** Chest Xray Desk  
**Paper id:** `2607.09305`  
**Paper:** https://arxiv.org/abs/2607.09305v1  
**Code:** none published with this paper  

## Paper in plain words

Finding thoracic disease on chest X-rays is more useful when a system both classifies disease and shows where on the image the finding sits, then checks that pathway in clinical settings. Classification-only tools often fail when clinicians need localization and real-world validation. The paper describes large-scale development of a deep learning system moving from classification to localization and clinical validation in Thailand. No public authors’ code shipped with the paper.

## Unique claim (dual-gate — not isomorphic)

**Classify → localize → clinically validate plans** (label + region + validation gate) vs **naive baselines** (classification-only without regions; localization without clinical gate; unverified single-threshold alerts). Soft desk simulation — not the authors’ Thailand system as a brand. Distinct from Heart Scan Desk (cardiac CT) and Pathology Vision Desk (pathology foundation model).

## Build claim

Org desk for chest X-ray detection jobs: projects, lifecycle, scenario compare (classify+localize+validate vs naive), audit, goldens, honesty, marketing landing — Next.js + shadcn.

## Honesty

Workflow experiment inspired by the paper — not a radiology product for diagnosis and not a claim to replace the authors’ deep learning system. Never brand this desk as a medical device.
