# Notify — research digests via Resend

Push lab results to the human without blocking the autonomous loop.

## Config

Read from `matrix/CONTROLLER.json` → `notify`:

| Field | Meaning |
|-------|---------|
| `enabled` | If `false`, skip all sends |
| `channel` | `resend` (Resend MCP `send-email`) |
| `to` | Recipient address(es) |
| `from` | Verified sender, or `AI Method Lab <onboarding@resend.dev>` until a domain is verified |
| `on` | Events: `cell_scored`, `wave_complete`, `hard_stop` |
| `per_cell` | If `true`, also email after every scored cell (noisy) |

## When to send

After FINDINGS / leaderboard / controller are updated for that event:

1. **`wave_complete`** — always when listed in `on` (preferred digest)
2. **`hard_stop`** — always when listed (immediate alert)
3. **`cell_scored`** — only if `per_cell: true` or `cell_scored` is in `on`

Never wait for human reply. Send failure must not hard-stop the lab; log a one-line note in FINDINGS and continue.

## How (Resend MCP)

Server: `plugin-resend-resend`. Tool: `send-email`.

```text
to:        notify.to
from:      notify.from
subject:   [Method Lab] <event> — <short title>
text:      plain digest (required)
html:      optional; if set, text must still be set
idempotencyKey: method-lab/<event>/<id>   # e.g. method-lab/wave/wave-3-workflow-top5
tags:      [{ name: "lab", value: "ai-method-lab" }, { name: "event", value: "<event>" }]
```

Do not invent `from` or `to` — use only values from `notify`. If either is missing/empty, skip send and note in FINDINGS.

## Digest shape

**Cell scored** (short):

- Cell id, pass/fail, oracle score
- 1–3 FINDINGS bullets
- Next cell id (if any)

**Wave complete** (fuller):

- Wave name + approaches × brief
- Pass/fail table or bullets
- Ranking / next queue from FINDINGS
- Pointer: `matrix/FINDINGS.md`, `matrix/leaderboard.md`

**Hard stop:**

- Reason from `hard_stop_reason`
- Current cell / phase
- What the human must unblock

## Domain note

Until a custom domain is verified in Resend, use `onboarding@resend.dev` as from. With that sender, Resend only delivers to the Resend account owner email. After domain verification, update `notify.from` to e.g. `AI Method Lab <lab@yourdomain.com>`.
