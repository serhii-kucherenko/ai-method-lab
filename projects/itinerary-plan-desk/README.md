# Itinerary Plan Desk

Feasible itinerary planning with preference ranking and feasibility-preserving adapt — inspired by paper 2607.15552.

- **Id:** 2607.15552
- **Title:** Plan, Learn, Adapt: On-Device Itinerary Generation
- **URL:** https://arxiv.org/abs/2607.15552v1
- **Code:** https://github.com/Official529Tech/pla-itinerary

## Claim

Feasibility-first day schedules versus a naive preference-only baseline — desk experiment, not the authors’ on-device itinerary system. Never brand as FlyEnJoy or PLA.

## Stack

Next.js App Router + TypeScript + Tailwind + shadcn/ui. Design: `docs/ideas/itinerary-plan-desk-DESIGN.md`. Marketing landing at `/`.

## Run

```bash
cd projects/itinerary-plan-desk
npm install
npm test
npm run start:api   # static harness + API
npm run dev         # Next UI
```

Offline sketch: open `try.html` in a browser.

Honesty: method experiment; not FlyEnJoy / PLA branding as the product name.
