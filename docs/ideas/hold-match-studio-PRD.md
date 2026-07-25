# PRD — Hold Match Studio

## Problem
Ride-hail matching often locks the first feasible driver–order pair. Hold control can wait for better experience outcomes, but ops teams lack a studio to model hold tiers, passenger/driver lanes, and first-feasible baselines before shipping heuristic thresholds.

## Goals
1. Hold decision board for driver–order candidates
2. Experience lanes: passenger cancel/wait risk and driver idle/cancel cost
3. Match timeline workspace (hold → release → accept → complete)
4. Dual compare: experience-aware hold score A vs first-feasible baseline B
5. Commercial surfaces: `/pricing` `/demo` `/onboarding` + honesty fence

## Non-goals
- Desk shell (`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens`)
- Video Track clips/probes IA or Attest Proof claims/kernel IA
- Branding as EXHOLD or DiDi production control
- Live payment checkout or live marketplace dispatch

## Users
- Marketplace ops lead — runs holds, compares A vs B, exports reports
- Matching PM — reads experience lanes and pricing tiers
- Method-lab operator — org settings, webhook, members

## Success metrics (method-lab)
- ≥11 pages including required commercial routes
- ≥20 user-visible features
- ≥30 dual goldens; build + app-up green
- Distinct IA a stranger would not confuse with Video Track or Attest Proof
