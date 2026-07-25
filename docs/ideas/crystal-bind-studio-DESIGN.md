# DESIGN — Crystal Bind Studio

## Brand

**Crystal Bind Studio** — “Bind modalities. Retrieve the crystal.”

Hero-level product name. First viewport is one composition: brand, one headline, one supporting sentence, one CTA group, full-bleed mineral atmosphere. No stats or feature grids in the hero.

## Landing brief

- **Headline:** Find the same crystal when structure, diffraction, DOS, and language disagree.  
- **Support:** Register packs, align four descriptor lanes into a shared bind space, and compare multimodal retrieve quality against a single-modality baseline.  
- **Primary CTA:** → `/packs` (“Open studio”)  
- **Secondary CTA:** → `/honesty`  
- **Sections:** Problem → Product → Selling points → Features → How it works → Honesty → Sources → Footer CTA  
- **Sources:** https://arxiv.org/abs/2607.08470v1 · authors’ code: none  

## Visual direction

- **Palette:** pale mineral wash `#e4f0ed`, graphite ink `#1a2421`, forest teal `#116466`, soft jade panel `#f3faf7`, lattice gold `#a8893a` (signal only — not cream/terracotta hero)  
- **Atmosphere:** soft radial jade wash + faint lattice-grid pattern on desk chrome; landing hero uses deep teal→graphite gradient with subtle crystal facet motif  
- **Typography:** display **Sora**; body **Manrope** (not Inter/Roboto/Arial/system alone)  
- **Motion:** (1) hero fade-rise, (2) bind-node pulse on bind explorer, (3) score bar fill on retrieve  

## Layout rules

- One job per section  
- Cards only when they contain interaction (forms / lists)  
- No hero overlays, pill clusters, or stat strips on the landing  
- Mobile + desktop usable  

## Anti-looks

Refuse purple-on-white AI defaults, warm-cream + terracotta cliché, broadsheet hairline newspaper layouts, dark-mode-by-default.

## shadcn theme

- Radius ~0.55rem  
- Primary → forest teal; muted → mineral grey; accent → jade soft  
- Components: button, input, label, textarea, card, badge, table, tabs, select, separator  

## Page map

| Page | Purpose | Primary CTA | Empty / error |
|------|---------|-------------|---------------|
| `/` | Sell multimodal crystal retrieve | Open studio → `/packs` | n/a |
| `/packs` | Registry | Create pack | Onboarding checklist |
| `/structure` | Structure lane | Add structure | Link to packs |
| `/diffraction` | Diffraction lane | Add diffraction | Link to packs |
| `/dos` | DOS lane | Add DOS | Link to packs |
| `/language` | Language lane | Add descriptor | Link to packs |
| `/bind` | Bind-space explorer | Project bind | Need pack + lanes |
| `/retrieve` | A vs B compare | Run retrieve | Need bind projection |
| `/settings` | Org / members / webhook / export | Save | Auth errors |
| `/honesty` | Soft-sim fence + Sources | Back to packs | n/a |

## Forbidden IA

Do not use `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary nav.  
Do not noun-swap Optical Stack or Edge Quant page trees.  
