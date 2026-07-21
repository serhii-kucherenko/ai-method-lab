# lesserof — paper product acceptance (pre-build)

**Not a green light.** Activate only after `htsroute` clears **and** depositgap is not ahead in `ACTIVATION_QUEUE.md` (or depositgap parks/kills).

Tied to: `lesserof-G6-summary.md`, `lesserof-NARROW-CLAIM.md`, `lesserof-algorithm.md`.

---

## A. Must-pass unique-claim scenarios

Load all `docs/ideas/fixtures/lesserof-*.json`. At minimum:

| Scenario | Expect |
|----------|--------|
| Substitution lesser-of binds (A) | refund = 99% of min(paid, substitute) |
| Direct-ID no lesser-of (B) | refund = 99% of paid |
| USMCA partner duty-free (C) | recoverable **0** |
| Basket other reject (D) | reject |
| USMCA mid-cap (M) | partner binds between 0 and TFTEA |

## B. Must-reject cheats

1. Force lesser-of on direct-ID (H)  
2. Skip lesser-of on substitution (I)  
3. Relabel substitution as direct-ID (K)  
4. USMCA without partner duty (Q)  
5. USMCA flag on direct-ID (V)  
6. Dual-approver / “99% always” costumes as domain  

## C. Money-honesty / Kill A

Acceptance **fails** if digests claim ACE drawback filing replacement or present fixture counts as market proof. Required line: workflow / stacked-cap math experiment; specialists still file.

## D. Comprehensive bar

`lesserof-COMPREHENSIVE-BLUEPRINT.md` + `docs/COMPREHENSIVE_PRODUCT.md`. Smoke-as-sustain fails.

## E. Dual-impl

`check-lesserof-fixtures.mjs` + `check-lesserof-dual.mjs` green in CI.

## Explicit non-action

No `projects/lesserof/` today.
