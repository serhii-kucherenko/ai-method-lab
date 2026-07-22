# Research summary — lesserof (G6)

Skeptical senior-eng bar. **Active research idea** after depositgap sustained (2026-07-22). Not `ready_to_build` yet.

## 1. Problem

Export manufacturers forecast drawback refunds as “99% of duty paid.” For **substitution** claims, TFTEA **lesser-of** and (when exporting to Canada/Mexico) **USMCA** export lesser-of can cut recoverable duty — sometimes to **zero**. Basket “other” HTS lines are **ineligible** without a matching non-other 10-digit. Finance invents cash that never comes.

## 2. Why prior lab products don’t cover it

`htsroute` is form/mixing routing. `depositgap` is AD/CVD deposit vs assessed + interest. `tariffstep` is utility blocks. Dual-gate capacity timers are isomorphic clones. None encode **stacked refund caps + direct-ID exemption + basket reject**.

## 3. Unique claim + invariants

- Substitution: recoverable from min(duties paid, substitute basis), then optional USMCA partner cap  
- Direct-ID: **no** TFTEA lesser-of (99% of paid)  
- Reject: lesser-of on direct-ID; skip lesser-of on substitution; USMCA flag without partner; USMCA on direct-ID; basket other without match; claim-type relabel  
- Multi-line: independent caps; one reject fails the run  
- USMCA wipe: partner duty-free can drive recoverable to **$0** after TFTEA (`lesserof-USMCA-WIPE-FENCE.md`)
- Same-condition unused (§ 182.45(b)): **separate carve-out**, v0 out of scope (`lesserof-SAME-CONDITION-FENCE.md`) — digests must not say every CA/MX export wipes

## 4. Kill rounds

| Kill | Outcome |
|------|---------|
| A — incumbents | **Stands commercially.** Drawback specialists / ACE filers win. Survive as **workflow experiment** proving stacked-cap math. |
| B — niche | Soft survive — exporting manufacturers with substitution programs. |
| C — offline | Survive — rulings/BOM audits stay offline; software holds calc + eligibility. |

## 5. Falsifiers

1. Domain experts say stacked USMCA + TFTEA on one line is wrong in ≥2 real claims → abandon.  
2. After smoke, finance still forecasts a single “99% of paid” cell for substitution → abandon.  
3. Basket “other” reject contradicts CBP practice → abandon.  
4. Product collapses to dual-approver refund board → kill as isomorphic.

## 6. Depth test outline

- G5: `lesserof-G5-cases.md` — **25** fixtures A–Y; dual-impl green  
- Narrow claim: `lesserof-NARROW-CLAIM.md`  
- CFR cites: `lesserof-CFR-CITATIONS.md`  
- Digest honesty: `lesserof-DIGEST-COPY.md`  
- Blueprint: `lesserof-COMPREHENSIVE-BLUEPRINT.md`  
- Architect pack: `lesserof-VISION.md`, `lesserof-ROADMAP.md`, `lesserof-PRD.md`, `lesserof-ERD.md` (**on file**, paper only)

## 7. Decision

**`ready_to_build` — flipped 2026-07-22** after hours clear + `FLIP_PATH_READY`.

Building as stacked-cap **workflow experiment** only (Kill A stands). Product path: `projects/lesserof/` smoke first per `lesserof-DAY1-COMMIT-ORDER.md`.

Honesty still required: no ACE replacement; no ×0.99-only widget; same-condition fence.

See `lesserof-POST-DEPOSITGAP-STATUS.md` + `lesserof-VALUE-GATE-DRYRUN.md`.

## Explicit non-actions

Do not claim filer replacement in digests. Do not smoke-as-sustain.
