# ptax4975 — page wireframe specs (seed paper)

**Status:** seed only. Expands `ptax4975-COMPREHENSIVE-BLUEPRINT.md`.  
**Explicit non-action:** do **not** open `projects/ptax4975/` while `htsroute` holds the slot.

---

## Shared UI rules

| Rule | Spec |
|------|------|
| Auth | Bearer session |
| Tenant | Org-scoped prohibited-transaction facts |
| RBAC | Analyst mutates + forecasts; auditor read-only; admin settings |
| Forbidden chrome | No dual-approver; no “replaces Form 5330” |
| Kill A footer | Counsel still files; FP&A honesty experiment |
| Money honesty | Show initial tax **and** additional tax separately |

---

## Feature × page matrix

| Feature | 1 Catalog | 2 Detail | 3 Batch | 4 Audit | 5 Goldens | 6 Honesty | 7 Settings |
|---------|:---------:|:--------:|:-------:|:-------:|:---------:|:---------:|:----------:|
| List / filter | ● | | | | | | |
| Edit amount / FMV / years | | ● | | | | | |
| Run excise forecast | | ● | ○ | | | | |
| Batch independence | | | ● | | | | |
| Audit / CSV | | ○ | | ● | | | |
| Fixture browser | | | | | ● | | |
| Year-part education | | ○ | | | ○ | ● | |
| Org / tokens | | | | | | | ● |

---

## Page briefs

### 1. Transactions catalog
Filter by corrected flag, total exposure.

### 2. Transaction detail
Edit amount / FMV pair / year-parts / corrected; run forecast; lock initial + additional + total.

### 3. Batch forecast
Multiple PTs; independent runs.

### 4. Audit log
Append-only + CSV.

### 5. Goldens browser
Paper fixtures vs live engine.

### 6. Honesty
Kill A + flat-excise failure mode in dollars.

### 7. Org settings
Members, tokens, webhook.
