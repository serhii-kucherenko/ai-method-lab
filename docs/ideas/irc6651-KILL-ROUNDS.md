# irc6651 — G3 kill rounds (deepened)

**State:** `adversarial` — not ready_to_build. Kill A/B/C answered with concrete fences; G4/G5 drafted on paper. Still no product.

## Kill A — Existing tool already solves this for the ICP

**Attempt:** IRS computes § 6651 on notices; TurboTax / Drake / UltraTax / CPA worksheets already show failure-to-file and failure-to-pay. Controllers do not need another late-fee toy.

**Answer (honesty, not idea death):** Correct commercially. Incumbents often expose a **notice total** or a simplified “late penalty” line without forcing the lab’s falsifiable stack: § 6651(b) net bases × month fractions, **(c)(1) same-month FTF←FTP reduction**, optional **(d) 1% bump**, and >60-day **minimum** lesser-of. Unique lab claim is a **method / FP&A forecast** of those additions — not IRS replacement, not abatement engine.

**Concrete fence (this tick):** Digests and any future UI must say: “forecast of statutory additions only; IRS notice + CPA own the real number; interest may also accrue under § 6601 and is out of scope.” Paper proof of the honesty gap: Toy 1 naive **$550** vs correct **$500** (`irc6651-TOYS.md`).

**Primary cites:**
- [26 U.S.C. § 6651(c)(1)](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section6651) — dual-addition reduction
- [IRS failure-to-file](https://www.irs.gov/payments/failure-to-file-penalty) — 5%/mo, 25% cap, minimum table, interaction summary
- [IRS failure-to-pay](https://www.irs.gov/payments/failure-to-pay-penalty) — 0.5%/mo example of 4.5% + 0.5% same month; 1% after levy-intent notice

**Outcome:** Survive with Kill A honesty fence (same pattern as c1592 / ptax4975 / depositgap). Digests must say so.

## Kill B — Too niche / too infrequent

**Attempt:** Late filing is either trivial (pay the notice) or rare enough that a dedicated product will not sustain.

**Answer:** Late-file / unpaid-balance timelines are **common** relative to § 1592 or AD liquidation gaps; frequency is monthly fractions until caps bind. The lab optimizes for **bulletproof unique math**, not SaaS TAM.

**Concrete fence / falsifier:** If after any future smoke users still forecast with a single “5% × months” cell and ignore (c)(1) → Kill B becomes a product falsifier (abandon). See G4 #1 in `irc6651-FALSIFIERS.md`.

**Outcome:** Survive for research; falsifier recorded.

## Kill C — Hard part is offline / legal; software won’t hold value

**Attempt:** The hard part is reasonable cause, first-time abatement, installment agreements, and appeals — not arithmetic. Software cannot hold the value.

**Answer:** Partially true. That is why v0 **fences** abatement eligibility and § 6601 interest. The software holds value only as an **honest statutory-addition calculator** that prevents double-counting without (c)(1) and wrong bases.

**Concrete fences (this tick):**
1. **No abatement / FTA / reasonable-cause scoring** — offline only  
2. **No § 6601 interest** in combined totals  
3. **Individual installment 0.25%/mo** (IRS FTP page) — out of v0 or explicit mode; must not silently use 0.5% (G5 case H)  
4. **Partnership § 6698 / S-corp § 6699** per-partner/shareholder schedules — different statutes; reject costumes (G5 Q/R)  
5. If domain experts reject the stack as useless vs “just wait for the CP14/CP501” in ≥2 real scenarios → abandon (G4 #2)

**Outcome:** Survive with abatement + interest + installment + 6698/6699 fences; do not claim relief engine.

## Instant-kill checks (anti-patterns)

| Pattern | Result |
|---------|--------|
| Dual-signer + ceiling/floor/days | **Fail** — not this seed |
| Capacity + hold expiry | **Fail** — not this seed |
| Noun-swap of ptax4975 / oshamult / c1592 | **Fail G2** — see unique claim in `irc6651.md` |
| Interest-only day-count toy (§ 6601 costume) | **Kill** — out of scope; depositgap already owns interest-window honesty elsewhere |
| Fixture farm same tick as framing | **Anti-conveyor** — G5 sketched only; no JSON goldens this tick |

## Gate progress (docs only)

| Gate | Status |
|------|--------|
| G1 | Provisional evidence + toys — `irc6651-G1-EVIDENCE.md` |
| G2 | Draft unique claim stands vs recent five |
| G3 | A/B/C answered + fences deepened |
| G4 | Drafted — `irc6651-FALSIFIERS.md` |
| G5 | Paper outline A–Y (25) — `irc6651-G5-cases.md` (no fixture farm) |
| G6 | Not written — **do not build yet** |

## Next (docs only)

- Skeptical G6 summary draft (still **do not build**)
- Optional: 2–3 goldens only after another research tick — not 25-green day
- Deepen Treas. Reg. § 301.6651-1 on partial months / netting
- Do **not** flip ready_to_build; do **not** open `projects/`
