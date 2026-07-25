# Track Map Studio — what we learned

## Product
Soft-sim bench for surgical robotics / intraoperative vision leads comparing **online deformable SLAM** (`online_deformable_slam`) against an **offline kinematics-prior baseline** (`offline_kinematics_prior_baseline`) before locking a track pack.

Paper: https://arxiv.org/abs/2607.08408v1 · authors’ code: none published.

## Category practices shipped
- Eval / industrial soft-sim: dual A/B, goldens (≥30 `tm-*`), scoreboard, versioned packs
- Platform must-haves: bearer auth, org/members, audit, export JSON/CSV, webhook HMAC, rate limit, pagination, search
- Commercial surfaces: `/`, `/pricing`, `/demo`, `/onboarding`, `/flows` (≥5 named journeys), `/honesty`

## Domain IA (anti-clone)
Tracks · poses · reconstructions · runs · compare — **not** `/jobs`, `/lifecycle`, `/scenario` desk shells. Not Track2Map brand.

## Honesty
Soft-sim only. Never claim live robot control, clinical diagnostic use, or FDA clearance.

## Lessons
1. Domain nouns force distinct UX more effectively than renaming a prior desk.
2. Offline kinematics optimism is a useful “bad path” fuel for baseline B.
3. Tutor guide + try.html + live app-up smoke are required before sustain email.
