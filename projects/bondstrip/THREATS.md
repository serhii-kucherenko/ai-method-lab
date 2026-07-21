# Threats (A10)

| Threat | Mitigation |
|--------|------------|
| Cross-desk read/write | Bearer auth + desk membership roles |
| Confirm rejected accrue | Block confirm when ok=0 |
| Webhook replay | Idempotent event_id store |
| Dual-signer accrue cheat | Product must not add dual gate — accrue is pure math |
