---
phase: 01-smoke-trust
verified: 2026-08-07T07:48:06.330Z
status: passed
score: 5/5 must-haves verified
behavior_unverified: 0
overrides_applied: 0
re_verification: false
---

# Phase 1: Smoke & trust Verification Report

**Phase Goal:** Strangers see a brand-first soft-sim that sells dollar coverage gap before renewal, with an explicit honesty fence
**Verified:** 2026-08-07T07:48:06.330Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
| --- | ------- | ---------- | -------------- |
| 1 | Visitor opens `/` and sees Commitment Coverage Studio as the hero brand selling dollar gap before renewal (not a generic lab desk) | ✓ VERIFIED | `page.tsx` renders `DISPLAY_NAME` as hero (`text-4xl`–`6xl` Fraunces); `LANDING_HEADLINE` = "See commitment waste in dollars before renewal"; cool `ledger-field` atmosphere; smoke-mkt "landing copy" + "no invented numeric KPI strip" pass |
| 2 | Visitor opens `/honesty` and reads soft-sim fence (not billing SOR; not Idle Seat / True Up) with Sources | ✓ VERIFIED | `honesty/page.tsx` + `claim.ts`: `HONESTY_SOFT_SIM` (soft-sim / not billing SOR), `HONESTY_NOT_SIBLINGS` (Idle Seat / True Up), Sources section; smoke-mkt honesty assertion pass |
| 3 | Visible UI uses DESIGN tokens (Fraunces / Source Sans 3 / teal covered / rust gap) without isomorphic desk chrome | ✓ VERIFIED | `layout.tsx` loads Fraunces / Source_Sans_3 / IBM_Plex_Mono; `globals.css` maps `--color-accent` `#0d9488` teal, `--color-gap` `#b4533a` rust; DESIGN.md SoT; smoke-mkt tokens + fonts + anti-desk (`/jobs` `/lifecycle` `/scenario` `/batch`) pass |
| 4 | Primary CTA targets `/commitments` and secondary targets `/demo` | ✓ VERIFIED | Hero Buttons link those paths; placeholder pages exist; smoke-mkt CTA placeholder assertion pass |
| 5 | Landing below-fold sections sell the outcome without invented metrics and link to honesty | ✓ VERIFIED | `BelowFold` ships Problem → Product → Selling points → Features → How it works → Pricing tease → Honesty → Sources → Footer; `href="/honesty"` in tease + footer; smoke-mkt below-fold + hero KPI checks pass |

**Score:** 5/5 truths verified (0 present, behavior-unverified)

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | ----------- | ------ | ------- |
| `projects/commitment-coverage-studio/DESIGN.md` | Product design token SoT (Fraunces, teal/gap) | ✓ VERIFIED | Exists; names Fraunces / Source Sans 3; `--color-ink/paper/accent/gap` |
| `projects/commitment-coverage-studio/src/app/page.tsx` | Brand-first landing route | ✓ VERIFIED | Hero brand + headline + CTAs; imports `BelowFold` |
| `projects/commitment-coverage-studio/src/app/globals.css` | CSS design tokens (`--color-ink`) | ✓ VERIFIED | Token block + shadcn theme map + ledger-field |
| `projects/commitment-coverage-studio/src/app/honesty/page.tsx` | Honesty fence route (`soft-sim`) | ✓ VERIFIED | Soft-sim fence + siblings + Sources; imports claim |
| `projects/commitment-coverage-studio/src/app/page.tsx` (full landing) | Full landing composition (`Sources`) | ✓ VERIFIED | Sources via `BelowFold` / claim constants |
| `projects/commitment-coverage-studio/test/smoke-mkt.test.ts` | Automated marketing smoke | ✓ VERIFIED | 8 tests, all passing (re-run 2026-08-07) |
| `projects/commitment-coverage-studio/src/lib/claim.ts` | Shared copy constants | ✓ VERIFIED | Display name, headline, honesty, sources |
| `projects/commitment-coverage-studio/src/components/ui/button.tsx` | shadcn Button for CTAs | ✓ VERIFIED | Present; landing/honesty use `Button asChild` |
| `projects/commitment-coverage-studio/src/app/commitments/page.tsx` | CTA placeholder | ✓ VERIFIED | Honest later-phase stub; home link |
| `projects/commitment-coverage-studio/src/app/demo/page.tsx` | CTA placeholder | ✓ VERIFIED | Honest later-phase stub; home link |
| `projects/commitment-coverage-studio/src/components/landing/below-fold.tsx` | Below-fold story | ✓ VERIFIED | Wired from `page.tsx`; honesty links |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | --- | --- | ------ | ------- |
| `src/app/layout.tsx` | `src/app/globals.css` | fonts + globals import | ✓ WIRED | `import "./globals.css"`; next/font variables on `<html>` |
| `src/app/page.tsx` | `src/lib/claim.ts` | DISPLAY_NAME / headline / tagline | ✓ WIRED | `from "@/lib/claim"` |
| `src/app/page.tsx` | `src/app/honesty/page.tsx` | nav/footer Link `/honesty` | ✓ WIRED | Pattern lives in `below-fold.tsx` (imported by page); tease + footer `href="/honesty"` |
| `src/app/honesty/page.tsx` | `src/lib/claim.ts` | shared honesty + sources copy | ✓ WIRED | `from "@/lib/claim"` for fence strings |

Note: `gsd-tools query verify.artifacts` / `verify.key-links` could not parse PLAN YAML `must_haves` lists (parser warning); links verified manually against plan frontmatter.

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| `page.tsx` | `DISPLAY_NAME`, `LANDING_HEADLINE`, `LANDING_SUPPORT` | `claim.ts` string constants | Yes — locked marketing copy | ✓ FLOWING |
| `honesty/page.tsx` | `HONESTY_*`, `SOURCES_HEADING` | `claim.ts` | Yes — fence + sources prose | ✓ FLOWING |
| `below-fold.tsx` | section headings/bodies | `claim.ts` arrays/strings | Yes — no empty arrays at call site | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Marketing smoke suite (tokens, brand, honesty, anti-desk, CTAs) | `npx tsx --test test/smoke-mkt.test.ts` | 8/8 pass | ✓ PASS |
| shadcn Button present | `Test-Path src/components/ui/button.tsx` | BUTTON_OK | ✓ PASS |

Step 7b: Did not re-run full `npm run build` (SUMMARY claims prior green; smoke + file evidence sufficient for this phase). No server started.

### Probe Execution

| Probe | Command | Result | Status |
| ----- | ------- | ------ | ------ |
| — | — | No phase-declared or conventional `probe-*.sh` | SKIPPED |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ---------- | ----------- | ------ | -------- |
| MKT-01 | 01-01, 01-02 | Stranger landing `/` sells dollar coverage gap before renewal with brand-first hero | ✓ SATISFIED | Truths 1, 4, 5; `page.tsx` + claim + smoke |
| MKT-02 | 01-02 | `/honesty` soft-sim fence (not billing SOR; not Idle Seat / True Up) with Sources | ✓ SATISFIED | Truth 2; honesty page + claim + smoke |
| MKT-03 | 01-01, 01-02 | DESIGN tokens applied (no isomorphic desk chrome) | ✓ SATISFIED | Truth 3; DESIGN/globals/layout + anti-desk smoke |

No orphaned Phase 1 requirement IDs: REQUIREMENTS.md maps only MKT-01/02/03 to Phase 1; both plans claim them. UI-03 (desk IA at domain routes) is Phase 3 — not orphaned for this phase.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| — | — | No TBD/FIXME/XXX in phase marketing sources | — | — |
| `commitments/page.tsx`, `demo/page.tsx` | — | Intentional CTA placeholders ("lands in a later phase") | ℹ️ Info | Expected for Phase 1; domain bodies are Phases 2–4 |

### Human Verification Required

None. PLAN tasks used automated `<verify>` only (no harvested `<human-check>` blocks). Content and IA contracts are covered by passing smoke-mkt file assertions.

### Gaps Summary

No gaps. Phase 1 roadmap success criteria 1–3 and plan must-have truths hold in `projects/commitment-coverage-studio/`.

---

_Verified: 2026-08-07T07:48:06.330Z_
_Verifier: Claude (gsd-verifier)_
