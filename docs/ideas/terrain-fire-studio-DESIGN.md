# Design — Terrain Fire Studio

## Brand
**Terrain Fire Studio** — industrial public-safety GIS for wildfire terrain refresh. Hero-level product name; not a nav afterthought.

## Landing brief
- **Headline:** Align new aerials to the ground crews trust.
- **Support:** Physics-aware terrain refresh beats naive photo-on-DEM overlays — before fire season, not after.
- **Primary CTA:** Open packs → `/packs`
- **Secondary:** Guided demo → `/demo`
- Selling points: versioned packs, aerial refreshes, alignment plans, A/B compare, audit/export
- Honesty: soft-sim method-lab product; not LTM; not live dispatch or survey cert
- Sources: arXiv 2607.08711v1; authors’ code: none

## Visual direction
- **Palette:** Dry grassland / ember — warm sand `#E8DFD0`, charcoal terrain `#2C2A26`, ember accent `#C45C26`, ridge green `#3D5A45`, sky wash `#A8B8C4`
- **Typography:** Fraunces (display) + Source Sans 3 (body) — not Inter/Roboto
- **Atmosphere:** Topographic contour wash + soft ember gradient; not flat fill
- **Anti-looks:** No purple-indigo AI default; no cream+terracotta cliché; no broadsheet newspaper; not dark-mode-by-default

## Layout rules
- First viewport: one composition — brand, one headline, one sentence, CTA group, full-bleed topo atmosphere
- Cards only for interactive work surfaces (pack forms, compare panel)
- One job per section

## Motion
1. Hero contour lines fade-in
2. Ember accent underline draws on brand
3. Pack row hover lift (subtle)

## shadcn theme
- Radius: 0.4rem
- Primary: ember `#C45C26`
- Background: sand `#E8DFD0`
- Foreground: charcoal `#2C2A26`
- Components: button, card, input, label, select, table, tabs, badge, separator, textarea

## Page map

| Page | Purpose | Empty/error |
|------|---------|-------------|
| `/` | Sell outcome | — |
| `/pricing` | Pilot / Agency / Site tiers | Honesty: no live checkout |
| `/demo` | Numbered guided path | Missing pack → seed CTA |
| `/onboarding` | Checklist + progress | Incomplete steps stay open |
| `/flows` | ≥5 flow cards + CTAs | — |
| `/packs` | Pack registry | Empty → create first pack |
| `/aerials` | Aerial refreshes | Need pack first |
| `/alignment` | Alignment plans | Need pack + aerial |
| `/compare` | A vs B score | Need plan |
| `/settings` | Org / members / export / audit | Auth fail → 401 |
| `/honesty` | Soft-sim fence + Sources | — |

## Commercial surfaces
- Pricing copy matches seats + refresh compute money hook
- Demo is interactive step walkthrough
- Onboarding checklist with visible progress bar
