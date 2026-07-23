# Heart Rhythm Desk

Method-lab product for long-tail-aware rhythm scoring experiments.

## Paper

- **Id:** 2607.14613
- **Title:** Adaptive Guided Supervised Contrastive Learning for Long-Tailed Electrocardiogram Arrhythmia Diagnosis
- **URL:** https://arxiv.org/abs/2607.14613v1
- **Code:** https://github.com/Open-EXG/AG-SCL-for-Long-Tailed-ECG

## Display name

**Heart Rhythm Desk** — never brand as AG-SCL.

## Stack

Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui (Radix).  
Design system: [`docs/ideas/heart-rhythm-desk-DESIGN.md`](../../docs/ideas/heart-rhythm-desk-DESIGN.md)

## Honesty

Workflow experiment inspired by the paper. **Not** a clinical ECG reader. **Not** the authors' model.

## Run

```bash
cd projects/heart-rhythm-desk
npm install
npm test
npm run dev          # Next UI
npm run start:api    # JSON API harness used by tests
```

Offline domain demo (no server): open `try.html`.

## Docs

- Product bar: `PRODUCT.md`
- Findings: `FINDINGS.md`
- Tutor guide: `docs/guides/09-heart-rhythm-desk-lessons.md`
