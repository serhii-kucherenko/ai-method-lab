# Chest Xray Desk — Design system

**Display name:** Chest Xray Desk  
**Slug:** `chest-xray-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.09305v1  
**Authors' code:** none published  

Never claim medical device or radiology product. Never brand the authors' Thailand deep learning system. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Chest Xray Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Classify → localize → clinically validate plans — method experiment, not a diagnostic
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Cool film-lab atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Classify labels — localize regions — validate clinically |
| **Supporting** | Classify→localize→validate plans with label + region localization and a clinical validation gate — against classification-only, localization without clinical gate, or unverified single-threshold alerts. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare classify→localize→validate plans against classification-only, localization-without-gate, and threshold-alert baselines
2. Keep study jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so plan scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / site / protocol catalog; study job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (classify_only / localize_no_gate / threshold_alert vs classify→localize→validate); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page; label+region plan strip; scenario JSON export

### How it works

1. Open the desk and create a study job under a site / protocol profile  
2. Run scenario compare — classification-only / localize-no-gate / threshold-alert vs classify→localize→validate  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a radiology product for diagnosis and not a claim to replace the authors' Thailand deep learning system. Never brand this desk as a medical device.

### Sources

- Paper: https://arxiv.org/abs/2607.09305v1  
- Authors' code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--cxd-ink` | Primary text | `#15202b` |
| `--cxd-muted` | Secondary text | `#5c6b78` |
| `--cxd-paper` | Page ground | `#eef2f4` |
| `--cxd-mist` | Soft panels | `#d8e2e6` |
| `--cxd-steel` | Primary action | `#3a7a72` |
| `--cxd-steel-deep` | Action hover | `#2a5a54` |
| `--cxd-cyan` | Accent / strip | `#5a8fa8` |
| `--cxd-line` | Borders | `#c2ced4` |
| `--cxd-ok` | Success | `#3d6b55` |
| `--cxd-warn` | Caution | `#8a6a2f` |

Cool film-lab teal-ink (not purple AI default, not cream+terracotta, not broadsheet, not Heart Scan Desk steel-slate twin).

### Typography

- Display / brand: expressive serif or distinctive geometric (via Next font) — never Inter/Roboto/Arial/system as the hero face
- Body: readable sans paired to the display face
- Mono: fixture / JSON / audit snippets

### Motion (2–3 intentional)

1. Landing brand fade-up on first paint  
2. Region strip cells illuminate left-to-right on load  
3. Scenario compare bar fills after score returns  

### Page compositions

| Route | Job |
|-------|-----|
| `/` | Marketing landing — brand hero, selling points, features, how-it-works, honesty, sources |
| `/jobs` | Study job list / create |
| `/lifecycle` | Draft → queued → running → terminal |
| `/scenario` | Dual-gate compare + JSON export |
| `/batch` | Sibling transitions |
| `/audit` | Log + CSV export |
| `/goldens` | Dual-impl fixture browser |
| `/honesty` | Disclaimer + guide link |
| `/settings` | Org webhook / roles |

## shadcn theme

Map `--primary` to `--cxd-steel`, `--background` to `--cxd-paper`, radius `0.5rem`. Prefer tables and strips over card grids on desk pages; cards only when they contain a user interaction.
