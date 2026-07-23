# AI Governance Desk

Org desk for **conjoint AI governance preference experiments**: projects, lifecycle, scenario compare (tech-first / always-private / always-national vs preference-aligned), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.14585.

**Display name:** AI Governance Desk

**Paper URL:** https://arxiv.org/abs/2607.14585v1  
**Authors' code:** none published (OSF pre-registration: https://osf.io/5rz9p/)

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/ai-governance-desk-DESIGN.md`

## Unique claim

Conjoint preference scoring over three axes — safety vs innovation, public vs private governance, international vs national — optionally by domain (workplace / policing / warfare) and risk perception. Scenario compare shows a preference-aligned proposal versus naive always-innovation / always-private / always-national (or composite tech-first) baselines — not a dual-approver status board, not a tactile / meta-analysis / prompt-cache rebrand.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' survey research or OSF materials. It is **not** a government AI regulation product. Never brand this desk as a government AI regulator or EU AI Act product name.

## Forbidden claims

- Shipping or replacing the authors' survey / OSF materials
- Claiming official public-policy authority from this desk
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using a government AI regulator / EU AI Act product name as brand
- Rebranding tactile, prompt-cache, packing, itinerary, or evidence-synthesis desks as governance domain

## Live features (20 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / governance domain catalog  
4. Governance preference job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (tech-first / always-private / always-national vs preference-aligned)  
10. Preference clarity strip (clear vs unclear cells)  
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
2. Governance preference jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · GovernanceJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **AI Governance Desk**  
- [x] Never claim authors' survey replacement / government AI regulation product  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
- [x] Live app: `npm run build` + `test/app-up.test.ts` (production server serves `/`)  
