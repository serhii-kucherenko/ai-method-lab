# Filing Penalty Desk — product-complete digest (ready to send)

**Status:** Sustained · 55 tests · 8 pages · 18 features · tutor guide filed  
**Blocker:** Resend MCP / API key not available in this environment — paste into email client or restore Resend and send.

**To:** kucherenko.web@gmail.com  
**From:** AI Method Lab \<onboarding@resend.dev\>  
**Subject:** [Method Lab] Results: Filing Penalty Desk finished  
**Attachment:** `projects/filing-penalty-desk/try.html` → filename `try-filing-penalty-desk.html`  
**Idempotency:** `method-lab/product_complete/filing-penalty-desk`

---

Outcome
Filing Penalty Desk finished — we built and fully tested a late-file and late-pay tax-addition forecast app with eighteen user-visible features.

The idea
Controllers often budget a flat “late fee.” Real rules stack failure-to-file and failure-to-pay additions on net amounts due, reduce the file addition when both apply in the same month, optionally raise the pay rate after a levy-intent notice, and apply a minimum floor when a return is very late. Spreadsheets invent or hide cash. We set out to prove that stack can be encoded and tested end to end as a workflow experiment — not to replace the IRS or a CPA.

The project
Filing Penalty Desk is a Node app under projects/filing-penalty-desk: organizations, return timelines, statutory addition forecasts, scenario compare, batch runs, audit export, signed webhooks, eight web pages, and automated tests. Display name is human; statute codes are not the brand.

What we built
- A month-walk forecast that returns file addition, pay addition, combined total, and which branch applied
- Catalog and detail screens to edit facts and run a forecast
- Scenario compare of naive flat fee versus the correct month-walk
- Role rules so auditors can read and forecast but cannot edit records
- Independent batch forecasts and an audit trail with CSV export
- Signed inbound webhooks with duplicate protection, pagination, search, and org settings
- Honesty page stating IRS and tax software still win commercially
- Offline try page for the core addition math
- In-app link to the tutor lessons guide

What we proved
- Twenty-five named golden scenarios passed (including reject paths for flat forever, dual-approver, and other cheats)
- Full product test ladder passed (55 automated checks)
- Eight live pages each have a critical-path check
- Eighteen user-visible features meet the maturity bar
- Framing: workflow experiment only — not an IRS or CPA replacement

What did not change
Still not a commercial launch claim. Still no shallow dual-approval product queue. Still no statute-code product brand.

Next
Research continues on the next mature, differentiated idea — still researching before any new product folder.

Try it
- Attachment: try-filing-penalty-desk.html — download and open in your browser (offline demo)
- Full project in the browser:
  https://stackblitz.com/fork/github/serhii-kucherenko/ai-method-lab/tree/main/projects/filing-penalty-desk?startScript=start
