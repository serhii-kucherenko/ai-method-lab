# c1592 — comprehensive product blueprint (paper)

**Status:** paper only under hours hold.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md`  
**Unique claim:** § 1592(c) statutory max by culpability × duty-loss / no-loss branch + lesser-of domestic value.

## Aggregates (≥3)

1. **Organization** — tenants, roles  
2. **Violation fact set** — culpability, duty_loss, domestic_value, dutiable_value  
3. **Penalty-max run** — locked max + branch + algorithm version  
4. **Audit event** — append-only  
5. **Goldens pack**

## Pages (target 7)

| Page | Purpose |
|------|---------|
| Violations catalog | List / filter by culpability / branch |
| Violation detail | Edit facts; run statutory-max forecast |
| Batch forecast | Independent runs |
| Audit log | CSV export |
| Goldens browser | Fixtures vs live |
| Money honesty | Kill A + PD + mitigation fences |
| Org settings | Webhook / tokens |

## Features (≥6 beyond CRUD)

1. Negligence / gross / fraud branches  
2. Duty-loss lesser-of (2× / 4× vs domestic)  
3. No-loss % of dutiable (20% / 40%)  
4. Flat-2× / dual-approver / ignore-domestic-cap rejects  
5. Batch independence  
6. HMAC webhook + pagination + settings RBAC  

## Instant fail

Flat-2× widget; “CBP will assess X”; silent PD; dual-counsel board; sustain with <4 pages.
