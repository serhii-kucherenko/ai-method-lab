# Rules Preferences Desk — Design system

**Display name:** Rules Preferences Desk  
**Slug:** `rules-preferences-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.15562v1  
**Authors' code:** https://github.com/Official529Tech/rlo-checklist  

Never brand the product as FlyEnJoy, RLO, hard-rules-soft, or Neuro-*. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Rules Preferences Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Compare hard-rule gated packing against a naive preference-only baseline — method experiment, not a commercial packing app
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Sea-slate atmosphere with luggage/capacity visual. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Soft preferences pack; hard rules must still hold |
| **Supporting** | Score hard-rule gated checklist selection against a flat naive preference-only baseline — in a method-lab desk, not a commercial packing app. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare hard-rule gated packing against a naive preference-only baseline in one scenario
2. Keep checklist jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so feasibility scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / trip catalog; checklist job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (naive preference-only vs hard-rule gated); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page

### How it works

1. Open the desk and create a checklist job under a trip project  
2. Run scenario compare — naive preference-only baseline vs hard-rule gated selection  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors’ packing checklist system. Not a commercial travel packing product. Never brand as FlyEnJoy or RLO.

### Sources

- Paper: https://arxiv.org/abs/2607.15562v1  
- Authors’ code: https://github.com/Official529Tech/rlo-checklist  

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
| `--scd-cyan` | Accent (sea glass) | `#3d7a6a` |
| `--scd-ok` | Success | `#2f6b4f` |
| `--scd-warn` | Caution | `#8a5a2f` |
| `--scd-line` | Hair rules (sparingly) | `#c5d0d8` |

Atmosphere: cool mist paper → sea-slate radial wash + luggage capacity visual. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Fraunces** (Google Fonts) | Soft optical serif; hero + wordmark |
| Body / UI | **IBM Plex Sans** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **IBM Plex Mono** | Goldens, deltas, job ids |

### Layout rules

- One job per section; cards only for interactive forms
- No hero overlays / pill clusters / stat strips in first viewport
- Desk chrome after CTA; landing sells

### Motion (3)

1. `scd-trace` — luggage / capacity draw-in on PackField  
2. `std-reveal` — scenario result panel  
3. `std-nav-active` underline settle on desk nav  

### shadcn theme

Radius 0.5rem; primary maps to `--scd-steel`; components: button, card, input, label, table, tabs, badge, select, textarea, separator.

## Page map

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|----------------|
| `/` | Marketing landing | Open desk | — |
| `/jobs` | Checklist job CRUD | Create job | Empty list copy |
| `/lifecycle` | Status transitions | Advance | Illegal → reject |
| `/scenario` | Naive vs hard-rule gated | Run compare | Cheat reject |
| `/batch` | Sibling transitions | Run batch | Per-item reject |
| `/audit` | Trail + CSV | Export | Empty trail |
| `/goldens` | Dual-impl browser | Refresh | Fixture fail badge |
| `/honesty` | Fence + sources | Back to desk | — |
| `/settings` | Webhook rotate | Rotate | Forbidden for viewer |

## Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default, and branding as FlyEnJoy / RLO / hard-rules-soft / Neuro-*.
