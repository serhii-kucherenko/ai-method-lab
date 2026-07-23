# irc6651 — G1 evidence (provisional)

## Named user

Controllers / tax leads at small–mid filers (and their CPA shops) who must **forecast cash** when a return will be late or a balance will remain unpaid across months — not every TurboTax end user.

## Frequency

Per late return / unpaid-balance timeline. Accrual is **monthly (or partial-month)** until 25% caps bind or the return/balance is cured. Episode-driven, not daily ops.

## Painful workaround today

1. Spreadsheet “5% × months” (sometimes “5.5%”) without § 6651(c)(1) same-month reduction  
2. Applying % to **gross tax** instead of § 6651(b) net amount due  
3. Ignoring mid-stream payments that cut the **FTP** base month-by-month  
4. Missing § 6651(d) 1% bump or the >60-day **minimum** lesser-of floor  
5. Reverse-engineering a CP14/CP501 total that also mixes § 6601 interest

## Sources (cite, not invent)

1. **Primary:** [26 U.S.C. § 6651](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section6651) — (a)(1)/(a)(2), (b) net amount due, (c)(1) dual-addition reduction, (d) rate bump, minimum sentence  
2. **IRS FTF:** [Failure to file penalty](https://www.irs.gov/payments/failure-to-file-penalty) — 5%/mo to 25%; (c) interaction; >60-day minimum table (e.g. $510 for due dates in 2025; $525 after 12/31/2025)  
3. **IRS FTP:** [Failure to pay penalty](https://www.irs.gov/payments/failure-to-pay-penalty) — 0.5%/mo example of **4.5% + 0.5%** same month; 1% after levy-intent notice; 0.25% during approved individual installment (fence)  
4. **Reg pointer:** Treas. Reg. § 301.6651-1 (deepen next ticks — month/partial-month and netting detail)

## Worked dollar pointer

See `irc6651-TOYS.md` — especially **Toy 1 `SameMonth45`** ($500 correct vs $550 naive) and **Toy 2 `HalfPayMonth3`** ($6,000 correct).

## Residuals (honest)

- No controller / CPA interview this tick  
- No redacted notice matched line-by-line to a toy  
- Kill A still stands: IRS notices and tax software own production assessments

## G1 status

**Provisional** — named user + workaround + primary IRS/statute cites + paper dollars. Not enough alone for `ready_to_build`.
