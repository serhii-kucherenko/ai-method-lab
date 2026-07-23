# Chest Xray Desk — findings

## What worked

- Cloning a mature Next desk and rebranding domain axes (label + region · clinical gate · clinical validation) kept the sustain ladder intact while staying non-isomorphic to heart-scan / heart-rhythm / pathology-vision / memory-risk desks.
- Dual-impl scorers + regenerated goldens caught silent label drift after rename.
- Live `app-up` (build + `next start` GET `/`) blocked finish until the marketing landing actually served.
- Escaped paper-id regexes in tests (`2607\.11287`) do not match plain `2607.11287` replace pairs — patch both forms after a clone.

## What to watch

- Mechanical string rebrand can leave cardiac CT / phenotype / Alzheimer leftovers; scrub user-facing copy and honesty links after rename.
- Guide number must be the next free slot (`31-…`) when `30-…` is already taken.
- Never claim medical device / radiology product or authors' Thailand deep learning system as product brand.

## Dual-gate

Good path: classify → localize → clinically validate plans (label + region + validation gate).  
Naive baselines: classification-only without regions; localization without clinical gate; unverified single-threshold alerts.
