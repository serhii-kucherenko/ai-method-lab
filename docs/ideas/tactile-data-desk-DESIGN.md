# Tactile Data Desk — Design system

**Display name:** Tactile Data Desk  
**Slug:** `tactile-data-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.14588v1  
**Authors' code:** https://github.com/accessible-data-vis/feelogue  

Never brand the product as Feelogue, CTDI, or Dot Pad. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Tactile Data Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Touch-first layers, confirm selection, ask the agent, verify on the chart — method experiment, not a commercial tactile accessibility product
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Soft-layer chart atmosphere with cool slate mist. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Select, confirm, ask — then verify on the chart |
| **Supporting** | Score soft layered selection, confirmation, agent calculation, and chart verification against speech-only answers that skip tactile grounding. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare grounded select → confirm → ask → verify against speech-only answers that skip tactile grounding
2. Keep tactile explore jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so grounding scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / chart topic catalog; tactile explore job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (speech-only / select-skip-confirm / agent-no-verify vs grounded); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page

### How it works

1. Open the desk and create a tactile explore job under a chart topic  
2. Run scenario compare — speech-only invents answers; grounded path selects, confirms, asks, then verifies on the chart  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a replacement for the authors' system. Not a commercial tactile accessibility product. Never brand as Feelogue, CTDI, or Dot Pad.

### Sources

- Paper: https://arxiv.org/abs/2607.14588v1  
- Authors' code: https://github.com/accessible-data-vis/feelogue  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--tdd-ink` | Primary text | `#1c2838` |
| `--tdd-muted` | Secondary text | `#5a6a78` |
| `--tdd-paper` | Page ground | `#eef2f6` |
| `--tdd-mist` | Soft panel | `#d5e0ea` |
| `--tdd-steel` | Brand / CTA | `#2a4a6a` |
| `--tdd-steel-deep` | Hover / emphasis | `#1c3550` |
| `--tdd-cyan` | Accent (layer glass) | `#3d6a8a` |
| `--tdd-ok` | Success | `#2f6b4f` |
| `--tdd-warn` | Caution | `#8a5a2f` |
| `--tdd-line` | Hair rules (sparingly) | `#c5d0d8` |

Atmosphere: cool slate paper → soft radial mist + subtle layer-grid hint. Not flat single fill. Not dark-mode-by-default. Not purple-on-white, not warm-cream+terracotta, not broadsheet.

### Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / brand | **Fraunces** (optical size) or Space Grotesk fallback | Hero + wordmark |
| Body / UI | **Source Sans 3** | Readable desk chrome; never Inter/Roboto/Arial alone |
| Mono (scores, ids) | **IBM Plex Mono** | Goldens, deltas, job ids |

### Layout rules

- One job per section; cards only when they contain interaction
- No hero overlays / pill clusters / stat-strip clutter
- Marketing `/` sells; desk chrome starts at `/jobs`

### Motion (2–3)

1. Soft mist drift on landing ground (CSS opacity/translate, subtle)
2. Primary CTA hover deepen (steel → steel-deep)
3. Desk nav active underline ease-in

### shadcn theme

Radius ~0.4rem; map primary to `--tdd-steel`; use Button, Input, Label, Card (interaction only), Badge, Table, Tabs, Separator, Textarea, Select as needed.

## Page map

| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Marketing landing | Open desk | — |
| `/jobs` | Tactile explore job list/create | Create job | Empty list copy |
| `/lifecycle` | Transition a job | Apply transition | Illegal → reject message |
| `/scenario` | Compare speech-only vs grounded | Run compare | Cheat reject |
| `/batch` | Sibling transitions | Run batch | Per-id reject |
| `/audit` | Trail + CSV | Export CSV | Empty audit |
| `/goldens` | Dual-impl browser | Refresh | Fail card if mismatch |
| `/honesty` | Fence + Sources | Tutor guide link | — |
| `/settings` | Webhook rotate | Rotate | Viewer secret null |

## Anti-looks

Refuse purple-on-white AI defaults, warm-cream+terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default, dual-approver board chrome, evidence-synthesis forest plots as the brand story.
