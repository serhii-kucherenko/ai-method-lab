# Filing Penalty Desk

Forecast late-file and late-pay tax additions with a month-by-month walk — not a flat “late fee” spreadsheet.

## What this proves

Controllers often budget a single stacked percentage. Real rules walk months, reduce the file addition when both file and pay apply in the same month, optionally raise the pay rate after a levy-intent notice, and apply a minimum floor when a return is very late. This app encodes that stack as a workflow experiment.

**Not** an IRS notice, abatement tool, or CPA replacement. Commercial tax software and the IRS still win in production.

## Run locally

```bash
cd projects/filing-penalty-desk
npm install
npm test
npm start
```

## Try offline

Open [`try.html`](./try.html) in a browser (no server).

## Browser playground

https://stackblitz.com/fork/github/serhii-kucherenko/ai-method-lab/tree/main/projects/filing-penalty-desk?startScript=start

## Guide

Lessons from building this product: [`docs/guides/04-filing-penalty-desk-lessons.md`](../../docs/guides/04-filing-penalty-desk-lessons.md)

## Status

Sustained in the method lab (55 automated checks, 9 pages, 18 features).
