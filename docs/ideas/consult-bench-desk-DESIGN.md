# Consult Bench Desk — Design system

**Display name:** Consult Bench Desk  
**Slug:** `consult-bench-desk`  
**Stack:** Next.js App Router + Tailwind + shadcn/ui (Radix)  
**Paper:** https://arxiv.org/abs/2607.09142v1  
**Authors' code:** none published  

Never claim telemedicine product. Never brand MedRealMM as the product name. The display name is the hero signal on every surface.

## Brand

- **Name in chrome:** Consult Bench Desk (wordmark-level, not a nav afterthought)
- **One-line promise:** Real-world multimodal consult evaluation plans — method experiment, not a telemedicine service
- **Landing first viewport:** one composition — brand, one headline, one supporting sentence, primary CTA → `/jobs` (Open desk). Cool consult-desk slate atmosphere. No dashboard dump, no pill clusters, no floating badges on the hero plane

## Landing brief

| Field | Copy |
|-------|------|
| **Headline** | Text + image — real cases — rubric across modalities |
| **Supporting** | Real-world multimodal consult evaluation plans with text + image evidence and a cross-modal rubric — against text-only scoring, image-blind baselines, or synthetic-chat-only benches. |
| **Primary CTA** | Open desk → `/jobs` |
| **Secondary CTA** | Read honesty → `/honesty` |

### Selling points (4)

1. Compare multimodal real-world plans against text-only, image-blind, and synthetic-chat baselines
2. Keep consult jobs honest with lifecycle, batch siblings, and audit export
3. Browse dual-impl goldens so bench scores stay checkable, not theatrical
4. Org webhooks and roles so rejects and rotates stay visible

### Features (≥15, plain language)

Org tenancy; member roles; project / cohort / modality catalog; consult job create/list/patch/delete; lifecycle transitions; illegal-transition reject; optimistic version conflict; batch sibling transitions; scenario compare (text_only / image_blind / synthetic_chat vs multimodal_realworld); audit log; CSV export; goldens browser; honesty page; signed inbound webhooks; admin webhook rotate; pagination + search; rate-limit feedback; offline try page; text+image+rubric plan strip; scenario JSON export

### How it works

1. Open the desk and create a consult job under a cohort / modality profile  
2. Run scenario compare — text-only / image-blind / synthetic-chat vs multimodal real-world  
3. Advance lifecycle / batch, then export the audit trail  

### Honesty / limits

Workflow experiment inspired by the paper. Not a telemedicine product and not a claim to replace MedRealMM. Never brand this desk as a clinical consult service.

### Sources

- Paper: https://arxiv.org/abs/2607.09142v1  
- Authors' code: none published  

## Visual direction

### Palette (CSS variables)

| Token | Role | Value |
|-------|------|--------|
| `--cbd-ink` | Primary text | `#1a2332` |
| `--cbd-muted` | Secondary text | `#5a6578` |
| `--cbd-paper` | Page ground | `#eef1f6` |
| `--cbd-mist` | Soft panels | `#dde3ec` |
| `--cbd-steel` | Primary action | `#3d6a8a` |
| `--cbd-steel-deep` | Action hover | `#2c4f68` |
| `--cbd-cyan` | Accent / strip | `#6a8f9e` |
| `--cbd-line` | Borders | `#c5d0d9` |
| `--cbd-ok` | Success | `#3d6b55` |
| `--cbd-warn` | Caution | `#8a6a2f` |

Cool consult-desk slate-blue (not purple AI default, not cream+terracotta, not broadsheet, not Chest Xray Desk teal twin).

### Typography

- Display / brand: expressive serif or distinctive geometric (via Next font) — never Inter/Roboto/Arial/system as the hero face
- Body: readable sans paired to the display face
- Mono: fixture / JSON / audit snippets

### Motion (2–3 intentional)

1. Landing brand fade-up on first paint  
2. Modality strip cells illuminate left-to-right on load  
3. Active nav underline settles under the current desk route  

### shadcn theme

Map primary / ring / sidebar to `--cbd-steel`; muted surfaces to `--cbd-mist`; keep cards sparse — cards only for interactive job / scenario controls.

## Page compositions (9)

| Route | Job |
|-------|-----|
| `/` | Marketing landing — brand-first hero, selling points, honesty, sources |
| `/jobs` | Consult job list / create / patch entry |
| `/lifecycle` | Transition draft → queued → running → terminal |
| `/scenario` | Dual-gate compare + modality strip + JSON export |
| `/batch` | Independent sibling transitions |
| `/audit` | Trail + CSV export |
| `/goldens` | Dual-impl fixture browser |
| `/honesty` | Disclaimer fence |
| `/settings` | Org webhook rotate / roles |

## Forbidden visual / copy

- MedRealMM as product brand  
- Telemedicine / clinical consult service claims  
- Noun-swap of secure-tutor / joint-care / chest-xray / evidence-synthesis chrome  
- Purple-on-white gradient default, cream+terracotta, broadsheet dense columns  
