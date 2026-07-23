# Memory Risk Desk — Design system

**Display name:** Memory Risk Desk  
**Slug:** `memory-risk-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.11656v2  
**Authors' code:** none published  

Never brand authors' model names (including NITROGEN). Never claim medical device. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Memory Risk Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Imputation-free calibrated risk plans — method experiment, not a diagnostic
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Lab slate atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Keep missing fields — calibrate risk |
| **Supporting** | Imputation-free plans with calibrated risk bands across heterogeneous cohorts — against mean/mode imputation then flat classifiers, uncalibrated high-confidence scores, or single-cohort-only models. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare imputation-free calibrated plans against mean/mode imputation, uncalibrated, and single-cohort baselines
2. Keep risk jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so risk scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / cohort / site profile catalog; risk job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (mean-impute vs imputation-free calibrated); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page; cohort feature-cell strip; scenario JSON export

### How it works

1. Open the desk and create a risk job under a cohort / site profile  
2. Run scenario compare — mean/mode impute / uncalibrated / single-cohort vs imputation-free calibrated  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a clinical diagnostic product and not a claim to replace the authors' transformer. Never brand this desk as a medical device.

### Sources

- Paper: https://arxiv.org/abs/2607.11656v2  
- Authors' code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--mrd-ink` | Primary text | `#1a2838` |
| `--mrd-muted` | Secondary text | `#5a6674` |
| `--mrd-paper` | Page ground | `#f0f4f7` |
| `--mrd-steel` | Primary action | `#2d6a8a` |
| `--mrd-steel-deep` | Action hover | `#1e4a62` |
| `--mrd-cyan` | Accent / strip | `#4a8a78` |
| `--mrd-line` | Hairline | `#c5d0d9` |

### Typography

- **Display:** Outfit (or similar expressive sans) via `next/font` — brand + section heads
- **Body:** Source Sans 3 — readable desk copy
- Avoid Inter / Roboto / Arial / system as the hero stack

### Motion (2–3 intentional)

1. Landing cohort-strip stage reveal (`mrd-trace` staggered draw)
2. Nav active underline ease
3. Soft wash on landing hero plane (gradient only as atmosphere — strip is the visual anchor)

### Page compositions

| Route | Job |
|-------|-----|
| `/` | Marketing landing — brand first, CTA to `/jobs` |
| `/jobs` | Risk job list / create |
| `/lifecycle` | Status transitions |
| `/scenario` | Dual-gate compare |
| `/batch` | Sibling batch transitions |
| `/audit` | Audit + CSV |
| `/goldens` | Dual-impl fixtures |
| `/honesty` | Disclaimer + Sources |
| `/settings` | Org webhook rotate |

## shadcn notes

Use Button, Input, Label, Card sparingly (cards only for interactive containers). Prefer flat desk surfaces on paper ground.
