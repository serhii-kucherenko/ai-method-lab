# Pocket Molecule Desk

Org desk for **pocket-conditioned + property-aware molecule plans**: projects, lifecycle, scenario compare (unconditioned / ligand-only / affinity-only / property-blind vs pocket-property), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.12349.

**Display name:** Pocket Molecule Desk

**Paper URL:** https://arxiv.org/abs/2607.12349v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/pocket-molecule-desk-DESIGN.md`

## Unique claim

Pocket-conditioned + property-aware plans: multi-scale pocket conditioning, binding affinity **and** ADMET/developability steering — versus naive unconditioned / ligand-only resemblance, affinity-only with no developability, or property-blind pocket fill. Soft simulation — not dual-approver / drug-discovery-desk / joint-care / wild-locomotion / evidence-synthesis / stage-validate rebrand. Never brand ConDitar / msPRL / paOPT / CDH as the product name.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' ConDitar pipeline or commercial structure-based drug design tools. Soft simulation only. Never brand this desk as ConDitar / msPRL / paOPT / CDH.

## Forbidden claims

- Shipping or replacing the authors' ConDitar / msPRL / paOPT systems
- Claiming real docking scores or ADMET assays from this soft simulation
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using ConDitar / msPRL / paOPT / CDH as the product brand
- Rebranding drug-discovery, joint-care, wild-locomotion, or evidence-synthesis desks as pocket-molecule domain

## Live features (20 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / pocket / target profile catalog  
4. Molecule job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (unconditioned / affinity-only / property-blind vs pocket-property)  
10. Pocket-fit cell strip (acquired vs missing cells)  
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

## Pages (9 ≥6)

1. Marketing landing (`/` Next + `/` / `index.html` harness)  
2. Molecule jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · MoleculeJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Pocket Molecule Desk**  
- [x] Never claim authors' ConDitar replacement / product brand  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
- [x] Live app: `npm run build` + `test/app-up.test.ts` (production server serves `/`)  
