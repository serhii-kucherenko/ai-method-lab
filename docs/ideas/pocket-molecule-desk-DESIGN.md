# Pocket Molecule Desk — Design system

**Display name:** Pocket Molecule Desk  
**Slug:** `pocket-molecule-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.12349v1  
**Authors' code:** none published  

Never brand the product as ConDitar / msPRL / paOPT / CDH. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Pocket Molecule Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Pocket-conditioned + property-aware molecule plans — method experiment, not ConDitar
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Lab slate atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Condition the pocket — steer developability |
| **Supporting** | Multi-scale pocket conditioning plus binding affinity and ADMET/developability steering — against ligand-only resemblance or affinity-only plans that skip developability. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare pocket-conditioned + property-aware plans against ligand-only, affinity-only, and property-blind baselines
2. Keep molecule jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so molecule scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / pocket / target profile catalog; molecule job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (unconditioned vs pocket-property); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page; pocket-fit cell strip; scenario JSON export

### How it works

1. Open the desk and create a molecule job under a pocket / target profile  
2. Run scenario compare — unconditioned / affinity-only / property-blind vs pocket-conditioned + property-aware  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors' ConDitar pipeline or commercial structure-based drug design tools. Never brand ConDitar / msPRL / paOPT / CDH as the product name.

### Sources

- Paper: https://arxiv.org/abs/2607.12349v1  
- Authors' code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--pmd-ink` | Primary text | `#1a2838` |
| `--pmd-muted` | Secondary text | `#5a6674` |
| `--pmd-paper` | Page ground | `#eef3f6` |
| `--pmd-steel` | Primary action | `#2f5f7a` |
| `--pmd-steel-deep` | Action hover | `#244a60` |
| `--pmd-cyan` | Accent / strip | `#3a8ea8` |
| `--pmd-line` | Hairline | `#c5d0d8` |

### Typography

- **Display:** Source Serif 4 (or similar expressive serif) via `next/font` — brand + section heads
- **Body:** Source Sans 3 — readable desk copy
- Avoid Inter / Roboto / Arial / system as the hero stack

### Motion (2–3 intentional)

1. Landing pocket-strip stage reveal (`pmd-trace` staggered draw)
2. Nav active underline ease
3. Soft wash on landing hero plane (gradient only as atmosphere — strip is the visual anchor)

### Page compositions

| Route | Job |
|-------|-----|
| `/` | Marketing — brand hero, problem, product, selling points, features, how-it-works, honesty |
| `/jobs` | Molecule job CRUD desk entry |
| `/lifecycle` | Status transitions + illegal reject |
| `/scenario` | Dual-gate compare |
| `/batch` | Sibling batch transitions |
| `/audit` | Audit log + CSV |
| `/goldens` | Dual-impl fixture browser |
| `/honesty` | Disclaimer fence |
| `/settings` | Org webhook rotate |

## shadcn theme notes

Map primary to `--pmd-steel`; keep cards only where they wrap interaction (forms, tables). Landing avoids card grids in the first viewport.
