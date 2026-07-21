# Threats

| Threat | Mitigation |
|--------|------------|
| Cross-account read/write | Token auth + membership roles |
| Post rejected bill | Block post when calculation failed |
| Webhook replay | Store event ids; duplicates ignored |
| Dual-approval “fix” for math | Product must not add dual approval — bill math is pure calculation |
