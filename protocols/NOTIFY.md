# Notify — autonomous digests via Resend

Email delivers **what changed this tick** to `notify.to`. The human should understand the outcome **from the email alone**, in everyday language. Links are optional footnotes, not the payload.

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
| `digest` | Research milestone worth reading (idea cleared to build, idea killed) | No — decision + why |
| `decision_needed` | Legacy; **disabled** in autonomous mode when `auto_promote` is on |

Do **not** email per-cell pass/fail or “continuing to next cell.”

## Hard rules (content-first)

1. **Lead with the delta.** What finished, what was decided, what is next — in the body.
2. **Never force a re-read of the repo.** Do not make “open findings / workflow / portfolio” the way to learn what happened.
3. **Do not re-link static docs every time.** Skip unchanged workflow or framework docs unless *this email’s topic is that those docs changed* — then say **what** changed in one sentence and link once.
4. **One optional deep link max** when useful (e.g. this product’s findings or this idea dossier) — not a link farm.
5. **Method-stress digests:** say honestly that this is a workflow experiment, not a commercial product pitch — in plain words, in the body.
6. **No acronyms or internal codes in subject or body.** Write for someone who does not live in this repo. Spell out concepts; use product and idea names (`bondstrip`, `tariffstep`), not gate labels, approach ids, or phase codes.

## Plain language (no acronyms) — required

**Do not put these in emails** (use the plain phrase instead):

| Internal (repo only) | Say this in email |
|----------------------|-------------------|
| A03, A10, A03+A10 | “standard build workflow” or “full product test ladder” |
| G1–G6, IDEA_DEPTH | omit — describe the actual check (“pain evidence”, “25 test scenarios”, “research summary”) |
| ready_to_build | “cleared research and ready to start building” |
| P-smoke, P-sustain, cell id | “first working version”, “finished and sustained”, or omit |
| Kill A / Kill B | “existing vendors already do this commercially” / “niche audience risk” |
| GTM | “go-to-market” or “commercial launch claim” |
| CIS, FI, FSM, API, RED/GREEN | spell out once if needed (“billing system”, “fixed income desk”) or omit |
| FDP, FAR 117, TE, DAW, BMN | spell out the domain in one short phrase or name the product claim |
| method stress | “workflow experiment — not claiming to beat incumbents” |

**Subject line:** short outcome in normal words. Good: `[Method Lab] Results: bondstrip finished testing`. Bad: `[Method Lab] bondstrip sustained A03+A10`.

**Before send:** read the draft aloud. If it sounds like an internal ticket, rewrite it.

### Example — product complete (good)

```text
Subject: [Method Lab] Results: bondstrip finished testing

Outcome
bondstrip is done — we proved day-count accrued interest and coupon strip math end to end.

What we proved
- Accrued interest uses 30/360 or actual/actual rules correctly
- Remaining coupon cashflows include principal at maturity
- 31 automated checks passed, including bad inputs rejected
- This was a workflow experiment, not a claim to replace Bloomberg or Yield Book

What did not change
We are still not pitching this as a commercial product. No shallow dual-approval queue.

Next
Research continues on tariffstep (stepped utility rates + demand ratchet).

Optional link
https://github.com/.../projects/bondstrip/FINDINGS.md
```

### Example — research digest (good)

```text
Subject: [Method Lab] Results: tariffstep research deepened

Outcome
tariffstep research advanced — 25 billing scenarios verified on paper; not building yet.

What we did
- Expanded test scenarios for block walking and demand ratchet
- Added source notes on real billing pain and dispute paths
- Recorded three challenge rounds; incumbent billing tools still win commercially

Next
Map real tariff sheets to scenarios, then decide build or kill.
```

## Email format — product_complete / depth digest

1. **Subject:** `[Method Lab] Results: <≤8 words, no codes>`
2. **Body (required sections, plain text):**
   - **Outcome** — one line in normal language
   - **What shipped / what was proven** — 3–6 bullets (unique claim, test highlights, commercial caveat if any)
   - **What did *not* change** — only if relevant (e.g. still a workflow experiment; still no shallow approval-queue products)
   - **Next** — one line (next idea or next phase, plain words)
   - **Optional link** — at most one URL to findings or idea dossier
3. No reply required unless `hard_stop`.

## Email format — research digest

Same shape: decision (building / killed / still researching), why, highlights, next — **in the body**, no gate codes. Optional single dossier link.

## Email format — hard stop only

1. **Subject:** `[Method Lab] Blocked: <≤8 words>`
2. **Body:** reason + what is needed to unblock (inline). Optional findings link.

## Anti-patterns (do not send)

- Body that is mostly URLs
- “See DEVELOPMENT_WORKFLOW.md” when that file did not change this tick
- “Review portfolio / findings / frameworks” as a substitute for a summary
- Pass-count vanity without the unique claim / framing
- **Any acronym-heavy or internal-code subject/body** (A03, G5, IDEA_DEPTH, ready_to_build, Kill A, GTM, etc.)

## Resend

`send-email` with `notify.to` / `notify.from`, `idempotencyKey: method-lab/<event>/<id-or-date>`.

Commit before send when a link is included so `main` resolves; content-first emails do not depend on that.
