# Contract Rate Variance Studio — ARS brief

Literal-dollar FinOps / AP wedge (BACKLOG prefer pattern).  
Related: `docs/ideas/contract-rate-variance-studio-RELATED-WORKS.json` (procure-to-pay / contracting neighbors; idea-first, lit is noisy).

## Job to be done

AP and FinOps leads need **line-item rate mismatches between the signed contract catalog and the invoice**, expressed in dollars, before the payment batch posts - not another OCR inbox and not cloud commitment coverage.

## Unique claim vs prior lab products

| Prior | Difference |
|-------|------------|
| True Up Studio | Seat / entitlement true-up - not invoice unit-rate vs contract |
| Service Credit Studio | SLA credit forecast - not AP rate variance |
| Commitment Coverage Studio | Cloud SP/RI/CUD coverage - not vendor SKU rate on invoices |
| Idle Seat Studio | Unused seats - not payables rate drift |

**Claim:** If we remove **contracted unit rate ↔ invoice line match → $ variance queue**, the remainder is invoice OCR or generic AP workflow.

## Buyer / money
- Buyer: AP ops + FinOps / procurement systems leads at mid-market+ SaaS/cloud vendors shops  
- Money: AP seats + variance-run usage + private contract catalogs  
- Software-solvable: yes (CSV/PDF soft-sim catalogs; refuse live bank ACH claims)

## Falsifiers
1. Teams only dispute totals, never unit rates → weak wedge  
2. Contract catalogs too messy to normalize → product stuck in data entry  
3. ERP already blocks rate variance with enforced PO match → commodity

## Recommendation
Score under biz-rubric-v2. Queue after Commitment Coverage / Online Diff / Delegation Expiry packs unless score clears A and a human arms it earlier.
