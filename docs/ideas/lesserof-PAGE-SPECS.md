# lesserof — page wireframe specs (seed paper)

**Status:** seed only. Expands `lesserof-COMPREHENSIVE-BLUEPRINT.md`.  
**Explicit non-action:** do **not** open `projects/lesserof/` while `htsroute` holds the slot.

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
TFTEA then partner lesser-of; duty-free → recoverable **0**.

### 4. Basket eligibility
8-digit “other” + 10-digit match; reject vs eligible.

### 5. Audit / goldens
Append-only trail + paper fixture browser.

### 6. Honesty
Kill A + “99% of paid” failure mode explained in dollars.
