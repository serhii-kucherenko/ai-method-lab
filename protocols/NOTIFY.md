# Notify — autonomous digests via Resend

Email delivers **findings, promoted defaults, and usage links** to `notify.to`. The human does not need to act unless `hard_stop`.

## Config

`matrix/CONTROLLER.json` → `notify` (`enabled`, `to`, `from`, `on`).

Repo base for links: `https://github.com/serhii-kucherenko/ai-method-lab/blob/main/`

## When to send

| Event | Trigger | Human action? |
|-------|---------|---------------|
| `wave_complete` | Smoke column or major wave finishes | No — informational + next queue |
| `ladder_complete` | All planned experiment cells scored | No — full digest |
| `promote_complete` | Auto-promote applied (`defaults.auto_promote: true`) | No — defaults + how-to links |
| `hard_stop` | Controller blocked | Yes — unblock only |
| `decision_needed` | Legacy; **disabled in autonomous mode** when `auto_promote` is on |

Do **not** email per-cell pass/fail or “continuing to next cell.”

## Autonomous mode (default)

When `mode: autonomous` and `defaults.auto_promote: true`:

1. Controller scores ladder → applies promote per rubric → writes `matrix/METHOD_DEFAULTS.json`
2. Sends **`ladder_complete`** then **`promote_complete`** digest (one combined email OK)
3. Never sets `ask_human: true` for promote/reject — scored auto-promote is the decision

## Email format — ladder / promote digest

1. **Subject:** `[Method Lab] Results: <≤8 words>` (e.g. `Results: A03 promoted, 47 cells pass`)
2. **Body:**
   - First line: outcome (what was promoted, cell count, all-pass or failures)
   - **Promoted defaults** — primary + enterprise alternate, one line each
   - **Method picker** — 3–5 bullets (when to use which)
   - **Links** (required, full `https://` URLs):
     - Usage guide: `docs/USAGE_GUIDE.md`
     - Findings: `matrix/FINDINGS.md`
     - Leaderboard: `matrix/leaderboard.md`
     - Method defaults: `matrix/METHOD_DEFAULTS.json`
     - Primary approach card (e.g. `approaches/A03.md`)
     - Enterprise alternate (e.g. `approaches/A10.md`)
3. No reply required. No “choose 1/2/3” unless `hard_stop`.

## Email format — hard stop only

1. **Subject:** `[Method Lab] Blocked: <≤8 words>`
2. **Body:** reason + what is needed to unblock + link to FINDINGS

## Resend

`send-email` with `notify.to` / `notify.from`, `idempotencyKey: method-lab/<event>/<wave-or-date>`.

Controller sends after meta-repo commit when possible so links resolve on `main`.
