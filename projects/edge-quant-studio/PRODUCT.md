# Edge Quant Studio — product brief

**Display:** Edge Quant Studio  
**Slug:** `edge-quant-studio`  
**Claim:** Channel-aware quantization plan quality vs uniform bit-width baseline for edge CPU LLM soft-sim.  
**Paper:** https://arxiv.org/abs/2607.14618v1 (PolyQ pattern input)  
**Honesty:** Soft-sim / method-lab — not PolyQ, not silicon.

## Dual score

| Impl | Role |
|------|------|
| A | Channel-aware plan quality |
| B | Naive uniform bit-width |

## Sustain checklist

- ≥8 pages including marketing `/`
- ≥20 features
- ≥30 dual goldens
- README + try.html + guide 62
- `npm run build` + `test/app-up.test.ts`
