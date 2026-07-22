# lesserof — page wireframe specs

**Status:** active research. Expands `lesserof-COMPREHENSIVE-BLUEPRINT.md`.  
**Explicit non-action:** do **not** open `projects/lesserof/` until hours + preflip clear.

---

## Shared UI rules

| Rule | Spec |
|------|------|
| Auth | Bearer session |
| Tenant | Org-scoped claim lines |
| RBAC | Analyst mutates + forecasts; auditor read-only; admin settings |
| Forbidden chrome | No dual-approver; no “replaces ACE / broker” |
| Kill A footer | Specialists still file; stacked-cap honesty experiment |
| Money honesty | Show TFTEA cap and USMCA cap separately; never hide $0 USMCA path |
| Same-condition | v0 out of scope — do not imply every CA/MX export wipes (`lesserof-SAME-CONDITION-FENCE.md`) |

---

## Feature × page matrix

| Feature | 1 Workspace | 2 Lane compare | 3 USMCA | 4 Basket | 5 Audit/Goldens | 6 Honesty |
|---------|:-----------:|:--------------:|:-------:|:--------:|:---------------:|:---------:|
| Edit claim lines | ● | | | | | |
| Run stacked calc | ● | ○ | ○ | ○ | | |
| Direct-ID vs substitution | | ● | | | | |
| USMCA zero path | | | ● | | | |
| Basket other reject | | | | ● | | |
| Fixture browser | | | | | ● | |
| Kill A education | | ○ | ○ | | ○ | ● |

---

## Page briefs

### 1. Claim workspace
Create/edit lines; claim basis; duty columns; destination; run stacked recoverable.

### 2. Lane compare
Shared paid amount: direct-ID (no lesser-of) vs substitution (binds) side by side.

### 3. USMCA stack
TFTEA then partner lesser-of; duty-free → recoverable **0**. Call out same-condition carve-out as **not modeled** in v0.

### 4. Basket eligibility
8-digit “other” + 10-digit match; reject vs eligible.

### 5. Audit / goldens
Append-only trail + paper fixture browser (**≥25** A–Y).

### 6. Honesty
Kill A + illustrative miss toys; no ACE replacement claims.
