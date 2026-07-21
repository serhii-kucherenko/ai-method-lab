# Notify — autonomous digests via Resend

Email delivers **what changed this tick** to `notify.to`. The human should understand the outcome **from the email alone**. Links are optional footnotes, not the payload.

## Config

`matrix/CONTROLLER.json` → `notify` (`enabled`, `to`, `from`, `on`).

Repo base (only when a link is warranted): `https://github.com/serhii-kucherenko/ai-method-lab/blob/main/`

## When to send

| Event | Trigger | Human action? |
|-------|---------|---------------|
| `product_complete` | Product sustained (or abandoned with autopsy) | No — summary of claim + ladder + framing |
| `wave_complete` / `ladder_complete` | Major method wave finishes | No — outcomes + defaults in-body |
| `promote_complete` | Auto-promote applied | No — what changed in defaults, in-body |
| `hard_stop` | Controller blocked | Yes — unblock only |
| `digest` | Research milestone worth reading (ready_to_build, idea killed) | No — decision + why |
| `decision_needed` | Legacy; **disabled** in autonomous mode when `auto_promote` is on |

Do **not** email per-cell pass/fail or “continuing to next cell.”

## Hard rules (content-first)

1. **Lead with the delta.** What finished, what was decided, what is next — in the body.
2. **Never force a re-read of the repo.** Do not make “open FINDINGS / workflow / portfolio” the way to learn what happened.
3. **Do not re-link static docs every time.** Skip `docs/DEVELOPMENT_WORKFLOW.md`, approach cards, USAGE_GUIDE, and other unchanged references unless *this email’s topic is that those docs changed* — then say **what** changed in one sentence and link once.
4. **One optional deep link max** when useful (e.g. this product’s FINDINGS or this idea dossier) — not a link farm.
5. **Method-stress digests:** state framing honestly (not GTM / not vendor replacement) in the body; do not hide it behind a link.

## Email format — product_complete / depth digest

1. **Subject:** `[Method Lab] Results: <≤8 words>`
2. **Body (required sections, plain text):**
   - **Outcome** — one line (e.g. `ndcswap sustained under A03+A10`)
   - **What shipped / what was proven** — 3–6 bullets (unique claim, ladder highlights, falsifiers or Kill A caveat)
   - **What did *not* change** — only if relevant (e.g. still method stress; still no dual-gate queue)
   - **Next** — one line (next idea state or next phase)
   - **Optional link** — at most one URL to the product FINDINGS or idea dossier *if* the human might want the long form; never a list of unchanged workflow links
3. No reply required unless `hard_stop`.

## Email format — research digest

Same shape: decision (`ready_to_build` / `killed` / still researching), why, gate highlights, next tick — **in the body**. Optional single dossier link.

## Email format — hard stop only

1. **Subject:** `[Method Lab] Blocked: <≤8 words>`
2. **Body:** reason + what is needed to unblock (inline). Optional FINDINGS link.

## Anti-patterns (do not send)

- Body that is mostly URLs
- “See DEVELOPMENT_WORKFLOW.md” when that file did not change this tick
- “Review portfolio / FINDINGS / frameworks” as a substitute for a summary
- Pass-count vanity without the unique claim / framing

## Resend

`send-email` with `notify.to` / `notify.from`, `idempotencyKey: method-lab/<event>/<id-or-date>`.

Commit before send when a link is included so `main` resolves; content-first emails do not depend on that.
