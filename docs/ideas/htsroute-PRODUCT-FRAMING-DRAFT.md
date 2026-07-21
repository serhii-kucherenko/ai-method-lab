# htsroute — PRODUCT framing draft (paper only)

**Not a build ticket.** Do not create `projects/htsroute/` from this file.  
Use only if day-boundary reassess flips to ready_to_build (`htsroute-DAY-BOUNDARY.md`).

## One sentence

A small workflow experiment that routes pharma SKU fact cards to Chapter 29 / heading 3003 / heading 3004 (or reject / Note 1(a) exclusion) using form and mixing facts — never molecule-name keywords.

## Who / pain

Trade-compliance analysts classifying specialty pharma SKUs. Continuous catalog work. Painful workaround: broker email + CROSS search + spreadsheets keyed on molecule names.

## Unique claim (must appear in PRODUCT.md if built)

29 / 3003 / 3004 form-and-mixing gate + Note 1(a) + consistency rejects. Omeprazole pellet intermediate must land 3003. Molecule name is not an input.

## Forbidden claims (digests + README)

- “Saves duty on pantoprazole / omeprazole” (often Free/Free MFN)  
- “Replaces brokers / classification engines” (Kill A stands)  
- Dual-approver / capacity / days-ceiling shapes  

## Allowed value language

- Reasonable-care audit trail for form-gate decisions  
- Correct chapter/heading family before statistical suffix work  
- Conditional MFN contrast: acetaminophen bulk base **6.5%** (NY R04092) vs finished 3004 Free — with preference-program caveat  

## First build slice (if ever)

Port paper algorithm + existing goldens into product tests; no UI vanity; no dual-gate CRUD template.

## Framing label

**Workflow experiment / method stress** — not a commercial launch claim.
