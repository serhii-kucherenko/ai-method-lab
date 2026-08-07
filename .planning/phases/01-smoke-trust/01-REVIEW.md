---
phase: 01-smoke-trust
reviewed: 2026-08-07T07:49:00Z
depth: standard
advisory: true
files_reviewed: 12
files_reviewed_list:
  - projects/commitment-coverage-studio/src/app/page.tsx
  - projects/commitment-coverage-studio/src/app/layout.tsx
  - projects/commitment-coverage-studio/src/app/globals.css
  - projects/commitment-coverage-studio/src/app/honesty/page.tsx
  - projects/commitment-coverage-studio/src/app/commitments/page.tsx
  - projects/commitment-coverage-studio/src/app/demo/page.tsx
  - projects/commitment-coverage-studio/src/components/landing/below-fold.tsx
  - projects/commitment-coverage-studio/src/components/landing/section-heading.tsx
  - projects/commitment-coverage-studio/src/components/ui/button.tsx
  - projects/commitment-coverage-studio/src/lib/claim.ts
  - projects/commitment-coverage-studio/src/lib/utils.ts
  - projects/commitment-coverage-studio/next.config.ts
findings:
  critical: 0
  warning: 1
  info: 2
  total: 3
status: issues_found
warning_wr01_fixed: true
---

# Phase 01: Code Review Report

**Reviewed:** 2026-08-07T07:49:00Z
**Depth:** standard (advisory)
**Files Reviewed:** 12
**Status:** issues_found (non-blocking) — WR-01 fixed in follow-up

## Summary

Static marketing surface under `projects/commitment-coverage-studio/`: brand landing, honesty fence, CTA placeholders, DESIGN tokens. No API routes, no user input, no secrets, no XSS sinks. Safe to proceed; one a11y motion warning and two maintainability notes.

## Warnings

### WR-01: Hero animation ignores reduced-motion preference

**File:** `projects/commitment-coverage-studio/src/app/globals.css:111-124`
**Issue:** `.brand-fade` always runs a translate/opacity animation. Users with `prefers-reduced-motion: reduce` still get motion (vestibular risk; WCAG 2.3.3).
**Fix applied:** Animation gated behind `@media (prefers-reduced-motion: no-preference)`.
## Info

### IN-01: Brand `--color-accent` shadows shadcn soft accent

**File:** `projects/commitment-coverage-studio/src/app/globals.css:10` and `:47-48` / `:25-26`
**Issue:** `:root --color-accent` is brand teal while `--accent` is the soft surface. `@theme inline` maps Tailwind `accent` to brand teal, so later shadcn `bg-accent` / `text-accent-foreground` may not match expected soft-accent patterns.
**Fix:** When interactive chrome lands, either map `--color-accent` utilities to a distinct name (`--color-brand`) or document that `accent` means brand teal in this product.

### IN-02: Sources cite private filenames only

**File:** `projects/commitment-coverage-studio/src/lib/claim.ts:51-52` and `:59-60`
**Issue:** Copy references `commitment-coverage-studio-ARS-BRIEF.md` / related works JSON with no public URL. Fine for soft-sim honesty; not verifiable from the UI.
**Fix:** Later commercial/sources work can link to a public brief or drop the filename if it stays private.

---

_Reviewed: 2026-08-07T07:49:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard (advisory)_
