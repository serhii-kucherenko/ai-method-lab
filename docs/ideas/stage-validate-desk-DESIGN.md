# Stage Validate Desk — Design system

**Display name:** Stage Validate Desk  
**Slug:** `stage-validate-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.14568v1  
**Authors' code:** none published  

Never brand the product as MiniCPM, Fermi, or Tesla C2075. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Stage Validate Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Stage gates plus tiered measurements before “done” — method experiment, not a Fermi CUDA engine
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Instrument slate mist atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Gate each stage — then measure before done |
| **Supporting** | Stage gates plus tiered long-context, bit-width, and kernel measurements — against naive intuition that skips gates and trusts short benches. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare stage-gated plans against short-bench, assume-4-bit-faster, and hand-GEMM-ceiling baselines
2. Keep stage-validate jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so stage-gate scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / workload profile catalog; stage-validate job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (naive vs stage-gated); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page

### How it works

1. Open the desk and create a stage-validate job under a workload profile  
2. Run scenario compare — naive short-bench intuition vs stage-gated measured plan  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors' Fermi CUDA engine or commercial inference stacks. Never brand MiniCPM, Fermi, or Tesla C2075 as the product name.

### Sources

- Paper: https://arxiv.org/abs/2607.14568v1  
- Authors' code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--svd-ink` | Primary text | `#1c2430` |
| `--svd-muted` | Secondary text | `#5a6578` |
| `--svd-paper` | Page ground | `#eef1f6` |
| `--svd-mist` | Soft panel | `#d5dce8` |
| `--svd-steel` | Brand / CTA | `#3a5a7c` |
| `--svd-steel-deep` | Hover / emphasis | `#2a4159` |
| `--svd-cyan` | Accent (instrument line) | `#4a7a8c` |
| `--svd-ok` | Success | `#2f6b5a` |
| `--svd-warn` | Caution | `#8a5a2f` |
| `--svd-line` | Hair rules (sparingly) | `#c5cedc` |

Atmosphere: cool instrument paper → soft radial slate mist + subtle grid hint. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Sora** | Hero + wordmark |
| Body / UI | **IBM Plex Sans** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **IBM Plex Mono** | Goldens, deltas, job ids |

### Layout rules

- One composition in the first viewport; brand first
- Cards only when they contain interaction
- One job per section below the fold
- No hero overlays / pill clusters / stat-strip clutter

### Motion (2–3)

1. Soft fade-up on hero brand + headline  
2. Stage-gate clarity strip fill on scenario compare  
3. Nav active underline / color shift on desk chrome  

### shadcn theme

Radius 0.5rem; primary mapped to `--svd-steel`; muted panels use `--svd-mist`. Components: Button, Input, Label, Card (interaction only), Badge, Table, Tabs, Textarea, Select, Separator.

## Page map

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Marketing landing | Open desk → `/jobs` | n/a |
| `/jobs` | Stage-validate jobs desk | Create job | Empty list + honesty line |
| `/lifecycle` | Status transitions | Advance / reject illegal | Conflict toast |
| `/scenario` | Naive vs stage-gated compare | Run compare / export JSON | Reject on skip-gates cheat |
| `/batch` | Sibling transitions | Run batch | Independent failure rows |
| `/audit` | Trail + CSV | Export CSV | Empty audit |
| `/goldens` | Dual-impl fixtures | Browse | Fail badge if mismatch |
| `/honesty` | Fence + Sources | Guide link | n/a |
| `/settings` | Webhook rotate | Rotate secret | Admin-only |

## Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default, MiniCPM/Fermi/Tesla C2075 as brand chrome.
