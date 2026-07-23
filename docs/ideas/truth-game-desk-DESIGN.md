# Truth Game Desk — Design system

**Display name:** Truth Game Desk  
**Slug:** `truth-game-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.08403v1  
**Authors' code:** none published  

Never claim a hallucination-elimination product. Never brand the authors' framework (or G-Frame) as the product name. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Truth Game Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Game-theoretic multi-agent truth plans — method experiment, not a hallucination cure
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Cool truth-desk ink-slate atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Challenge — payoff — multi-agent truth plans |
| **Supporting** | Game-theoretic multi-agent truth plans with structured challenge and payoff among agents — against single-agent unchecked answers, flat majority vote without game structure, or confidence-only filters. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare game-theoretic multi-agent plans against single-agent, majority-vote, and confidence-only baselines
2. Keep truth jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so truth scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / arena / claim-set catalog; truth job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (single_agent / majority_vote / confidence_only vs game_theoretic); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page; challenge+payoff+agents plan strip; scenario JSON export

### How it works

1. Open the desk and create a truth job under an arena / claim-set profile  
2. Run scenario compare — single-agent / majority-vote / confidence-only vs game-theoretic  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a hallucination-elimination product and not a claim to replace the authors' framework. Never brand this desk as G-Frame or a production hallucination cure.

### Sources

- Paper: https://arxiv.org/abs/2607.08403v1  
- Authors' code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--tgd-ink` | Primary text | `#1a2332` |
| `--tgd-muted` | Secondary text | `#5a6578` |
| `--tgd-paper` | Page ground | `#eef1f6` |
| `--tgd-mist` | Soft panels | `#dde3ec` |
| `--tgd-steel` | Primary action | `#3d6a8a` |
| `--tgd-steel-deep` | Action hover | `#2c4f68` |
| `--tgd-cyan` | Accent / strip | `#6a8f9e` |
| `--tgd-line` | Borders | `#c5d0d9` |
| `--tgd-ok` | Success | `#3d6b55` |
| `--tgd-warn` | Caution | `#8a6a2f` |

Cool truth-desk ink-slate (not purple AI default, not cream+terracotta, not broadsheet, not Consult Bench Desk twin).

### Typography

- Display / brand: expressive serif or distinctive geometric (via Next font) — never Inter/Roboto/Arial/system as the hero face
- Body: readable sans paired to the display face
- Mono: fixture / JSON / audit snippets

### Motion (2–3 intentional)

1. Landing brand fade-up on first paint  
2. Challenge strip cells illuminate left-to-right on load  
3. Active nav underline settles under the current desk route  

### shadcn theme

Map primary / ring / sidebar to `--tgd-steel`; muted surfaces to `--tgd-mist`; keep cards sparse — cards only for interactive job / scenario controls.

## Page compositions (9)

| Route | Job |
|-------|-----|
| `/` | Marketing landing — brand-first hero, selling points, honesty, sources |
| `/jobs` | Truth job list / create / patch entry |
| `/lifecycle` | Transition draft → queued → running → terminal |
| `/scenario` | Dual-gate compare + challenge strip + JSON export |
| `/batch` | Independent sibling transitions |
| `/audit` | Trail + CSV export |
| `/goldens` | Dual-impl fixture browser |
| `/honesty` | Disclaimer fence |
| `/settings` | Org webhook rotate / roles |

## Forbidden visual / copy

- Authors' framework / G-Frame as product brand  
- Hallucination-elimination / production cure claims  
- Noun-swap of agent-safety / enterprise-agent / consult-bench / secure-tutor chrome  
- Purple-on-white gradient default, cream+terracotta, broadsheet dense columns  
