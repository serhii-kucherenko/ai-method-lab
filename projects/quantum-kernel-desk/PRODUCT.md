# Quantum Kernel Desk

Org desk for **quantum multiple-kernel SAR plans**: projects, lifecycle, scenario compare (classical linear / RBF-only / feature-blind vs quantum multi-kernel), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.11701.

**Display name:** Quantum Kernel Desk

**Paper URL:** https://arxiv.org/abs/2607.11701v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/quantum-kernel-desk-DESIGN.md`

## Unique claim

Quantum multiple-kernel SAR plans: multi-kernel quantum-style feature maps for activity scoring — versus classical single linear kernel, single RBF-only, or feature-blind flat scores. Soft simulation — not dual-approver / pocket-molecule / drug-discovery / joint-care / wild-locomotion / evidence-synthesis rebrand. Never brand Q²SAR as the product name.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' Q²SAR pipeline or commercial QSAR and quantum chemistry tools. Soft simulation only. Never brand this desk as Q²SAR.

## Forbidden claims

- Shipping or replacing the authors' Q²SAR systems
- Claiming real quantum hardware runs or wet-lab assays from this soft simulation
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using Q²SAR as the product brand
- Rebranding pocket-molecule, drug-discovery, joint-care, wild-locomotion, or evidence-synthesis desks as this domain

## Live features (20)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / assay / series profile catalog  
4. Kernel job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (linear / RBF / feature-blind vs quantum multi-kernel)  
10. Kernel-feature cell strip (acquired vs missing cells)  
11. Scenario JSON export  
12. Audit log  
13. CSV audit export  
14. Goldens browser (≥25 dual-impl fixtures)  
15. Honesty / disclaimer page  
16. Webhook inbound + HMAC + idempotency  
17. Org webhook settings (admin rotate)  
18. Pagination + search  
19. Rate-limit feedback (429 + Retry-After)  
20. Offline try page (`try.html`) + in-app guide link  

## Pages (9)

1. Marketing landing (`/` Next + harness `index.html`)  
2. Kernel jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · KernelJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥20 features live  
- [x] ≥8 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Quantum Kernel Desk**  
- [x] Never claim authors' Q²SAR replacement / product brand  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
- [x] Live app: `npm run build` + `test/app-up.test.ts` (production server serves `/`)  
