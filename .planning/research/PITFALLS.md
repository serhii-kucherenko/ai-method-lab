# Pitfalls Research

**Domain:** FinOps commitment-coverage soft-sim (Commitment Coverage Studio)
**Researched:** 2026-08-06
**Confidence:** HIGH (lab process / clone fences); MEDIUM (FinOps metric math from public FinOps practice)

## Critical Pitfalls

### Pitfall 1: Isomorphic Idle Seat / True Up / desk clone

**What goes wrong:**
Ship a noun-swapped waste desk: same `/compare` + `/scoreboard` + dual-impl shell as Idle Seat (seats/waste/reclaim) or True Up (meters/contracts/trueups), or worse, revive forbidden primary IA (`/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens`). Buyer cannot tell this from prior portfolio rows; biz-rubric hard-fail #1 and #4 fire; kill rounds 1–2 apply.

**Why it happens:**
FinOps “show me wasted $” siblings share commercial scaffolding. Agents copy page maps and rename entities (`Seat` → `Commitment`) without commit-native verbs, lock windows, or renewal cases.

**How to avoid:**
Lock primary IA to blueprint routes only: `/commitments` `/coverage` `/gaps` `/renewals` `/imports` (+ `/compare` `/scoreboard` as secondary). Domain objects must be Commitment / UsageSlice / CoverageSnapshot / GapFinding / RenewalCase — not seats, meters, or generic jobs. Diff nav against `idle-seat-studio` and `true-up-studio` before code freeze; refuse find-replace.

**Warning signs:**
Nav labels map 1:1 to sibling studios; landing copy could swap product name and still read true; ERD has `Job`/`Scenario` aggregates; primary CTA lands on `/jobs`.

**Phase to address:**
IA + aggregates phase (before feature theater). **Deeper research flag:** side-by-side IA diff vs Idle Seat / True Up before first `projects/` commit.

**Confidence:** HIGH — PM-GO fence, KILL-ROUNDS #2, COMPREHENSIVE_PRODUCT isomorphic ban, PROJECT.md out-of-scope.

---

### Pitfall 2: Dual-score emptiness (A ≈ B theater)

**What goes wrong:**
`/compare` and ≥30 goldens exist, but path A (commit-matched coverage → gap $) and path B (on-demand-blind) return the same dollars or differ only by a cosmetic constant. Claim collapses to “chart museum”; product fails unique dual claim and eval-category best practice.

**Why it happens:**
Scaffolding dual-impl first, then stuffing the same gap formula into both scorers; goldens assert shape, not divergent outcomes; no fixture where unused commit $ and on-demand spill $ disagree with B’s ignore-commit narrative.

**How to avoid:**
Define A and B formulas in PRD/blueprint before code. Goldens must include cases where: (1) high unused commit → A shows waste $, B does not; (2) under-coverage spill → A shows on-demand $, B’s “all on-demand” total differs in attribution; (3) full coverage / zero waste → A≈B. Scoreboard ranks by gap $, not “tests passed.”

**Warning signs:**
Goldens are pass-count only; compare panel never shows two different $ columns for the same fixture; scorer B is `return A()` or `A * 1.0`.

**Phase to address:**
Dual scorers + goldens phase (roadmap item 2). **Deeper research flag:** falsifiable A/B math and golden fixtures before UI chrome.

**Confidence:** HIGH — PROJECT.md dual claim; COMPREHENSIVE_PRODUCT dual-compare / goldens bar; blueprint dual score table.

---

### Pitfall 3: Missing or stub commercial / onboarding surfaces

**What goes wrong:**
Domain pages look rich while `/pricing`, `/demo`, `/onboarding`, `/flows` are empty stubs or missing. Sustain fails comprehensive bar; finish email must not fire.

**Why it happens:**
Agents prioritize claim math and treat commercial pages as “footer later.” One demo path is mistaken for ≥5 flows.

**How to avoid:**
Ship real tiers on `/pricing` (seats + connected-account usage), numbered `/demo` happy path (import → match → gap → renewal pack), checklist `/onboarding`, and `/flows` index with ≥5 named journeys (actors, jobs, success, empty/error). Count toward ≥25 features and ≥11 pages from day one of page map.

**Warning signs:**
Routes exist but copy is placeholder; `/flows` lists one journey; pricing has no tiers; onboarding has no progress state.

**Phase to address:**
Commercial surfaces phase (roadmap item 4) — schedule in parallel with domain IA, not after smoke. **Deeper research flag:** unlikely; bar is explicit in docs.

**Confidence:** HIGH — COMPREHENSIVE_PRODUCT hard minimums and explicit fails.

---

### Pitfall 4: Screenshot / README finish-gate skip

**What goes wrong:**
Sustain with green build/tests but README lacks live platform PNGs under `projects/commitment-coverage-studio/screenshots/` (landing, primary workspace, pricing, demo, onboarding/flows). Or images are mocks / `try.html` only. Lab product-readme rule fails.

**Why it happens:**
Screenshot capture feels optional after app-up smoke; agents confuse offline try artifact with platform proof.

**How to avoid:**
Before finish: `node scripts/capture-product-screenshots.mjs projects/commitment-coverage-studio --start`, embed relative paths in README Screenshots section, verify five required viewports of the running app.

**Warning signs:**
Empty `screenshots/`; README has no image embeds; only `try.html` screenshots; images show wrong product brand.

**Phase to address:**
Sustain / finish gate (roadmap item 5). **Deeper research flag:** none — mechanical gate.

**Confidence:** HIGH — COMPREHENSIVE_PRODUCT + workspace product-readme-screenshots rule.

---

### Pitfall 5: Soft-sim honesty collapse

**What goes wrong:**
Copy or UX implies live AWS/GCP/Azure write-back, real RI/SP purchase, or replacement of CFO renewal ownership. Kill round 3 (offline finance politics) and soft-sim honesty fail; buyer distrust + rubric evidence/feasibility hit.

**Why it happens:**
Marketing overclaims; missing `/honesty`; Sources footer omitted from finish digests; “renewal pack” framed as auto-executing commits.

**How to avoid:**
Fence everywhere: soft-sim decision aid + evidence pack for the renewal meeting; no live billing console; no claim to replace finance ownership. Ship `/honesty` + Sources; landing sells dollar gap narrative honestly.

**Warning signs:**
CTAs like “Buy Savings Plan”; OAuth to cloud billing without soft-sim disclaimer; finish email without money honesty / soft-sim fence.

**Phase to address:**
Landing + honesty in first UI phase; re-verify at sustain. **Deeper research flag:** none for fence; phase research if live connector demos are ever proposed (out of scope for MVP).

**Confidence:** HIGH — KILL-ROUNDS #3, VISION refuse list, Idle Seat honesty pattern as sibling precedent.

---

### Pitfall 6: Coverage vs utilization conflation (domain math)

**What goes wrong:**
UI and scorers treat “coverage %” and “utilization %” as one metric. Product cannot explain under-coverage (on-demand spill) vs unused commit (overcommit waste) in dollars — the core buyer outcome dies.

**Why it happens:**
Cost Explorer skins often chart one utilization number; agents copy that mental model. Soft-sim goldens assert a single ratio.

**How to avoid:**
Model both explicitly: coverage = share of eligible usage discounted by commitments; utilization = share of committed spend/capacity actually used. GapFinding must support unused commit $ **and** on-demand spill $. RenewalCase actions differ (expand vs shrink/ladder). Educate in `/coverage` and `/gaps` copy.

**Warning signs:**
One progress bar labeled both ways; gaps list only “low coverage”; ERD lacks unused-commit field; A/B fixtures never separate the two failure modes.

**Phase to address:**
Dual scorers + domain IA (coverage/gaps). **Deeper research flag:** YES — phase research on multi-cloud SP/RI/CUD matching rules and dollarization before locking formulas.

**Confidence:** MEDIUM — cross-checked FinOps practice (coverage vs utilization as independent levers); lab ERD already names both gap types.

---

### Pitfall 7: Single-cloud Cost Explorer noun-swap

**What goes wrong:**
Product only mirrors one provider’s commitment charts. Kill round 1 fires; wedge (multi-cloud + renewal workflow) evaporates; score collapses toward commodity.

**Why it happens:**
Easiest path is AWS SP/RI vocabulary only; multi-cloud tags are decorative enums with no rollup.

**How to avoid:**
Require CloudAccount provider tags (AWS/GCP/Azure-like), import batches that accept multi-cloud fixtures, and renewal packs that roll up cross-cloud gap $. Fence in landing: not a Cost Explorer skin.

**Warning signs:**
Only one provider in seed data; imports reject non-AWS shapes; marketing speaks only “Savings Plans.”

**Phase to address:**
Imports + multi-cloud rollup flow. **Deeper research flag:** YES — normalized commitment/usage schema across providers (phase research).

**Confidence:** HIGH for kill condition (lab docs); MEDIUM for schema details (needs phase research).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Reuse Idle Seat page shell + rename | Fast scaffold | Instant isomorphic fail / GC kill | Never |
| Single scorer with “baseline = 0” | Ships compare UI | Dual-claim empty | Never for sustain |
| Stub `/pricing` `/demo` `/onboarding` | Hits route count | Comprehensive bar fail | Never past smoke |
| Skip README screenshots | Faster finish email | Hard sustain fail | Never |
| SQLite + fixture CSV only | Honest soft-sim | Fine at lab scale | Always OK if honesty fence holds |
| Defer webhook HMAC / org members | Faster domain pages | Platform must-haves incomplete | Only if scheduled before sustain |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Cloud billing APIs | Imply live CE/CUD sync as product core | Soft-sim import batches + fixtures; honesty fence |
| Payment webhook | Skip HMAC “for demo” | Provider-agnostic HMAC per PRODUCT_STACK |
| Screenshot script | Capture offline try.html | `capture-product-screenshots.mjs` against live app |
| Goldens API | Assert HTTP 200 only | Assert A/B $ divergence on fixtures |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Recompute all CoverageSnapshots on every page load | Slow `/coverage` `/gaps` | Persist snapshots per import window | Soft-sim: hundreds of accounts × daily slices |
| Unbounded usage slice import | Memory spike / hang | Cap batch size + pagination | Large CSV fixtures in demo |
| Scoreboard full table scan | Laggy leaderboard | Index by gap $ / window | Soft-sim: rare; keep simple indexes |

Lab soft-sim scale stays modest — do not over-engineer for 1M users; do prevent N² recompute on import.

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Bearer auth optional on mutate routes | Cross-tenant fixture overwrite in multi-org soft-sim | Auth on write APIs; org scoping |
| Webhook without HMAC verify | Spoofed inbound events | HMAC required |
| Export dumps all orgs | Data bleed between demo tenants | Org-scoped export |
| Honesty page absent while “connect cloud” CTA present | Misrepresentation | Ship `/honesty`; soft-sim copy on connectors |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Chart museum without $ gap | FinOps cannot act in renewal meeting | Lead with gap $ and recommended action |
| Seat/license vocabulary leak | Feels like Idle Seat / True Up | Commit / coverage / lock window / renew-by |
| One happy path only | Fails ≥5 flows; stranger stuck | `/flows` with import, rollup, renew pack, compare, export |
| Claiming to auto-renew | Breaks trust / kill round 3 | Evidence pack for humans |
| Hiding under-cover vs unused | Wrong renewal decision | Separate findings + actions on `/gaps` `/renewals` |

## "Looks Done But Isn't" Checklist

- [ ] **Isomorphic clone:** Nav and aggregates are commit-native — verify side-by-side ≠ Idle Seat / True Up / desk shells
- [ ] **Dual score:** Same fixture yields materially different A vs B $ — verify ≥30 goldens include divergence cases
- [ ] **Commercial pages:** `/pricing` has tiers, `/demo` has steps, `/onboarding` has progress, `/flows` has ≥5 journeys — verify not stubs
- [ ] **Screenshots:** README embeds five live PNGs from `screenshots/` — verify capture script, not mocks
- [ ] **Honesty:** `/honesty` + soft-sim fence on landing — verify no live-purchase claim
- [ ] **Coverage ≠ utilization:** Gaps show unused commit $ and on-demand spill $ separately — verify ERD fields + UI
- [ ] **Multi-cloud:** Seed/import includes ≥2 provider tags and rollup renew pack — verify not AWS-only
- [ ] **Live app:** `next build` + app-up smoke on `/` with display name — verify before finish email
- [ ] **Platform must-haves:** Org/members, audit, export, webhook — verify FinOps/cost category practices shipped
- [ ] **Feature count:** ≥25 real capabilities, CRUD capped — verify against blueprint matrix

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Isomorphic clone detected | HIGH | Stop feature add; rewrite IA/ERD to commit-native; delete desk routes; re-diff siblings |
| Dual-score emptiness | MEDIUM | Rewrite B formula; add divergence goldens; fix compare UI columns |
| Stub commercial pages | MEDIUM | Fill tiers/steps/checklist/flows before more domain chrome |
| Missing screenshots | LOW | Run capture script; embed; re-check README |
| Honesty overclaim | LOW–MEDIUM | Rewrite copy; add `/honesty`; strip live-purchase CTAs |
| Coverage/utilization conflation | HIGH | Remodel GapFinding; regenerate goldens; update `/coverage` `/gaps` |
| Single-cloud only | MEDIUM | Extend schema + fixtures; add multi-cloud rollup flow |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification | Deeper research? |
|---------|------------------|--------------|------------------|
| Isomorphic clone | Domain IA + aggregates (before code clone) | Nav/ERD diff vs Idle Seat / True Up; no forbidden routes | YES — IA uniqueness review |
| Dual-score emptiness | Dual scorers + ≥30 goldens | Fixture matrix with A≠B $ | YES — formula falsifiability |
| Stub commercial pages | Commercial surfaces (parallel to IA) | Page content audit vs COMPREHENSIVE_PRODUCT | No |
| Screenshot/README gate | Sustain / finish | Capture script + README embeds | No |
| Soft-sim honesty | Landing + honesty early; recheck sustain | `/honesty` + copy audit | No (unless live connectors) |
| Coverage vs utilization | Scorers + `/coverage` `/gaps` | Dual gap types in UI + goldens | YES — multi-cloud dollarization |
| Single-cloud CE mirror | Imports + renew rollup flow | Multi-provider fixtures + kill-round check | YES — normalized import schema |
| Platform must-haves thin | Settings / org / webhook phase | Category checklist (cost/infra) | No |
| <5 flows | `/flows` phase | Five journeys with actor/job/success/failure | No |

## Sources

- Lab first-party (HIGH): `.planning/PROJECT.md`, `docs/ideas/commitment-coverage-studio-KILL-ROUNDS.md`, `docs/ideas/commitment-coverage-studio-PM-GO.md`, `docs/ideas/commitment-coverage-studio-VISION.md`, `docs/ideas/commitment-coverage-studio-COMPREHENSIVE-BLUEPRINT.md`, `docs/ideas/commitment-coverage-studio-ERD.md`, `docs/COMPREHENSIVE_PRODUCT.md`, `docs/BUSINESS_RUBRIC.md` (biz-rubric-v2 hard fails)
- Sibling precedents (HIGH for clone risk): `projects/idle-seat-studio` (seats/waste/reclaim + honesty), `projects/true-up-studio` (meters/contracts/trueups)
- FinOps practice (MEDIUM): coverage vs utilization as independent metrics; undercommit vs overcommit; laddering renewals — e.g. cloud commitment management guides and Savings Plans coverage/utilization target analyses (public FinOps vendor explainers; not treated as product requirements)

---
*Pitfalls research for: Commitment Coverage Studio (FinOps commitment-coverage soft-sim)*
*Researched: 2026-08-06*
*Mode: ecosystem pitfalls dimension*
