# Security Control Desk — Design system

**Display name:** Security Control Desk  
**Slug:** `security-control-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.09076v1  
**Authors' code:** none published  

Never brand the product as Neuro-Agentic Control. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Security Control Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Compare safer agentic counterfactual control against a naive open-loop baseline — method experiment, not a commercial industrial control product
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Steel/copper atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Open-loop agents act before physics can veto |
| **Supporting** | Score safer agentic counterfactual control against a flat naive open-loop baseline — in a method-lab desk, not a commercial industrial control product. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare safer agentic counterfactual control against a naive open-loop baseline in one scenario
2. Keep control jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so risk scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project catalog; control job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (naive open-loop vs safer agentic); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page

### How it works

1. Open the desk and create a control job under a project  
2. Run scenario compare — naive open-loop baseline vs safer agentic counterfactual control  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors’ neuro-agentic control system. Not a commercial industrial control product. Never brand as Neuro-Agentic Control.

### Sources

- Paper: https://arxiv.org/abs/2607.09076v1  
- Authors’ code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--scd-ink` | Primary text | `#1a2332` |
| `--scd-muted` | Secondary text | `#5c6678` |
| `--scd-paper` | Page ground | `#eef1f4` |
| `--scd-mist` | Soft panel | `#d9e0e8` |
| `--scd-steel` | Brand / CTA | `#2a4a66` |
| `--scd-steel-deep` | Hover / emphasis | `#1c3348` |
| `--scd-cyan` | Accent (copper) | `#b8752a` |
| `--scd-ok` | Success | `#2f6b4f` |
| `--scd-warn` | Caution | `#8a5a2f` |
| `--scd-line` | Hair rules (sparingly) | `#c5ced6` |

Atmosphere: cool steel paper → copper radial wash + faint forecast traces. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

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

1. `scd-trace` — forecast / CF path draw-in on ControlField  
2. `std-reveal` — scenario result panel  
3. `std-nav-active` underline settle on desk nav  

### shadcn theme

Radius 0.5rem; primary maps to `--scd-steel`; components: button, card, input, label, table, tabs, badge, select, textarea, separator.

## Page map

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|----------------|
| `/` | Marketing landing | Open desk | — |
| `/jobs` | Control job CRUD | Create job | Empty list copy |
| `/lifecycle` | Status transitions | Advance | Illegal → reject |
| `/scenario` | Naive vs safer CF | Run compare | Cheat reject |
| `/batch` | Sibling transitions | Run batch | Per-item reject |
| `/audit` | Trail + CSV | Export | Empty trail |
| `/goldens` | Dual-impl browser | Refresh | Fixture fail badge |
| `/honesty` | Fence + sources | Back to desk | — |
| `/settings` | Webhook rotate | Rotate | Forbidden for viewer |

## Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default, and branding as Neuro-Agentic Control.
