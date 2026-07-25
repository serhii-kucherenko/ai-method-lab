# Blueprint — Attest Proof Studio

## Pages (≥11; NOT desk clone; NOT Reason Frame / Agent Safety)

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing — sell tool-attested empirical answers with checkable proof chains |
| `/pricing` | Hypothetical tiers: Evaluator seats · Platform seats+usage · Site license |
| `/demo` | Step-by-step guided in-app happy path (claim → attest → kernel → compare) |
| `/onboarding` | First-run checklist with visible progress |
| `/claims` | Claim registry |
| `/attestations` | Tool attestation ledger |
| `/proofs` | Soft-sim proof chain list + seal |
| `/kernel` | Kernel step walker |
| `/ledger` | Evidence grounding ledger |
| `/compare` | Attested vs fluent-only compare |
| `/settings` | Org, members, webhook, exports |
| `/honesty` | Soft-sim fence + Sources |

Forbidden primary IA: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens` · no `/rules` `/debates` · no fleet-monitor desk

## Dual score

| Impl | Meaning |
|------|---------|
| **A** | Tool-attested proof quality |
| **B** | Fluent-only baseline |

## Feature matrix (≥20)

1. Marketing landing  
2. Pricing page with tiers  
3. Guided step-by-step demo  
4. Onboarding checklist with progress  
5. Claim create / list / archive  
6. Claim search + filter by status/domain  
7. Tool attestation create / list  
8. Link attestation to claim + tool kind  
9. Proof chain create + status advance  
10. Soft-sim kernel step walker  
11. Evidence ledger create / list  
12. Dual score panel (A vs B)  
13. Attested vs fluent compare + winner  
14. Honesty fence page  
15. Org settings edit  
16. Member invite / role  
17. Bearer auth on APIs  
18. Rate-limit feedback  
19. Idempotent webhook  
20. Export claims JSON  
21. Export compares CSV  
22. Features inventory API  
23. Goldens sample API  
24. Audit trail  
25. In-app guide link  
26. try.html offline demo  

## Aggregates

Claim, ToolAttestation, ProofChain, KernelStep, EvidenceEntry, AttestCompare (+ Org/Members/Audits)

## Test themes

- Dual-impl goldens ≥30  
- Store CRUD + compare + webhook idempotency  
- UI critical path per page including `/pricing` `/demo` `/onboarding`  
- Live app-up (build + start GET `/`)  
