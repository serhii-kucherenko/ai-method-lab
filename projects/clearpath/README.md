# Clearpath

Approvals / requests product experiment. Workflow: **A03 + A10**.

## Run locally

```bash
npm install
npm test
npm start
```

Open http://127.0.0.1:3000 for the minimal UI (login → create → submit → approve).

Optional DB path: `CLEARPATH_DB=./data/clearpath.db npm start`

## Deploy locally (lab)

1. `npm install && npm test`
2. Set `PORT` and `CLEARPATH_DB` as needed
3. `npm start` behind HTTPS in real deploys (tokens are bearer secrets)

## API highlights

`/auth/*`, `/requests` (+ transition/audit, pagination), `/projects`, `/tasks`, `/payments`, `/webhooks/payment`, `/health`, `/meta` via health migrations count.

## Docs

- `PRODUCT.md` — vision + sustain checklist
- `FINDINGS.md` — phase evidence + reuse notes
- `THREATS.md` — security notes
- `MIGRATIONS.md` — schema versions + rollback
- `SCALE.md` — pagination complexity
- `RED_GREEN.md` — test-first trail
