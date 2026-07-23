# irc6651 — G5 case map (paper outline)

**State:** `adversarial`. Sketched on paper only — **not** a green fixture farm this tick.  
**Unique claim under test:** month-fraction **FTF 5% + FTP 0.5%/1%** on § 6651(b) net bases, with **(c)(1)** same-month FTF←FTP reduction, optional **(d)** bump, and >60-day **minimum** lesser-of — not flat late-fee %, not § 6601 interest, not § 6698/6699.

Target smoke alone ≥ **25** named cases. Encode goldens later ticks (anti-conveyor).

## Sketched suite (A–Y = 25)

| ID | Theme | Intent (expected behavior on paper) |
|----|-------|-------------------------------------|
| A | Happy dual month | One month both apply → FTF effective 4.5% + FTP 0.5% on same § 6651(b) base (IRS example shape) |
| B | FTP only | Timely file, unpaid balance → FTP months only; FTF = 0 |
| C | Paid-on-time late file | Timely pay / withholding covers tax → FTF base § 6651(b)(1) = 0 → additions 0 |
| D | Mid-stream payment | Payment before month start cuts **FTP** base only; FTF (b)(1) base stays; (c)(1) uses that month’s FTP |
| E | Minimum binds | >60 days late; % FTF < indexed floor; underpayment ≥ floor → FTF = floor |
| F | Minimum lesser-of | >60 days; underpayment < floor → FTF = 100% of underpayment (not the table floor) |
| G | (d) 1% bump | After notice of intent to levy + 10 days, FTP rate 1%/mo on unpaid; pre-bump months stay 0.5% |
| H | Installment fence | Individual approved payment plan 0.25%/mo — **out of v0** or explicit reject/mode; must not silently use 0.5% |
| I | FTF month max | After 5 late-file months, FTF stops accruing; FTP may continue |
| J | FTP 25% cap | Long unpaid timeline → FTP aggregate ≤ 25% of unpaid-tax bases (cap binds) |
| K | Partial month | One day into a month → full month fraction for FTF and/or FTP |
| L | Zero / missing tax | Non-positive tax required to be shown → reject or zero additions (no NaN dollars) |
| M | Negative inputs | Negative months, rates, or payments → reject |
| N | Dual-approver costume | Status + ceiling/floor/days dual-signer shape → **reject** (instant G2 kill) |
| O | Flat 5.5% forever | “5%+0.5% with no (c)(1)” forecast path → reject or score as wrong vs oracle |
| P | § 6601 conflation | Interest-as-penalty day-count toy → reject (depositgap / interest fence) |
| Q | Partnership § 6698 | Per-partner monthly schedule costume → reject / fence (different statute) |
| R | S-corp § 6699 | Per-shareholder schedule costume → reject / fence |
| S | Concurrency | Two independent timelines (two EINs / two years) — mutating A must not change B totals |
| T | Time boundary | Filing due date vs extension: extension of **file** does not extend **pay**; FTP may run while FTF does not |
| U | Expert cheat: (c)(1) after cap | Apply (c)(1) reduction to months after FTF already at aggregate 25% → reject / no double-dip |
| V | Expert cheat: min undercut | Use (c)(1) to drive FTF below statutory minimum when minimum sentence applies → reject |
| W | Indexed minimum table | Same facts, due-date year 2024 vs 2025 vs after 12/31/2025 → different floors ($485 / $510 / $525) |
| X | Extension + unpaid | Valid file extension, tax unpaid → FTP only at 0.5% (or 1% if (d)); FTF = 0 until extension expires |
| Y | Cents precision | Large base + many months → cents agree with banker’s rounding rule documented in oracle notes |

## Coverage vs IDEA_DEPTH G5 bar

| Requirement | Coverage |
|-------------|----------|
| Happy path unique claim | A, D, G |
| ≥5 negative / boundary | L, M, N, O, P, Q, R, U, V |
| ≥1 concurrency / time-dependent | S, T, K, I, J |
| ≥1 expert-judged cheat | U, V, O |
| Estimated count ≥25 | **A–Y = 25** sketched |

## Explicit non-actions this tick

- Do **not** open `docs/ideas/fixtures/irc6651-*.json` farm
- Do **not** open `projects/irc6651/`
- Do **not** flip `ready_to_build`
