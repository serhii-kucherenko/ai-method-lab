# Notify — autonomous digests via Resend

Email delivers **what changed** to `notify.to`. The human should understand the outcome **from the email alone**.

**Audience assumption (hard):** the reader knows **none** of our acronyms, statute codes, paper jargon, or repo slang. Write a **full, detailed, simple plain narrative** — as if explaining to a smart friend who has never heard of this lab, never read a research paper abstract, and never opened GitHub. Spell things out the first time; prefer everyday words over shorthand forever after.

Story first; links are not the payload — except these **required** link blocks:

- Every `idea_validated` and `product_complete` email ends with a **Sources** footer (paper URL + authors’ code URL when known).
- Every successful `product_complete` also includes try-artifacts (attachment + browser playground link) and **full GitHub https links** for how-to-run, lessons guide, design note, and the product folder (never bare repo paths like `projects/foo/README.md`).

## Config

`matrix/CONTROLLER.json` → `notify` (`enabled`, `to`, `from`, `on`).

**GitHub link base (required whenever naming a repo file):**  
`https://github.com/serhii-kucherenko/ai-method-lab/blob/main/`

Examples:

| Artifact | Email must use |
|----------|----------------|
| README | `https://github.com/serhii-kucherenko/ai-method-lab/blob/main/projects/<slug>/README.md` |
| Tutor guide | `https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/<nn>-<slug>-lessons.md` |
| Design note | `https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/ideas/<slug>-DESIGN.md` |
| Product tree | `https://github.com/serhii-kucherenko/ai-method-lab/tree/main/projects/<slug>` |
| try.html on GitHub | `https://github.com/serhii-kucherenko/ai-method-lab/blob/main/projects/<slug>/try.html` |

Browser playground try base: `https://stackblitz.com/fork/github/serhii-kucherenko/ai-method-lab/tree/main/projects/`

## When to send

| Event | Trigger | Human action? |
|-------|---------|---------------|
| `idea_validated` | Paper passed implementable filter; product folder opened | No |
| `product_complete` | Product finished (README + guide + try) or abandoned with autopsy | No |
| `hard_stop` | Controller blocked (credentials / corruption) | Yes — unblock only |

Do **not** email per-cell pass/fail, phase complete, or “continuing to next cell.”

### Validated idea (`idea_validated`)

**Subject:** `[Method Lab] Starting: <display name>` (human product name only)

**Body — plain narrative (no bullet farm of jargon):**

Write several short paragraphs a stranger can follow:

1. **What happened** — we picked a research paper and started a small software project inspired by it.
2. **What the paper is about** — in ordinary words (who it helps, what problem, what the authors claim). Do not dump author abbreviations unexplained.
3. **What we will build** — what the app will do for a user, in concrete everyday terms.
4. **Why this paper** — e.g. the authors published working source code, or the idea is clearly something a software team can implement and test.
5. **What you will get later** — another email when it is finished, with a simple offline demo and a link to try the project in the browser.
6. **Sources** — required footer; use the **Sources footer template** below.

### Product finished (`product_complete`)

Same plain-narrative bar, **longer and more complete**:

1. **Outcome** — the named product is finished; one sentence of what it does.
2. **The idea** — 3–6 sentences: who hurts, what goes wrong today, what we set out to prove (workflow experiment, not “we beat commercial vendors”).
3. **The project** — what lives in the product folder, in plain words (screens, calculations, rules).
4. **What we built** — concrete pieces a non-engineer can picture.
5. **What we proved** — verification in plain words (named scenarios, rejects, scale). Avoid “ladder green.”
6. **Summary** — one short paragraph of the whole story.
7. **What did not change** — still not a commercial pitch if true.
8. **Next** — one sentence.
9. **Try it** — attached offline page + browser playground link; **full GitHub https URLs** for how-to-run, lessons guide, design note (see templates below). Never paste bare paths.
10. **Sources** — required footer; same template as the start letter.

## Sources footer template (required on start + finish emails)

Paste this block **verbatim at the end** of every `idea_validated` and `product_complete` email. Fill the URLs from the pick (`docs/ideas/<slug>.md` or picker JSON). Never omit the heading. Never substitute “see the dossier” for the URLs.

```text
Sources
Paper: <full https URL to the paper page — arXiv abs, DOI, publisher, etc.>
Authors’ code: <full https URL to the public repository>
```

If the pick has **no** public code repository:

```text
Sources
Paper: <full https URL to the paper page>
Authors’ code: none published with this paper
```

## Repo links template (required on finish emails)

After **Try it**, always include full GitHub links — **never** `projects/...` or `docs/...` alone:

```text
How to run: https://github.com/serhii-kucherenko/ai-method-lab/blob/main/projects/<slug>/README.md
What we learned: https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/<nn>-<slug>-lessons.md
Design note: https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/ideas/<slug>-DESIGN.md
Product folder: https://github.com/serhii-kucherenko/ai-method-lab/tree/main/projects/<slug>
```

On **start** letters, optional but preferred when the folder already exists:

```text
Project folder: https://github.com/serhii-kucherenko/ai-method-lab/tree/main/projects/<slug>
```

## Hard rules

1. **Explain before you celebrate.** The reader must learn *what the idea was*, *what the project is*, and *what we actually built* — not only that tests passed.
2. **Lead with the story, then the proof.** Full narrative first; counts only as supporting detail.
3. **Never force a re-read of the repo.** When you name a file, paste the **clickable GitHub https URL** — do not leave bare paths.
4. **Link budget:** hard-stop → at most one optional deep link. Idea start and product finished → **Sources footer always** (paper URL + code URL or “none published”). Product finished also → **try-page attachment + browser-playground try link + full GitHub links** for README, guide, design, product folder.
5. **Honest framing in plain words:** this is a workflow experiment unless we say otherwise.
6. **No unexplained acronyms or internal codes** in subject or body. If a technical term is unavoidable, define it in the same sentence in everyday language.
7. **No paper-id or statute-code branding** in the subject; use the mature display name only.
8. **Do not send** a start or finish email without the Sources footer.
9. **Do not send** a finish email that only names `projects/<slug>/README.md` or `docs/guides/...` without the matching `https://github.com/...` URL.

## Plain language (never assume these are known)

| Internal / technical | Say this in email |
|----------------------|-------------------|
| A03, A10, ladder | “our full product build-and-test workflow” |
| G1–G6, IDEA_DEPTH | omit — describe the check in words |
| ready_to_build | “ready to start building” |
| P-smoke, P-sustain, cell id | “first working version”, “finished”, or omit |
| Kill A / Kill B | “existing vendors already do this commercially” / “niche audience risk” |
| GTM | “commercial launch claim” |
| method stress | “workflow experiment — not claiming to beat incumbents” |
| StackBlitz | “open in the browser playground” (then paste the URL) |
| MLIR | “a compiler toolkit used to lower machine-learning models into efficient code” (or avoid and say “compiler passes”) |
| LLM | “large language model” or “chat-style AI model” |
| HMAC / RBAC / API | “signed webhook requests” / “role permissions” / “the app’s programming interface” — or describe the user-visible behavior only |
| CRUD | “create, read, update, and delete records” |
| arXiv / DOI | “a public research paper” + optional link; never lead with the id |
| IRS / ACA / OSHA (if ever) | spell out or describe (“U.S. tax agency”, “health coverage rules for large employers”, …) |

**Before send:** read the draft aloud. If a stranger would ask “what does that abbreviation mean?” or “what is this product?”, rewrite it. Prefer a letter-like narrative over a checklist of codes.

---

## Try artifacts — product finished only

Required on every successful `product_complete` email (skip for abandoned products with no usable UI/core math).

### 1. Standalone try page (attachment)

Commit and attach a **single-file** demo:

- Path: `projects/<name>/try.html`
- Filename in email: `try-<name>.html`
- Must open by double-click in a browser with **no server**
- Inline all CSS and JS in that one file (no external `/styles.css`, `/app.js`, or API calls)
- Demonstrate the **core happy path** the product proves (calculator, form, rules) with sensible defaults
- Label clearly that this is a simplified offline demo, not the full app
- Prefer porting pure domain logic (e.g. bill math) into the page; omit auth, webhooks, and database

Reference: `projects/tariffstep/try.html`

### 2. Browser playground link (StackBlitz)

After the product is on `main`, include exactly one try URL:

```text
https://stackblitz.com/fork/github/serhii-kucherenko/ai-method-lab/tree/main/projects/<name>?startScript=start
```

- Commit + push **before** send so the link resolves
- Plain-language label in the body: **Try it** (attachment = offline page; link = full project in the browser)
- Honesty note if useful: the playground may fail when Node SQLite or native APIs are unsupported — the try page still works offline
- Repo must stay **public** so StackBlitz can import without a paid private-repo plan (set public for this reason)

Do **not** deploy to Vercel (or similar) just for digests.

### Abandoned products

If abandoned mid-build with nothing to try: story + autopsy only; no fake try page.

---

## Email format — validated idea (`idea_validated`)

**Subject:** `[Method Lab] Starting: <display name>`

**Body — all sections required, plain text:**

1. **What happened**
2. **What the paper is about**
3. **What we will build**
4. **Why this paper**
5. **What you will get later**
6. **Sources** — Sources footer template (paper + authors’ code)

### Copy-paste skeleton — start letter

```text
Subject: [Method Lab] Starting: <Display Name>

What happened
We picked a research paper and started a small software project inspired by it. The working name is <Display Name>.

What the paper is about
<2–4 sentences in everyday words: who it helps, what problem, what the authors claim.>

What we will build
<Concrete everyday description of the desk/app the user will see.>

Why this paper
<Why implementable — usually: authors published working source code and a clear software claim.>

What you will get later
Another email when it is finished, with a simple offline demo page and a link to try the project in the browser playground, plus a short how-to-run note and a lessons guide.

Project folder: https://github.com/serhii-kucherenko/ai-method-lab/tree/main/projects/<slug>

Sources
Paper: <https://...>
Authors’ code: <https://...>
```

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
8. **Try it** — (a) attached `try-<name>.html` — download and open; (b) StackBlitz URL; (c) **Repo links template** with full GitHub https URLs
9. **Sources** — Sources footer template (paper + authors’ code)

**Resend:** `text` body as usual; `attachments: [{ filename: "try-<name>.html", content: <base64 of try.html>, contentType: "text/html" }]`.

### Copy-paste skeleton — finish letter

```text
Subject: [Method Lab] Results: <Display Name> finished

Outcome
<Display Name> finished — <one sentence of what it does>.

The idea
<2–4 sentences.>

The project
<What the folder is, in plain words.>

What we built
<Concrete pieces.>

What we proved
- <verification bullets>
- Framing: workflow experiment only — not replacing the authors’ system or commercial vendors

What did not change
Still not a commercial launch claim.

Next
We will pick another implementable research paper and start the next desk.

Try it
- Attachment: try-<slug>.html — download and open in your browser (offline demo)
- Full project in the browser:
  https://stackblitz.com/fork/github/serhii-kucherenko/ai-method-lab/tree/main/projects/<slug>?startScript=start
How to run: https://github.com/serhii-kucherenko/ai-method-lab/blob/main/projects/<slug>/README.md
What we learned: https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/<nn>-<slug>-lessons.md
Design note: https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/ideas/<slug>-DESIGN.md
Product folder: https://github.com/serhii-kucherenko/ai-method-lab/tree/main/projects/<slug>

Sources
Paper: <https://...>
Authors’ code: <https://...>
```

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
Research continues on the next differentiated idea in the backlog.

Try it
- Attachment: try-tariffstep.html — download and open in your browser (offline demo of the bill math)
- Full project in the browser:
  https://stackblitz.com/fork/github/serhii-kucherenko/ai-method-lab/tree/main/projects/tariffstep?startScript=start
How to run: https://github.com/serhii-kucherenko/ai-method-lab/blob/main/projects/tariffstep/README.md
What we learned: https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/01-tariffstep-lessons.md
Product folder: https://github.com/serhii-kucherenko/ai-method-lab/tree/main/projects/tariffstep

Sources
Paper: none — this product was not paper-sourced
Authors’ code: none published with this paper
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

If the research tick produced (or already has) a **runnable paper algorithm** (form gate, calculator, etc.), **attach** `demos/<idea>-try/try.html` and include **one** StackBlitz link to that demo folder — still **not** a product. Prefer the idea with the strongest literal-dollar or unique-claim demo for that digest. Omit Try it only when no offline demo exists yet.

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
- Product finished email **without** try page + StackBlitz (when the product has a usable core demo)
- Start or finish email **without** the Sources footer (paper URL + authors’ code URL or “none published”)
- Finish email that names repo files as bare paths (`projects/...`, `docs/...`) instead of full `https://github.com/serhii-kucherenko/ai-method-lab/...` links
- Try page that still calls `fetch("/...")` or needs `npm start`
- Deploying a host (Vercel, etc.) only so the digest has a URL

## Resend

`send-email` with `notify.to` / `notify.from`, `idempotencyKey: method-lab/<event>/<id-or-date>`.

For `product_complete`: include `text` + try-page `attachments` as above.

Commit + push before send when a StackBlitz (or other GitHub-backed) link is included so `main` resolves; content-first emails without links do not depend on that.
