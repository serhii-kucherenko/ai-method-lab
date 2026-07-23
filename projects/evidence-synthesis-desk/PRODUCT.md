# Evidence Synthesis Desk

Org desk for **screened evidence synthesis experiments**: projects, lifecycle, scenario compare (naive average / fixed-effect-all / unweighted eligible vs screened Hedges' g + random-effects), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.15247.

**Display name:** Evidence Synthesis Desk

**Paper URL:** https://arxiv.org/abs/2607.15247v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/evidence-synthesis-desk-DESIGN.md`

## Unique claim

Screen and eligibility before pooling: standardized effect sizes + random-effects synthesis with heterogeneity and audit — vs naive average of reported numbers that skip screening discipline (or include ineligible studies). Scenario compare shows screened vs naive baselines — not a dual-approver status board, not a prompt-cache / packing / itinerary rebrand.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a replacement for the authors' system. It is **not** a commercial evidence-synthesis vendor. Never brand this desk as AutoSynthesis. PRISMA may appear in honesty/Sources only.

## Forbidden claims

- Shipping or replacing the authors' production system
- Claiming clinical or regulatory evidence from this desk
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using AutoSynthesis / PRISMA as product brand
- Rebranding prompt-cache, packing, or itinerary desks as synthesis domain

## Live features (18 ≥15)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / topic catalog  
4. Synthesis job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (naive / fixed-effect-all / unweighted vs screened RE)  
10. Audit log  
11. CSV audit export  
12. Goldens browser (≥25 dual-impl fixtures)  
13. Honesty / disclaimer page  
14. Webhook inbound + HMAC + idempotency  
15. Org webhook settings (admin rotate)  
16. Pagination + search  
17. Rate-limit feedback (429 + Retry-After)  
18. Offline try page (`try.html`) + in-app guide link  

## Pages (9 ≥6)

1. Marketing landing (`/` Next + `/` / `index.html` harness)  
2. Synthesis jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · SynthesisJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥15 features live  
- [x] ≥6 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Evidence Synthesis Desk**  
- [x] Never claim authors' AutoSynthesis / commercial vendor replacement  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
