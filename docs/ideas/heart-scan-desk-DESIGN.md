# Heart Scan Desk — Design system

**Display name:** Heart Scan Desk  
**Slug:** `heart-scan-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.11287v1  
**Authors' code:** none published  

Never claim medical device or clinical diagnostic product. Never brand authors' foundation model names. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Heart Scan Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Unified cardiac CT segmentation + phenotyping plans — method experiment, not a diagnostic
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Lab slate atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Segment structure — phenotype together |
| **Supporting** | Unified segmentation+phenotyping plans with phenotype linked to structure across multicenter sites — against segmentation-only, phenotype-from-raw-pixels-only, or single-center unchecked baselines. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare unified segmentation+phenotyping plans against segmentation-only, phenotype-from-raw-pixels-only, and single-center baselines
2. Keep scan pathway jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so pathway scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / center / site profile catalog; scan job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (seg-only / pheno-pixels / single-center vs unified seg+pheno); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page; structure+phenotype pathway strip; scenario JSON export

### How it works

1. Open the desk and create a scan job under a center / site profile  
2. Run scenario compare — segmentation-only / phenotype-from-pixels / single-center vs unified segmentation+phenotyping  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a clinical diagnostic product and not a claim to replace the authors' foundation model. Never brand this desk as a medical device.

### Sources

- Paper: https://arxiv.org/abs/2607.11287v1  
- Authors' code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--hsd-ink` | Primary text | `#1a2838` |
| `--hsd-muted` | Secondary text | `#5a6674` |
| `--hsd-paper` | Page ground | `#f0f4f7` |
| `--hsd-steel` | Primary action | `#2d6a8a` |
| `--hsd-steel-deep` | Action hover | `#1e4a62` |
| `--hsd-cyan` | Accent / strip | `#4a8a78` |
| `--hsd-line` | Hairline | `#c5d0d9` |

### Typography

- **Display:** Outfit (or similar expressive sans) via `next/font` — brand + section heads
- **Body:** Source Sans 3 — readable desk copy
- Avoid Inter / Roboto / Arial / system as the hero stack

### Motion (2–3 intentional)

1. Landing center-strip stage reveal (`hsd-trace` staggered draw)
2. Nav active underline ease
3. Soft wash on landing hero plane (gradient only as atmosphere — strip is the visual anchor)

### Page compositions

| Route | Job |
|-------|-----|
| `/` | Marketing landing — brand first, CTA to `/jobs` |
| `/jobs` | Scan job list / create |
| `/lifecycle` | Status transitions |
| `/scenario` | Dual-gate compare |
| `/batch` | Sibling batch transitions |
| `/audit` | Audit + CSV |
| `/goldens` | Dual-impl fixtures |
| `/honesty` | Disclaimer + Sources |
| `/settings` | Org webhook rotate |

## shadcn notes

Use Button, Input, Label, Card sparingly (cards only for interactive containers). Prefer flat desk surfaces on paper ground.
