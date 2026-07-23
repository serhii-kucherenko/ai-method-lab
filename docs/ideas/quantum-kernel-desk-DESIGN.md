# Quantum Kernel Desk — Design system

**Display name:** Quantum Kernel Desk  
**Slug:** `quantum-kernel-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.11701v1  
**Authors' code:** none published  

Never brand the product as Q²SAR. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Quantum Kernel Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Quantum multiple-kernel SAR plans — method experiment, not Q²SAR
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Lab slate atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Stack quantum maps — score activity |
| **Supporting** | Multi-kernel quantum-style feature maps for structure–activity scoring — against a classical single linear kernel, a single RBF-only model, or feature-blind flat scores. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare quantum multiple-kernel SAR plans against classical linear, RBF-only, and feature-blind baselines
2. Keep kernel jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so kernel scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / assay / series profile catalog; kernel job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (linear vs quantum multi-kernel); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page; kernel-feature cell strip; scenario JSON export

### How it works

1. Open the desk and create a kernel job under an assay / series profile  
2. Run scenario compare — classical linear / RBF-only / feature-blind vs quantum multi-kernel  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors' Q²SAR pipeline or commercial QSAR and quantum chemistry tools. Never brand Q²SAR as the product name.

### Sources

- Paper: https://arxiv.org/abs/2607.11701v1  
- Authors' code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--qkd-ink` | Primary text | `#1a2838` |
| `--qkd-muted` | Secondary text | `#5a6674` |
| `--qkd-paper` | Page ground | `#eef3f6` |
| `--qkd-steel` | Primary action | `#2f5f7a` |
| `--qkd-steel-deep` | Action hover | `#244a60` |
| `--qkd-cyan` | Accent / strip | `#3a8ea8` |
| `--qkd-line` | Hairline | `#c5d0d8` |

### Typography

- **Display:** Source Serif 4 (or similar expressive serif) via `next/font` — brand + section heads
- **Body:** Source Sans 3 — readable desk copy
- Avoid Inter / Roboto / Arial / system as the hero stack

### Motion (2–3 intentional)

1. Landing kernel-strip stage reveal (`qkd-trace` staggered draw)
2. Nav active underline ease
3. Soft wash on landing hero plane (gradient only as atmosphere — strip is the visual anchor)

### Page compositions

| Route | Job |
|-------|-----|
| `/` | Marketing landing — brand-first hero, problem → product → selling → features → how → honesty → sources |
| `/jobs` | Kernel job list / create (desk entry) |
| `/lifecycle` | Advance a job through legal transitions |
| `/scenario` | Compare linear / RBF / feature-blind vs quantum multi-kernel |
| `/batch` | Sibling batch transitions |
| `/audit` | Audit trail + CSV export |
| `/goldens` | Dual-impl golden browser |
| `/honesty` | Limits + Sources + tutor guide link |
| `/settings` | Org webhook rotate / tokens note |

### Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, and dark-mode-by-default.

### shadcn theme

Radius soft (`0.5rem`); steel primary mapped to `--qkd-steel`; components: Button, Input, Label, Card (interaction only), Table, Tabs, Badge, Select, Textarea, Separator.
