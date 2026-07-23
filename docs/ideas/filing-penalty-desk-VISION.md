# Filing Penalty Desk — product vision (architect draft)

**Display name:** Filing Penalty Desk  
**Slug:** `filing-penalty-desk`  
**Paper only.** Hours / depth gates may still block build. **Do not** open `projects/filing-penalty-desk/`. **Do not** brand the product `irc6651`.

Legacy research kit (`docs/ideas/irc6651*`, fixtures, oracle) informs the unique claim only — public surfaces lead with **Filing Penalty Desk**.

Sources: `filing-penalty-desk.md`, `irc6651-algorithm.md`, `docs/PRODUCT_NAMING.md`, `docs/COMPREHENSIVE_PRODUCT.md`.

---

## Who

Controllers and tax leads at small–mid filers (and their CPA shops) who must **budget cash** across late returns — forecasting failure-to-file and failure-to-pay additions month by month.

Secondary: **auditors** who need an append-only trail of forecast locks and scenario compares — not a dual-approver status board.

Not the audience: “everyone with tax software,” filers seeking an IRS substitute, or teams that only need a flat late-fee percent toy.

---

## Why

Spreadsheets treat “late fee” as a flat percent. Real rules stack **failure-to-file** and **failure-to-pay** on net amounts due, **reduce the file addition when both apply in the same month**, optionally raise the pay rate after levy-intent notice, and apply a **minimum lesser-of floor** when a return is very late. Wrong models invent or hide cash.

Kill honesty stands: IRS notices and commercial tax software already assess real penalties. Vision survives only as a **forecast / workflow honesty** experiment — not “we replace the IRS or your CPA.”

---

## What success looks like in 12 months

| Signal | Honest bar |
|--------|------------|
| Product | Comprehensive workflow (≥6 pages, ≥4 aggregates, **≥15** user-visible features, smoke→sustain ladder) — not a one-page late-fee calculator |
| Money | Every forecast surfaces **FTF and FTP separately**, same-month reduction when both accrue, caps, optional levy bump, and minimum floor when applicable |
| Toy honesty | Named dollar toys (e.g. SameMonth45, MinFloor, LevyBump) stay green and labeled **forecast toy** — never a filed notice |
| Ops | Batch forecasts for cash planning; auditors export CSV; ≥25 claim goldens + dual-impl green; tutor guide before sustain email |
| Claims | Digests still say: forecast ≠ IRS assessment; not CPA advice |

Success is **not** notice-matching parity with every IRS transcript, market proof from fixture counts, or replacing e-file / CPA workflows.

---

## What we refuse to become

1. **Not an IRS / CPA replacement** — no claim to assess, abate, or file.
2. **Not a dual-gate FSM** — no dual-approver status costume as “domain.”
3. **Not a flat late-fee widget** — percent-without-month-walk hides same-month reduction and floors.
4. **Not interest-as-penalty theater** — interest is not § 6651 addition math.
5. **Not `irc6651` as the brand** — statute id stays internal research only (`docs/PRODUCT_NAMING.md`).
6. **Not smoke-as-sustain** — shipping a single calculator fails `docs/COMPREHENSIVE_PRODUCT.md`.

---

## Money-honesty bar

Every user-facing forecast and digest must:

- Show **FTF** and **FTP** as separate lines (never one mystery “late fee”).
- Show **same-month reduction** when both file and pay additions accrue in a month.
- Show **caps** (25% aggregate story) and **levy-intent rate bump** when modeled.
- Show **minimum lesser-of floor** when >60-day late-file applies.
- Reject flat-percent cheats, dual-approver costumes, interest-as-penalty, and silent installment-rate swaps.
- Call outputs a **forecast** — never a matched IRS notice or abatement decision.

---

## Explicit non-action

- Do **not** flip `ready_to_build` from this artifact alone.
- Do **not** open `projects/filing-penalty-desk/`.
- Do **not** publish UI, digests, or portfolio rows under the brand `irc6651`.
- PM-GO + hours/ticks clearance + this pack remain prerequisites before build.
