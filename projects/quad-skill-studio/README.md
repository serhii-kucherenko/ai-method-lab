# Quad Skill Studio

Switch gaits before the terrain switches you.

Robotics teams train quadrupeds for wild terrain with multi-skill locomotion and smooth gait transitions — compared against single-gait policies that stall when the ground changes.

## Claim

Robotics teams train quadrupeds for wild terrain with multi-skill locomotion and smooth gait transitions — not single-gait policies that stall when the ground changes.

Inspired by [arXiv:2607.13579](https://arxiv.org/abs/2607.13579v1). Not live robot control. Not APT-RL branding. Authors’ public code: none.

## Run locally

```bash
cd projects/quad-skill-studio
npm install
npm run dev
```

Open http://localhost:3000 — landing CTA goes to `/robots`.

Dev API bearer token: `qss-dev-token`.

## Tests

```bash
npm test
npm run test:app-up
```

## Pages

`/` · `/robots` · `/terrains` · `/skills` · `/datasets` · `/transitions` · `/compare` · `/settings` · `/honesty`

## Offline demo

Open `try.html` in a browser for an approximate dual-score demo.

## Guide

`docs/guides/54-quad-skill-studio-lessons.md`
