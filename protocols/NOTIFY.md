# Notify — autonomous digests via Resend

Email delivers **what changed this tick** to `notify.to`. The human should understand the outcome **from the email alone**, in everyday language — as if explaining the work to a smart friend who has never opened this repo.

Links are optional footnotes, not the payload.

## Config

`matrix/CONTROLLER.json` → `notify` (`enabled`, `to`, `from`, `on`).

Repo base (only when a link is warranted): `https://github.com/serhii-kucherenko/ai-method-lab/blob/main/`

## When to send

| Event | Trigger | Human action? |
|-------|---------|---------------|
| `product_complete` | Product finished (or abandoned with autopsy) | No |
| `wave_complete` / `ladder_complete` | Major method wave finishes | No |
| `promote_complete` | Auto-promote applied | No |
| `hard_stop` | Controller blocked | Yes — unblock only |
| `digest` | Research milestone worth reading (idea cleared to build, idea killed) | No |
| `decision_needed` | Legacy; **disabled** in autonomous mode when `auto_promote` is on |

Do **not** email per-cell pass/fail or “continuing to next cell.”

## Hard rules

1. **Explain before you celebrate.** The reader must learn *what the idea was*, *what the project is*, and *what we actually built* — not only that tests passed.
2. **Lead with the story, then the proof.** Outcome → idea → project/build → proof → framing → next.
3. **Never force a re-read of the repo.** Links are optional extras.
4. **At most one optional deep link.** Not a link farm. Do not re-link unchanged workflow docs.
5. **Honest framing in plain words:** this is a workflow experiment unless we say otherwise.
6. **No acronyms or internal codes** in subject or body (see table below).

## Plain language (no acronyms)

| Internal (repo only) | Say this in email |
|----------------------|-------------------|
| A03, A10, A03+A10 | “standard build workflow” or “full product test ladder” |
| G1–G6, IDEA_DEPTH | omit — describe the check in words |
| ready_to_build | “cleared research and ready to start building” |
| P-smoke, P-sustain, cell id | “first working version”, “finished”, or omit |
| Kill A / Kill B | “existing vendors already do this commercially” / “niche audience risk” |
| GTM | “commercial launch claim” |
| method stress | “workflow experiment — not claiming to beat incumbents” |

**Before send:** read the draft aloud. If a stranger would ask “what is this product?”, rewrite it.

---

## Email format — product finished (`product_complete`)

**Subject:** `[Method Lab] Results: <product name> finished` (or similar, ≤8 words, no codes)

**Body — all sections required, plain text:**

1. **Outcome** — one line (what finished)
2. **The idea** — 2–4 sentences: who hurts, how often, what goes wrong today, what we set out to prove
3. **The project** — what `projects/<name>/` is in plain words (a small app / service that does X)
4. **What we built** — concrete pieces a non-engineer can picture (screens, calculations, rules, rejects). Not “ladder green.”
5. **What we proved** — 3–6 bullets of verification (scenarios, rejects, scale). Include the “workflow experiment, not vendor replacement” caveat here or in framing.
6. **What did not change** — only if useful (still not a commercial pitch; still no shallow dual-approval queue)
7. **Next** — one line
8. **Optional link** — at most one findings URL

### Example — product finished (good)

```text
Subject: [Method Lab] Results: tariffstep finished

Outcome
tariffstep finished — we built and fully tested a small utility-billing calculator.

The idea
Utility rate analysts re-check bills after tariff changes. They walk monthly kilowatt-hours through stepped price tiers, then apply a demand ratchet: billed demand is often the larger of this month’s peak and a percentage of a past peak. Spreadsheets drift at tier edges and ratchet ties. We wanted to prove that core math can be encoded and tested end to end as a workflow experiment — not to replace commercial billing systems.

The project
tariffstep is a small Node app under projects/tariffstep: accounts, bill calculations, posting rules, a tiny web form, and automated tests.

What we built
- A bill calculator that walks usage through ordered rate blocks and computes energy charge
- Demand charge using this month’s peak versus prior-peak × ratchet percentage
- Rejects for empty or unsorted schedules, illegal ratchet percentages, and negative inputs
- Accounts with roles so only the right people can post a bill; failed bills cannot post
- A minimal web page to enter usage/peaks and see the calculated bill
- Signed inbound webhooks with duplicate protection, plus pagination and rate limits

What we proved
- 25 named billing scenarios passed (happy path, ratchet binds, boundaries, bad inputs)
- Full product test ladder passed (31 automated checks)
- Framing: workflow experiment only — commercial billing vendors still win in the market

What did not change
Still not a commercial launch claim. Still no shallow dual-approval product queue.

Next
Research continues on lanehold — warehouse lane capacity plus hold-until-release rules.

Optional link
https://github.com/serhii-kucherenko/ai-method-lab/blob/main/projects/tariffstep/FINDINGS.md
```

---

## Email format — research digest

**Subject:** `[Method Lab] Results: <idea> research update`

**Body — required:**

1. **Outcome** — decision or progress in one line
2. **The idea** — who / pain / what we are checking (same clarity as product emails)
3. **What we did this tick** — concrete research artifacts (scenarios, sources, challenges)
4. **Decision** — still researching / ready to build / killed — and why, in plain words
5. **Next** — one line
6. **Optional link** — at most one dossier URL

### Example — research digest (good)

```text
Subject: [Method Lab] Results: lanehold research started

Outcome
Opened research on lanehold — not building yet.

The idea
Warehouse planners reserve inventory into shipping lanes that have limited capacity. A hold should occupy capacity until release or expiry; overfill and stale holds should fail or free capacity cleanly. Spreadsheet lane boards drift when many picks run at once.

What we did this tick
- Framed the problem, who feels it, and how often
- Wrote a unique claim distinct from billing and coupon products
- Drafted three challenge rounds (vendors exist; niche; floor process offline)

Decision
Still researching. No product folder until the idea clears depth checks.

Next
Write the capacity/expiry algorithm on paper and start named test scenarios.
```

---

## Email format — hard stop only

1. **Subject:** `[Method Lab] Blocked: <≤8 words>`
2. **Body:** reason + what is needed to unblock (inline). Optional findings link.

## Anti-patterns (do not send)

- Proof-only emails with no idea / project / build explanation
- Body that is mostly URLs
- “See the findings / workflow docs” as a substitute for the story
- Pass-count vanity without saying what was built
- Acronyms or internal codes (A03, G5, ready_to_build, Kill A, etc.)

## Resend

`send-email` with `notify.to` / `notify.from`, `idempotencyKey: method-lab/<event>/<id-or-date>`.

Commit before send when a link is included so `main` resolves; content-first emails do not depend on that.
