# Architecture Research

**Domain:** FinOps commitment-coverage soft-sim (Commitment Coverage Studio)
**Researched:** 2026-08-07
**Confidence:** HIGH (lab depth pack + sibling Spend Cap) / MEDIUM (external FinOps coverage practices)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Presentation (Next.js App Router pages)                                  │
│  Marketing: / /pricing /demo /onboarding /flows /honesty                  │
│  Domain: /commitments /coverage /gaps /renewals /imports /compare         │
│          /scoreboard /settings                                            │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ fetch / forms
┌───────────────────────────────▼─────────────────────────────────────────┐
│  API boundary (app/api/*/route.ts) — bearer auth unless noted             │
│  Platform: health · features · goldens · org · members · webhooks · export│
│  Domain: accounts · commitments · imports · coverage · gaps · renewals    │
│          compares · scoreboard                                            │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────────┐
│  Application services (lib/services/*)                                    │
│  ImportOrchestrator · CoverageEngine · GapMaterializer · RenewalPacker    │
│  CompareService · ScoreboardRollup · AuditLogger · ExportService          │
└───────────┬─────────────────────────┬───────────────────────────────────┘
            │                         │
┌───────────▼───────────┐   ┌─────────▼───────────────────────────────────┐
│  Dual scorer harness  │   │  Aggregates / persistence (SQLite + store)    │
│  (pure TS, no I/O)    │   │  Org · Member · CloudAccount · Commitment     │
│  A commit-matched     │   │  UsageSlice · ImportBatch · CoverageSnapshot  │
│  B on-demand-blind    │   │  GapFinding · RenewalCase · CompareResult     │
│  goldens ≥30          │   │  AuditEntry · WebhookDelivery                 │
└───────────────────────┘   └─────────────────────────────────────────────┘

Soft-sim fence: no live CUR/billing write-back; fixtures + imported batches only.
Honesty page + API errors must say soft-sim / not system of record.
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Pages | Domain IA + commercial surfaces; no scoring math | `src/app/**/page.tsx` + shell components |
| Route handlers | Auth, validation, idempotency, JSON in/out | `src/app/api/**/route.ts` |
| ImportOrchestrator | Parse usage/billing batches → UsageSlice rows; tag multi-cloud | `lib/services/import.ts` |
| CoverageEngine | Windowed match Commitment ↔ UsageSlice → CoverageSnapshot | Calls scorer A; persists snapshot |
| GapMaterializer | Derive GapFinding (unused commit $ and/or on-demand spill $) | Post-coverage pure transform |
| RenewalPacker | Bind GapFinding(s) + renew-by → RenewalCase + recommended action | Domain rule + CRUD |
| CompareService | Run A + B on same fixture; persist CompareResult + $ delta | Dual scorer + store |
| Dual scorers | Pure A/B claim functions | `src/domain/scoring.ts` (+ optional independent twin per path) |
| Store | Org-scoped aggregates | SQLite via `better-sqlite3` / lab store pattern |
| Soft-sim fence | Copy + `/honesty` + refuse live billing SoR semantics | Page + claim.ts + README |

## Aggregates and Boundaries

**Confidence: HIGH** — locked by ERD + blueprint; FinOps practice confirms the inventory → usage → coverage → gap → renewal chain.

### Aggregate catalog

| Aggregate | Owns | Invariants | Does not own |
|-----------|------|------------|--------------|
| **Org** | Settings, seat tier hints, export defaults | Single org per soft-sim desk | Cloud credentials |
| **Member** | Email/role under Org | Bearer identity maps to Member | Scoring |
| **CloudAccount** | Provider tag (aws/gcp/azure), account key, display name | Unique (org, provider, accountKey) | Commit dollars math |
| **Commitment** | Type (SP/RI/CUD-like), term, rate $, lock window, CloudAccountId | Belongs to one CloudAccount; archive soft-deletes | Usage rows |
| **UsageSlice** | Window start/end, eligible spend $, family/service dims, CloudAccountId | Comes from ImportBatch; immutable after accept | Commitment matching policy |
| **ImportBatch** | Status, source kind, row counts, errors | Idempotent on client key when provided | Coverage compute |
| **CoverageSnapshot** | Window, account, coverage %, covered $, uncovered $, commit matched $ | Produced by CoverageEngine for a window; versioned by computedAt | Gap narrative |
| **GapFinding** | Kind (`unused_commit` \| `ondemand_spill` \| both), gap $, snapshot/account refs | Dollars are the primary UX unit | Renewal decision state |
| **RenewalCase** | renewBy, recommendedAction, status (open/acted/dismissed), linked gaps | One case per commitment (or lock window) approaching renew | Compare paths |
| **CompareResult** | mode `commit_vs_ondemand`, pathA, pathB, winner, deltaUsd | A and B share identical ScoreInput; delta is intentional | Live cloud API |
| **AuditEntry** | Who/what/when for mutations | Append-only | Business rules |
| **WebhookDelivery** | HMAC payload, delivery status | Idempotency-Key honored (409) | Domain scoring |

### Bounded contexts (keep separate)

1. **Inventory** — CloudAccount + Commitment CRUD / archive / search / multi-cloud tags
2. **Ingest** — ImportBatch + UsageSlice (reject coverage if usage missing → 422)
3. **Coverage math** — CoverageSnapshot + GapFinding (read models from scorers)
4. **Renewal workflow** — RenewalCase lifecycle (not a generic `/jobs` desk)
5. **Compare claim** — CompareResult + goldens harness (product differentiator)
6. **Platform** — Org / Members / Audits / Webhooks / Export / Features / Health

**Hard fence between contexts:** UI primary IA must stay domain nouns (`/commitments` `/coverage` `/gaps` `/renewals` `/imports` `/compare` `/scoreboard`). Forbidden as primary: `/jobs` `/lifecycle` `/scenario` `/batch` `/audit` `/goldens`.

**Multicloud rule:** normalize *tags and rollup dimensions* for scoreboard; keep *instrument type* provider-specific on Commitment (do not pretend SP ≡ CUD). Confidence: MEDIUM (FinOps multicloud practice).

## Dual Scorer Harness Placement

**Confidence: HIGH** — PRODUCT_STACK + Spend Cap sibling + product claim.

### Placement (do this)

```
src/domain/
  scoring.ts              # scoreCommitMatched (A), scoreOnDemandBlind (B), shared ScoreInput/Output
  scoring-independent.ts  # optional second coding of A/B for dual-impl discipline (lab pattern)
  types.ts                # CommitmentLike, UsageSliceLike, CoverageDollars, GapDollars
src/goldens.ts            # ≥30 fixtures: input + expected A + expected B + deltaUsd
test/goldens.test.ts      # asserts both paths; A ≠ B on under/over-cover cases
```

- Scorers are **pure TypeScript** — no Python sidecar (rule/math desk per PRODUCT_STACK).
- **A (commit-matched):** match inventory ↔ usage → coverage % and gap $ (unused commit + on-demand spill).
- **B (on-demand-blind):** ignore commitments; bill-as-you-go narrative only (no unused-commit gap; spill treated as full on-demand story).
- **Not twin-equivalence:** A and B *must diverge* on interesting fixtures. TwinTestHarness (A≡B) is the wrong pattern for this product claim. Confidence: MEDIUM (external twin harnesses) / HIGH (lab compare products).
- **CompareService** is the only write path that creates CompareResult; UI `/compare` and `POST /api/compares` call it.
- CoverageEngine uses **A only** for CoverageSnapshot / GapFinding; B appears on compare + scoreboard contrast, not as the renewal-pack source of truth.

### Score I/O sketch

```typescript
export type ScoreInput = {
  commitments: Array<{
    id: string;
    rateUsd: number;
    termMonths: number;
    lockStart: string;
    lockEnd: string;
    family?: string;
  }>;
  usage: Array<{
    windowStart: string;
    windowEnd: string;
    eligibleSpendUsd: number;
    family?: string;
  }>;
  window: { start: string; end: string };
};

export type ScoreOutput = {
  coveragePct: number;
  coveredUsd: number;
  unusedCommitUsd: number;
  onDemandSpillUsd: number;
  gapUsd: number; // primary buyer number
  rationale: string;
};
```

## API Surfaces

**Confidence: HIGH** — API-CONTRACT depth pack.

Bearer on `/api/*` unless noted. Soft-sim only.

### Platform

| Method | Path | Boundary |
|--------|------|----------|
| GET | `/api/health` | Public liveness |
| GET | `/api/features` | Feature inventory (≥25) |
| GET | `/api/goldens/sample` | Dual-path samples |
| GET/PATCH | `/api/org` | Org settings |
| GET/POST | `/api/members` | Members |
| POST | `/api/webhooks/test` | HMAC + Idempotency-Key |
| GET | `/api/export` | `kind=commitments\|gaps\|compares` |

### Domain

| Method | Path | Aggregate touch |
|--------|------|-----------------|
| GET/POST | `/api/accounts` | CloudAccount |
| GET/POST | `/api/commitments` | Commitment |
| GET/PATCH | `/api/commitments/:id` | Commitment update/archive |
| GET/POST | `/api/imports` | ImportBatch → UsageSlice |
| GET | `/api/imports/:id` | ImportBatch status |
| GET/POST | `/api/coverage` | CoverageSnapshot compute/list |
| GET | `/api/gaps` | GapFinding |
| GET/POST | `/api/renewals` | RenewalCase |
| PATCH | `/api/renewals/:id` | Action / dismiss |
| POST | `/api/compares` | `{ mode: "commit_vs_ondemand" }` → CompareResult |
| GET | `/api/compares/:id` | Winner + $ delta |
| GET | `/api/scoreboard` | Rollups by account / gap $ |

### Errors

`401` auth · `403` org · `409` idempotency · `422` validation (missing usage for coverage)

Handlers stay thin: auth → parse → service → `Response.json`. No scoring inside route files beyond calling domain functions (Spend Cap anti-pattern to avoid growing).

## Route Map (UI)

**Confidence: HIGH** — COMPREHENSIVE-BLUEPRINT.

| Route | Context | Primary aggregates |
|-------|---------|-------------------|
| `/` | Marketing | — (sell $ gap before renewal) |
| `/pricing` | Commercial | Org tiers |
| `/demo` | Commercial | Guided Import → match → gap → renewal |
| `/onboarding` | Commercial | Checklist |
| `/flows` | Commercial | ≥5 journeys |
| `/commitments` | Inventory | Commitment, CloudAccount |
| `/coverage` | Coverage | CoverageSnapshot |
| `/gaps` | Coverage | GapFinding |
| `/renewals` | Renewal | RenewalCase |
| `/imports` | Ingest | ImportBatch, UsageSlice |
| `/compare` | Compare claim | CompareResult |
| `/scoreboard` | Coverage rollup | Snapshots + gaps |
| `/settings` | Platform | Org, Member, WebhookDelivery, export |
| `/honesty` | Soft-sim fence | claim / Sources |

## Recommended Project Structure

```
projects/commitment-coverage-studio/
├── src/
│   ├── app/                      # App Router pages + api/*
│   │   ├── api/
│   │   │   ├── accounts/route.ts
│   │   │   ├── commitments/...
│   │   │   ├── imports/...
│   │   │   ├── coverage/route.ts
│   │   │   ├── gaps/route.ts
│   │   │   ├── renewals/...
│   │   │   ├── compares/...
│   │   │   ├── scoreboard/route.ts
│   │   │   ├── org/route.ts
│   │   │   ├── members/route.ts
│   │   │   ├── webhooks/test/route.ts
│   │   │   ├── export/route.ts
│   │   │   ├── features/route.ts
│   │   │   ├── goldens/sample/route.ts
│   │   │   └── health/route.ts
│   │   ├── commitments/page.tsx
│   │   ├── coverage/page.tsx
│   │   ├── gaps/page.tsx
│   │   ├── renewals/page.tsx
│   │   ├── imports/page.tsx
│   │   ├── compare/page.tsx
│   │   ├── scoreboard/page.tsx
│   │   ├── honesty/page.tsx
│   │   └── ...
│   ├── domain/                   # Pure scorers + types (no Next imports)
│   ├── services/                 # Orchestrators above
│   ├── store.ts / db/            # SQLite persistence
│   ├── goldens.ts
│   ├── claim.ts                  # Soft-sim fence copy constants
│   └── components/
├── test/
├── screenshots/
├── try.html
└── README.md
```

### Structure Rationale

- **`domain/`:** Keeps A/B claim unit-testable without HTTP or SQLite.
- **`services/`:** Owns aggregate transitions (import → snapshot → gap → renewal → compare).
- **`app/api/`:** Thin adapters matching API-CONTRACT; mirrors domain IA for discoverability.
- **No `python/`:** Coverage dollars are readable TS math; sidecar would dilute the dual-impl goldens story.

## Architectural Patterns

### Pattern 1: Dual-path compare (not twin-equivalence)

**What:** Same ScoreInput → A and B → CompareResult with intentional $ delta.
**When:** Product claim is “commit-matched beats on-demand-blind narrative for renewals.”
**Trade-offs:** Clear buyer story; must educate that goldens assert *divergence*, not parity.

### Pattern 2: Derived read models

**What:** GapFinding and CoverageSnapshot are computed artifacts; Commitments + UsageSlices are sources of truth.
**When:** Always for coverage desks.
**Trade-offs:** Recompute on POST `/api/coverage`; avoid editing gap $ by hand (audit if override ever added).

### Pattern 3: Soft-sim fence as first-class boundary

**What:** `/honesty`, claim constants, and API copy refuse billing SoR / live CUR write-back.
**When:** Every Method Lab soft-sim.
**Trade-offs:** Limits “connect AWS” fantasy features; protects biz-rubric software-solvable gate.

## Data Flow

### Key flows

1. **Import → coverage:** ImportBatch accepted → UsageSlices written → POST coverage → CoverageSnapshot + GapFindings (scorer A).
2. **Gap → renewal:** Open GapFinding near lock end → RenewalCase with recommended action → PATCH act/dismiss → AuditEntry.
3. **Compare:** POST compares with shared fixture → A + B → CompareResult (winner = lower waste / clearer gap explanation per product rules) → `/compare` + scoreboard contrast.
4. **Export:** GET export streams commitments | gaps | compares JSON/CSV for renewal pack.

```
UsageSlice + Commitment
        ↓
 scoreCommitMatched (A) ──→ CoverageSnapshot → GapFinding → RenewalCase
        ↓
 scoreOnDemandBlind (B) ──→ (compare only)
        ↓
   CompareResult(deltaUsd)
```

## Soft-Sim Fence

| Allowed | Forbidden |
|---------|-----------|
| Fixture / CSV / JSON import batches | Live provider billing write APIs as SoR |
| Synthetic multi-cloud tags | Claiming real RI purchase execution |
| Dollar gap soft-sim for renewals | Clinical / device / wet-lab / seat-waste noun-swap |
| Dual A/B goldens | Isomorphic `/jobs` desk shell |

Surface the fence on `/honesty`, landing Sources, README, and any “connect cloud” CTA copy (demo import, not production CUR sync).

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Lab soft-sim (default) | Single Next process + SQLite; in-memory OK early |
| Demo / multi-account fixtures | Index (orgId, accountId, window); paginate gaps |
| Hypothetical production | Out of scope for this studio; would need warehouse + FOCUS ingest |

### Scaling Priorities

1. **First bottleneck:** Naive O(commitments × slices) matching — keep windows bounded; index by family/account.
2. **Second bottleneck:** Recomputing all snapshots on every import — recompute dirty windows only.

## Anti-Patterns

### Anti-Pattern 1: Twin-equivalence goldens for A vs B

**What people do:** Assert A output equals B.
**Why it's wrong:** Erases the product claim.
**Do this instead:** Assert expected A, expected B, and non-zero delta on under/over-cover fixtures.

### Anti-Pattern 2: Isomorphic desk shell

**What people do:** Primary IA as `/jobs` `/lifecycle` `/scenario`.
**Why it's wrong:** Fails comprehensive bar and clone ban.
**Do this instead:** Domain nouns only; renewals are first-class.

### Anti-Pattern 3: Scoring inside React client or route bodies

**What people do:** Duplicate match math in page components.
**Why it's wrong:** Breaks goldens single source of truth.
**Do this instead:** Import `domain/scoring` from services/API only.

### Anti-Pattern 4: Live billing SoR creep

**What people do:** “Real AWS sync” without fence.
**Why it's wrong:** Leaves soft-sim lane; invites credentials/compliance scope.
**Do this instead:** Import batches + honesty fence.

### Anti-Pattern 5: Collapsing multicloud instruments

**What people do:** One “commitment %” summed across providers without per-instrument rows.
**Why it's wrong:** SP/RI/CUD mechanics differ; leadership totals lie.
**Do this instead:** Per-account instrument rows + portfolio rollup on scoreboard.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| None required (MVP) | Soft-sim fixtures | Optional HMAC webhook test endpoint only |
| Payment webhook | HMAC verify + Idempotency-Key | Provider-agnostic per PRODUCT_STACK |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Pages ↔ API | fetch JSON | Bearer header |
| API ↔ services | Direct function calls | Same process |
| Services ↔ domain scorers | Pure calls | No DB inside scorers |
| Services ↔ store | Repository functions | Org-scoped queries |
| Compare ↔ Coverage | Shared ScoreInput builder from aggregates | Coverage uses A; Compare runs A+B |

## Implications for Roadmap

1. **Foundation:** Org/Members/Audits + CloudAccount/Commitment CRUD + honesty fence
2. **Ingest + A scorer:** ImportBatch/UsageSlice + CoverageSnapshot/GapFinding + ≥30 goldens
3. **Renewal + Compare:** RenewalCase + CompareResult (B path) + scoreboard
4. **Commercial shell:** pricing/demo/onboarding/flows + webhooks/export + screenshots

Phase research flags: matching policy (family/window attribution) needs deeper phase research; SQLite schema and shadcn IA are standard.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Aggregates / boundaries | HIGH | ERD + blueprint + FinOps coverage chain |
| Dual scorer placement | HIGH | Lab PRODUCT_STACK + Spend Cap pattern |
| API surfaces | HIGH | API-CONTRACT |
| Soft-sim fence | HIGH | Lab protocols + PROJECT.md |
| Multicloud normalize vs instrument detail | MEDIUM | External FinOps practice |
| Exact match algorithm (family/hour/$) | LOW→phase | Defer to domain phase research |

## Sources

- Depth pack: `docs/ideas/commitment-coverage-studio-{ERD,API-CONTRACT,COMPREHENSIVE-BLUEPRINT,PHASE-BRIEFS}.md`
- Stack: `docs/PRODUCT_STACK.md`
- Sibling: `projects/spend-cap-studio/src/domain/scoring.ts`, `goldens.ts`, `app/api/compare/route.ts`
- Next.js Route Handlers: Context7 `/vercel/next.js` (App Router `route.ts` HTTP method exports) — confidence MEDIUM
- FinOps coverage practice: FinOps Foundation AWS commitment management; multicloud coverage rollup guidance — confidence MEDIUM
- Twin harness distinction: differential A≡B harnesses are *not* this product’s compare claim — confidence MEDIUM

---
*Architecture research for: Commitment Coverage Studio*
*Researched: 2026-08-07*
