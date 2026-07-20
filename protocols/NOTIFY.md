# Notify — research digests via Resend

Email = **one decision + clickable GitHub links**. No status theater.

## Config

`matrix/CONTROLLER.json` → `notify` (`enabled`, `to`, `from`, `on`).

Repo base for links: `https://github.com/serhii-kucherenko/ai-method-lab/blob/main/`

## When to send

Only when the human must act (`decision_needed`, `hard_stop`), or a wave changes the ranking/recommendation.

Do **not** email pass/fail rollups, setup tests, or “continuing to next cell.”

## Email format (strict)

1. **Subject:** `[Method Lab] Decide: <≤8 words>`
2. **Body (short):**
   - First line: the ask (reply 1 / 2 / 3)
   - 3–5 bullets max of *why* (signal only)
   - **Links** (required, full `https://` URLs — never bare paths like `matrix/FINDINGS.md`):
     - Decision context (FINDINGS or leaderboard)
     - Approach card(s) under consideration
     - Rubric promote rules when asking promote/kill
3. No HTML tables. No “test digest.” No meta about how email works.

## Resend

`send-email` with `notify.to` / `notify.from`, `idempotencyKey: method-lab/<event>/<id>`.
