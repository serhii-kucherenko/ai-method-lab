# Video Track Studio

Long-form character-track failure diagnosis for Video-LLM eval leads — register clips and cast, run track probes, diagnose failures, compare track-aware vs fluency baselines.

Inspired by [Do Video-LLMs Actually Watch?](https://arxiv.org/abs/2607.11078v1). **Not** the authors’ toolkit rebrand. **Not** a claim that production models “watch.” Authors’ code: none published.

## Quick start

```bash
cd projects/video-track-studio
npm install
npm run dev
```

Open http://localhost:3000 — marketing landing at `/`, studio entry at `/clips`.

Dev API bearer token: `vts-dev-token`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js app |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm test` | Goldens + store + UI critical path |
| `npm run test:app-up` | Live build + start smoke on `/` |
| `npm run gen:goldens` | Regenerate dual-impl fixtures |

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/pricing` | Hypothetical SaaS tiers (seats / usage / site) |
| `/demo` | Step-by-step guided in-app happy path |
| `/onboarding` | First-run checklist with progress |
| `/clips` | Long-form clip registry |
| `/characters` | Cast character registry |
| `/probes` | Track-probe workspace |
| `/failures` | Failure diagnosis taxonomy |
| `/compare` | Track-aware vs fluency |
| `/settings` | Org, members, exports |
| `/honesty` | Soft-sim fence + Sources |

## Dual scoring

- **A** — track-aware diagnosis quality  
- **B** — benchmark-fluency baseline  

~30 dual-impl goldens under `test/fixtures/`.

## Offline demo

Open `try.html` in a browser for a standalone soft-sim compare.

## Guide

`docs/guides/65-video-track-studio-lessons.md`
