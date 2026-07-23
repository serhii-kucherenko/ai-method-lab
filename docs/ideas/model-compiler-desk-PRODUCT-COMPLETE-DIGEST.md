# Model Compiler Desk — product-complete digest (ready to send)

**Status:** Sustain green · 33 tests · 9 pages · 18 features · guide filed · try page on main  
**Blocker:** Resend returned Unauthorized — restore send path and deliver this letter.

**To:** kucherenko.web@gmail.com  
**From:** AI Method Lab \<onboarding@resend.dev\>  
**Subject:** [Method Lab] Results: Model Compiler Desk finished  
**Attachment:** `projects/model-compiler-desk/try.html` → `try-model-compiler-desk.html`  
**Idempotency:** `method-lab/product_complete/model-compiler-desk`

---

Outcome
Model Compiler Desk is finished. We built and fully tested a small software desk for planning and tracking how large language models get broken into layered compile steps — inspired by a public research paper, not as a replacement for the authors’ own compiler.

The idea
Teams that ship chat-style artificial intelligence models often treat “compile the model” as one opaque blob. That hides whether the work is modular. A public research paper describes compiling large language models with a layered compiler toolkit (a system people use to lower machine-learning models into efficient code), and the authors published working source code. We wanted to prove we could turn that idea into a small, testable product workflow: projects, compile jobs with honest status steps, a side-by-side compare of “one opaque unit” versus “layered passes,” an audit trail, and signed inbound updates — as a workflow experiment, not a claim that we beat commercial compilers or the authors’ system.

The project
Model Compiler Desk lives in the product folder under this lab. It is a small Node application with organizations, members and roles, projects, compile jobs, lifecycle rules, batch updates, scenario compare, audit export, signed webhooks, settings, nine web pages, automated tests, a project readme, a “what we learned” guide, and an offline try page.

What we built
- Organizations and member roles so only the right people can change settings
- Projects and compile jobs you can create, list, edit, and delete
- A clear job lifecycle from draft to queued to running to succeeded or failed, with illegal jumps rejected
- Protection against two people overwriting the same job at once
- Batch transitions that keep sibling jobs independent
- A scenario screen that compares a naive “opaque monolith” score with a layered-pass score
- An audit log and a downloadable spreadsheet export
- A browser of named golden examples (twenty-five or more)
- An honesty page that says commercial and author compilers still win in production
- Signed inbound job webhooks with duplicate protection
- Search, pagination, and gentle rate-limit feedback when you send too many requests
- An offline try page and an in-app link to the lessons guide

What we proved
- Thirty-three automated checks passed end to end
- Nine pages each have a critical-path check
- Eighteen user-visible features meet the maturity bar
- A large walk (hundreds of jobs), concurrent batches, and rate-limit behavior were exercised
- Framing stays honest: workflow experiment only — not the authors’ compiler and not a commercial launch claim

Summary
We took a paper about layered compilation for large language models, with public code, and turned it into a finished small desk you can open offline or in the browser playground. The point is to show the lab can pick a real paper and ship a mature, explained product — not to replace the researchers’ toolchain.

What did not change
Still not a commercial launch claim. Still not a drop-in replacement for the authors’ compiler. Still no shallow dual-approval status boards dressed up as depth.

Next
The lab will pick another implementable paper from the daily digest and start the next product the same way — after this email sends.

Try it
- Attachment: try-model-compiler-desk.html — download and open in your browser (offline demo; no server needed)
- Full project in the browser playground:
  https://stackblitz.com/fork/github/serhii-kucherenko/ai-method-lab/tree/main/projects/model-compiler-desk?startScript=start
- How to run: the project readme in projects/model-compiler-desk
- What we learned: docs/guides/05-model-compiler-desk-lessons.md
