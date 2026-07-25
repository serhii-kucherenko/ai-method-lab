# Blueprint — Crystal Bind Studio

## Pages (NOT desk clone; NOT Optical Stack / Edge Quant copy)

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — sell multimodal crystal retrieve across modalities |
| `/packs` | Crystal pack registry |
| `/structure` | Structure descriptor lane |
| `/diffraction` | Diffraction fingerprint lane |
| `/dos` | Density-of-states lane |
| `/language` | Language / written-spec lane |
| `/bind` | Shared bind-space explorer |
| `/retrieve` | Multimodal vs single-modality retrieve compare |
| `/settings` | Org, members, webhook, exports |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens`

## Dual score

| Impl | Meaning |
|------|---------|
| **A** | Multimodal bind retrieve quality |
| **B** | Single-modality baseline |

## Feature matrix (≥20)

1. Marketing landing  
2. Crystal pack create / list / archive  
3. Pack search + filter by status  
4. Structure lane create / list  
5. Diffraction lane create / list  
6. DOS lane create / list  
7. Language lane create / list  
8. Bind projection create + coherence scoring  
9. Bind-space explorer list + status advance  
10. Dual score panel (A vs B)  
11. Retrieve compare create + winner  
12. Honesty fence page  
13. Org settings edit  
14. Member invite / role  
15. Bearer auth on APIs  
16. Rate-limit feedback  
17. Idempotent webhook  
18. Export packs JSON  
19. Export compares CSV  
20. Features inventory API  
21. Goldens sample API  
22. Audit trail (API + settings surface)  
23. Onboarding checklist on packs empty state  
24. In-app guide link  
25. try.html offline demo  

## Aggregates

CrystalPack, StructureLane, DiffractionLane, DosLane, LanguageLane, BindProjection, RetrieveCompare (+ Org/Members/Audits)

## Test themes

- Dual-impl goldens ≥30  
- Store CRUD + compare + webhook idempotency  
- UI critical path per page  
- Live app-up (build + start GET `/`)  
