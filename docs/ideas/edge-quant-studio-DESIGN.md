# Design — Edge Quant Studio

## Brand

**Edge Quant Studio** — hero-level on the landing. Tagline: *Plan bits where the edge CPU can keep them.*

## Landing brief

- **Headline:** Channel-aware bit plans for edge CPUs — before you ship uniform W3 and pray.  
- **Support:** Soft-sim fractional budgets, cluster/runtime plans, and an honesty fence — not measured silicon.  
- **Primary CTA:** Open packs → `/packs`  
- **Secondary:** Honesty → `/honesty`  
- **Selling points:** Channel bit-width board · Uniform vs channel-aware compare · Compile/runtime soft-sim · Latency/memory honesty · Model packs for constrained targets  
- **Honesty:** Method Lab soft-sim inspired by PolyQ; not PolyQ; not authors’ product; not silicon benches.  
- **Sources:** https://arxiv.org/abs/2607.14618v1 · authors’ code: none  

## Visual direction

- **Palette:** Cool steel + signal cyan on deep slate ink — edge/infra feel (not purple AI, not cream/terracotta, not broadsheet).  
  - `--studio-bg: #e6eef4`  
  - `--studio-ink: #0f1c28`  
  - `--studio-cyan: #1a9bb8`  
  - `--studio-steel: #4a6278`  
  - `--studio-panel: #f2f6fa`  
- **Type:** Display = **Syne**; body = **Source Sans 3**; mono = Geist Mono.  
- **Atmosphere:** Full-bleed hero with soft radial steel/cyan wash + faint grid (CPU/layout metaphor).  
- **Motion:** Hero brand fade-up; CTA underline draw; section reveal on scroll (2–3 only).  

## Layout rules

- First viewport: brand + one headline + one sentence + CTA group + atmosphere only.  
- Cards only for interactive plan/pack forms.  
- One job per section.  

## shadcn

Radius `0.5rem`; map primary → cyan; use Button, Input, Label, Table, Tabs, Badge, Select, Textarea, Separator, Card (interaction only).

## Page map

| Page | Purpose | Empty / error |
|------|---------|---------------|
| `/` | Sell | n/a |
| `/packs` | Register models | Checklist CTA |
| `/channels` | Bit plans | Prompt pick pack+target |
| `/targets` | CPU profiles | Add first target |
| `/runtime` | Compile soft-sim | Link from channels |
| `/budgets` | Memory honesty | Link from targets |
| `/compare` | A vs B | Need scored plan |
| `/settings` | Org/webhook | Validation errors |
| `/honesty` | Fence + Sources | n/a |

## Anti-looks

Refuse purple-on-white, cream+terracotta, broadsheet hairlines, dark-mode-by-default, glow pill spam.
