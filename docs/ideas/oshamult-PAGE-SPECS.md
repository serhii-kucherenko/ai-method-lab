# oshamult — page wireframe specs (seed paper)

**Status:** seed only. Expands `oshamult-COMPREHENSIVE-BLUEPRINT.md`.  
**Explicit non-action:** do **not** open `projects/oshamult/` while `htsroute` holds the slot.

---

## Shared UI rules

| Rule | Spec |
|------|------|
| Auth | Bearer session |
| Tenant | Org-scoped citations |
| RBAC | Analyst mutates + forecasts; auditor read-only; admin settings |
| Forbidden chrome | No dual-approver; no “replaces counsel” |
| Kill A footer | Consultants still model; forecast honesty experiment |
| Money honesty | Show each serial step; never hide classification gates |

---

## Feature × page matrix

| Feature | 1 Catalog | 2 Detail | 3 Batch | 4 Audit | 5 Goldens | 6 Settings | 7 Honesty |
|---------|:---------:|:--------:|:-------:|:-------:|:---------:|:----------:|:---------:|
| List / filter | ● | | | | | | |
| Edit GBP / pcts / class | | ● | | | | | |
| Run serial forecast | | ● | ○ | | | | |
| Batch independence | | | ● | | | | |
| Audit / CSV | | ○ | | ● | | | |
| Fixture browser | | | | | ● | | |
| Org / tokens | | | | | | ● | |
| Statutory-max education | | ○ | | | ○ | | ● |

---

## Page briefs

### 1. Citations catalog
Filter by classification, gravity, proposed amount.

### 2. Citation detail
Edit facts; run serial penalty; show Size→History→Good Faith→Quick Fix steps.

### 3. Batch forecast
Multiple citations; independent runs.

### 4. Audit log
Append-only + CSV.

### 5. Goldens browser
Paper fixtures vs live engine.

### 6. Org settings
Members, tokens, webhook.

### 7. Honesty
Statutory max ≠ GBP; Kill A; classification gate explainer.
