# Paired Motion Studio

Soft-sim studio for paired HMD motion capture. Compare **distributed ego+exo fusion** against an **ego-only baseline** before locking a capture pack.

## Buyer outcome

Embodied AI / VR-AR / mocap analytics eng leads version capture packs, configure wearers and observers, run dual compares, and lock only when deltas and honesty are understood.

## Honesty

Method-lab soft-sim only:

- Not live HMD fleet control
- Not a production mocap suit replacement
- Not Meta / Aria deployment
- Not the EgoExoMoCap brand or authors’ system

Paper: [arXiv 2607.15868](https://arxiv.org/abs/2607.15868v1) · authors’ code: none published

## Stack

Next.js App Router · Tailwind · shadcn · in-memory store · bearer auth

## Scripts

```bash
npm install
npm test
npm run build
npm run test:app-up
npm run gen:goldens
```

## Routes

`/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/captures`, `/wearers`, `/observers`, `/sessions`, `/runs`, `/compare`, `/scoreboard`, `/settings`, `/honesty`

Offline demo: `try.html`
