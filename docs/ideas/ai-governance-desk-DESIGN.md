# AI Governance Desk — Design system

**Display name:** AI Governance Desk  
**Slug:** `ai-governance-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.14585v1  
**Authors' code:** none published (OSF pre-registration: https://osf.io/5rz9p/)  

Never brand the product as a government AI regulator or EU AI Act product name. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** AI Governance Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Conjoint preference scoring across safety, public, and international axes — method experiment, not a government AI regulation product
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Civic forest mist atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Score preferences — then compare governance proposals |
| **Supporting** | Conjoint preference scoring across safety versus innovation, public versus private, and international versus national — against naive tech-first baselines. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare preference-aligned proposals against always-innovation, always-private, and always-national baselines
2. Keep governance preference jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so conjoint preference scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / governance domain catalog; governance preference job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (tech-first / always-private / always-national vs preference-aligned); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page

### How it works

1. Open the desk and create a governance preference job under a domain  
2. Run scenario compare — tech-first and single-axis naives vs preference-aligned  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors' survey research or OSF materials. Not a government AI regulation product. Never brand as a government AI regulator or EU AI Act product name.

### Sources

- Paper: https://arxiv.org/abs/2607.14585v1  
- Authors' code: none published · OSF pre-registration: https://osf.io/5rz9p/  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--agd-ink` | Primary text | `#1a2e28` |
| `--agd-muted` | Secondary text | `#5a6e66` |
| `--agd-paper` | Page ground | `#f0f4f1` |
| `--agd-mist` | Soft panel | `#d8e4dc` |
| `--agd-steel` | Brand / CTA | `#2d5a4a` |
| `--agd-steel-deep` | Hover / emphasis | `#1e4034` |
| `--agd-cyan` | Accent (civic line) | `#4a6b5c` |
| `--agd-ok` | Success | `#2f6b4f` |
| `--agd-warn` | Caution | `#8a5a2f` |
| `--agd-line` | Hair rules (sparingly) | `#c5d4cc` |

Atmosphere: cool civic paper → soft radial forest mist + subtle grid hint. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Space Grotesk** | Hero + wordmark |
| Body / UI | **Source Sans 3** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **IBM Plex Mono** | Goldens, deltas, job ids |

### Layout rules

- One job per section; cards only when they contain interaction
- No hero overlays / pill clusters / stat-strip clutter
- Landing header minimal (Open desk only) so first viewport stays brand-first
- Desk chrome: brand wordmark + nav after CTA into `/jobs`

### Motion (2–3)

1. `std-reveal` — section enter on landing below-the-fold blocks  
2. `scd-trace` — preference axis path draw on route field / hero accent  
3. `std-nav-active` — underline scale on active desk nav  

### shadcn theme

Radius `0.5rem`; primary mapped to `--agd-steel`; muted to `--agd-mist`. Components: Button, Input, Label, Badge, Separator, Table, Tabs, Textarea, Select, Card (interaction containers only).

## Page map

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Marketing landing | Open desk → `/jobs` | n/a |
| `/jobs` | Preference jobs list/create | Create job | Empty list copy |
| `/lifecycle` | Status transitions | Advance | Illegal transition toast |
| `/scenario` | Conjoint compare | Run compare | Reject on ignore-prefs cheat |
| `/batch` | Sibling transitions | Run batch | Partial reject rows |
| `/audit` | Trail + CSV | Export CSV | Empty audit |
| `/goldens` | Dual-impl browser | Refresh | Fixture fail highlight |
| `/honesty` | Fence + Sources | Guide link | n/a |
| `/settings` | Webhook rotate | Rotate | Forbidden for viewer |

## Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default.
