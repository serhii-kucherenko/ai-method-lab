# Consult Bench Desk

Org desk for **real-world multimodal consult evaluation plans**: projects, lifecycle, scenario compare (text-only / image_blind / synthetic-chat vs multimodal real-world), audit, webhooks, goldens, and a marketing landing — sourced from paper 2607.09142.

**Display name:** Consult Bench Desk

**Paper URL:** https://arxiv.org/abs/2607.09142v1  
**Authors' code:** none published

**Stack:** Next.js App Router + TypeScript + Tailwind + shadcn/ui  
**Design:** `docs/ideas/consult-bench-desk-DESIGN.md`

## Unique claim

Real-world multimodal consult evaluation plans: text + image evidence with human-in-loop review and cross-modal rubric awareness — versus text-only; image-blind scoring; synthetic-chat-only benches. Soft simulation — not dual-approver / secure-tutor / joint-care / chest-xray / evidence-synthesis rebrand. Never brand authors' model names; never claim telemedicine product.

## Honesty (required)

This is a **method experiment inspired by the paper**. It is **not** a telemedicine consult service and **not** a replacement for the authors' MedRealMM benchmark. Soft simulation only. Never brand this desk as a telemedicine product.

## Forbidden claims

- Shipping or replacing the authors' MedRealMM benchmark
- Claiming real patient diagnoses or clinical decisions from this soft simulation
- Dual-approver status boards as "domain"
- Hiding the honesty fence on UI or digests
- Using authors' model names (or MedRealMM / telemedicine branding) as the product brand
- Rebranding secure-tutor, joint-care, chest-xray, or evidence-synthesis desks as this domain

## Live features (20)

1. Org tenancy  
2. Member roles (admin / operator / viewer)  
3. Project / cohort / modality profile catalog  
4. Consult job create / list / patch / delete  
5. Lifecycle transitions (draft → queued → running → terminal)  
6. Illegal transition reject  
7. Optimistic version conflict  
8. Batch job transitions (independent siblings)  
9. Scenario compare (text_only / image_blind / synthetic-chat vs multimodal real-world)  
10. Text+image+rubric plan strip (acquired vs image-blind cells)  
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
2. Consult jobs (`/jobs`) — desk entry  
3. Lifecycle (`/lifecycle`)  
4. Scenario compare (`/scenario`)  
5. Batch transitions (`/batch`)  
6. Audit (`/audit`)  
7. Goldens browser (`/goldens`)  
8. Honesty (`/honesty`)  
9. Org settings (`/settings`)  

## Aggregates (≥4)

Organization · Project · ConsultJob · AuditEntry (+ OrgSettings, Member)

## Maturity checklist (sustain)

- [x] ≥20 features live  
- [x] ≥8 pages with UI critical paths (incl. marketing landing)  
- [x] ≥4 aggregates  
- [x] Goldens ≥25 dual-impl green  
- [x] Offline `try.html`  
- [x] Tutor guide under `docs/guides/`  
- [x] Digests use **Consult Bench Desk**  
- [x] Never claim telemedicine product / authors' MedRealMM benchmark product brand  
- [x] Next.js + Tailwind + shadcn + DESIGN note + landing at `/`  
- [x] Live app: `npm run build` + `test/app-up.test.ts` (production server serves `/`)  
