# Prompt Cache Desk — Design system

**Display name:** Prompt Cache Desk  
**Slug:** `prompt-cache-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.15516v1  
**Authors' code:** none published  

Never brand the product as CAPC, Sonnet, or PayPal. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Prompt Cache Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Compare cache-aware compression against naive baselines under a two-tier hit-rate cost model — method experiment, not a commercial LLM API gateway
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Circuit-slate atmosphere with two-tier cache visual. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Compress once; keep the cheap cache tier |
| **Supporting** | Score query-agnostic compression with a tier-preserving ratio bound against naive baselines under a two-tier hit-rate cost model. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare cache-aware compression against vanilla, cache-only, and query-aware baselines in one scenario
2. Keep cache jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so two-tier cost scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / workload catalog; cache job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (vanilla / cache-only / query-aware vs cache-aware); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page

### How it works

1. Open the desk and create a cache job under a workload project  
2. Run scenario compare — query-aware breaks cache; cache-aware keeps a tier-safe prefix  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors' system. Not a commercial LLM API gateway. Never brand as CAPC, Sonnet, or PayPal.

### Sources

- Paper: https://arxiv.org/abs/2607.15516v1  
- Authors' code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--scd-ink` | Primary text | `#1c2a36` |
| `--scd-muted` | Secondary text | `#5a6a78` |
| `--scd-paper` | Page ground | `#eef3f6` |
| `--scd-mist` | Soft panel | `#d5e2ea` |
| `--scd-steel` | Brand / CTA | `#1f5a6e` |
| `--scd-steel-deep` | Hover / emphasis | `#163f4d` |
| `--scd-cyan` | Accent (circuit glass) | `#3d7a6a` |
| `--scd-ok` | Success | `#2f6b4f` |
| `--scd-warn` | Caution | `#8a5a2f` |
| `--scd-line` | Hair rules (sparingly) | `#c5d0d8` |

Atmosphere: cool mist paper → circuit-slate radial wash + two-tier threshold visual. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Space Grotesk** (Google Fonts) | Geometric sans; hero + wordmark |
| Body / UI | **Source Sans 3** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **IBM Plex Mono** | Goldens, deltas, job ids |

### Layout rules

- One job per section below the fold
- Cards only when they contain interaction (scenario form, settings)
- No hero overlays / pill clusters / stat strips
- Marketing `/` sells; desk CRUD lives behind Open desk

### Motion (2–3)

1. Soft fade-up on hero brand + headline  
2. Trace draw on the two-tier cache SVG (`.scd-trace`)  
3. Scenario result panel reveal (`.std-reveal`)  

### shadcn theme

Radius ~0.4rem; map steel/cyan/ink into CSS variables; use Button, Card, Input, Label, Table, Tabs, Badge, Separator.

### Page map

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Marketing landing | Open desk | — |
| `/jobs` | Cache job list/create | Create job | Empty list copy |
| `/lifecycle` | Transition graph | Advance status | Illegal transition toast |
| `/scenario` | Cost compare | Run compare | Reject on ideal_rho_cheat |
| `/batch` | Sibling transitions | Apply batch | Partial rejects listed |
| `/audit` | Trail + CSV | Export CSV | Empty audit |
| `/goldens` | Fixture browser | — | Fail markers |
| `/honesty` | Fence + sources | — | — |
| `/settings` | Webhook rotate | Rotate | Forbidden for viewer |

### Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default.
