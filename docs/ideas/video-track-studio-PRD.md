# PRD — Video Track Studio

## Problem
Video-LLM benches reward fluent answers on long episodes. Teams cannot tell whether a model tracked a named character or used shallow cues (gender, cast priors, option bias).

## Goals
1. Clip + character registry for long-form episodes
2. Track probes: name-swap / identity sensitivity diagnostics
3. Failure taxonomy (name-invariant, gender-cue, open-ended collapse, etc.)
4. Dual compare: track-aware score A vs fluency baseline B
5. Commercial surfaces: `/pricing` `/demo` `/onboarding` + honesty fence

## Non-goals
- Desk shell (`/jobs` `/lifecycle` `/scenario` `/batch` `/goldens`)
- Medical consult IA (Consult Bench) or tool-proof kernel IA (Attest Proof)
- Production Video-LLM hosting or certification that models “watch”
- Live payment checkout

## Users
- Eval lead — runs probes, compares A vs B, exports reports
- Multimodal PM — reads failure diagnoses and pricing tiers
- Method-lab operator — org settings, webhook, members

## Success metrics (method-lab)
- ≥11 pages including required commercial routes
- ≥20 user-visible features
- ≥30 dual goldens; build + app-up green
- Distinct IA a stranger would not confuse with Attest Proof
