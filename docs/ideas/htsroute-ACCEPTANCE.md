# htsroute — paper product acceptance (pre-build)

**Not a green light.** Same-day build still blocked. Use this bar *if/when* day-boundary flips `ready_to_build` (see `htsroute-DAY-BOUNDARY.md`). Vanity fixture counts alone never pass.

Tied to: unique claim (`htsroute-algorithm.md` / G6) + money honesty (`htsroute-VALUE-STAKES.md` / Challenge D) + Kill A framing (`htsroute-PRODUCT-FRAMING.md`).

---

## A. Must-pass unique-claim scenarios

Domain module implements `routeSku` per `htsroute-algorithm.md`. Product tests load **all** `docs/ideas/fixtures/htsroute-*.json` and expect matching routes. At minimum these scenarios must stay green:

| Scenario | Expected family | Why it is the claim |
|----------|-----------------|---------------------|
| Therapeutic bulk separately-defined chemical | **29** | Form gate, not molecule keyword |
| Therapeutic mixture, no measured dose / retail packing (pellets, powder, or drum shape) | **3003** | Middle path — HTS 3003 text; pellets CROSS example; fixtures #10 / #38 / #39 |
| Therapeutic + measured dose / retail + dose form | **3004** | Finished medicament path |
| Note 1(a) exclusion facts | **Note 1(a)** | Legal fence, not CRUD |
| Acetaminophen bulk (fixture #32) | **29** | Honest non-zero MFN contrast pair |
| Acetaminophen tablets (fixture #33) | **3004** | Paired with #32; not a PPI Free/Free pitch |
| Eluxadoline bulk (fixture #40) | **29** | Same-letter NY N302614; base MFN **6%** |
| Viberzi tablets (fixture #41) | **3004** | Same letter as #40; Free — honest delta pair |
| Vericiguat bulk (fixture #42) | **29** | Same-letter NY N318947; base MFN **6.5%** |
| Verquvo tablets (fixture #43) | **3004** | Same letter as #42; Free — honest delta pair |
| Finished PPI tablets with primary CROSS (e.g. #26 / NY N003244) | **3004** | Ruling-backed route, **not** a duty-savings claim |

Molecule name must not be an input. GRI 3 combinations stay out of scope (reject / fence).

---

## B. Must-reject cheats (anti-keyword / anti-theater)

These must **reject** (or hard-fail the test), never silently map to 29/3003/3004:

1. Dose-form enum present **without** measured dose / retail packing (tablet-without-dose cheat)
2. Bulk separately-defined **plus** measured-dose flags together (bulk+measured cheat)
3. Enteric pellets / intermediate facts forced toward **3004** retail (pellets+retail cheat)
4. Any path that treats dual-approver, capacity ceiling, or status-FSM as the “domain rule”
5. Keyword / synonym tables that skip form-and-mixing facts

Expert cheat cases from sustain bar: enum tablet without dose; bulk+measured; pellets+retail — all reject.

---

## C. Money-honesty checks (instant fail)

Acceptance **fails** if digests, PRODUCT.md, FINDINGS, try-demo copy, or marketing language:

1. Claims MFN **duty savings** for Protonix / pantoprazole / omeprazole (or peer PPI) showcase pairs where both legs are **Free** (Challenge D / VALUE-STAKES)
2. Presents fixture pass counts as market proof or “valuable product” evidence
3. Says the product “beats brokers” or “replaces commercial HS engines”
4. Cites acetaminophen **6.5% → Free** as guaranteed importer savings without GSP / preference caveat

Allowed (narrow): non-zero-base-MFN pairs may mention **base MFN vs Free finished** only with preference caveats from `htsroute-VALUE-STAKES.md` — acetaminophen, ibuprofen, aspirin, Eluxadoline/Viberzi (6%), Vericiguat/Verquvo (6.5%). Never PPI Free/Free as savings.

---

## D. Kill A digest line (required)

Every ship digest / FINDINGS / notify story that mentions htsroute must include a line equivalent to:

> Existing tools and brokers already do this commercially. This product is a method/workflow experiment.

Missing Kill A line → acceptance fail (even if fixtures are green).

---

## E. Dual-impl still green

Before any ready_to_build flip **and** before calling a phase “done”:

- `check-htsroute-fixtures.mjs` — all fixture files green
- `check-htsroute-dual.mjs` — dual-impl cross-check green

Single-impl green alone is not enough. Dual-impl drift → stay in research / fail the phase.

---

## F. Demo disclaimer present

If `demos/htsroute-try/` (or any try page) ships with the product story:

- README / page must state: research demo, **not** a product folder
- Money honesty visible: pantoprazole showcase pairs are often duty-free on both sides
- Must not celebrate fixture counts as product success

Absence of disclaimer → acceptance fail for that surface.

---

## Minimum smoke shape (when build is allowed)

- Tenancy: importer org + analyst identity
- Resources: SKU fact cards + route decisions (immutable once posted, or versioned)
- Workflow: draft facts → classify → locked route record
- Domain rule: **29 / 3003 / 3004 / Note 1(a) / reject** only (sections A–B)
- Webhook: route-locked event (HMAC)
- Pagination: list classifications
- Authz: analyst vs auditor roles (**not** dual-signer ceiling)

---

## Sustain bar (later)

- ≥25 unique-claim tests still green (fixtures + API negatives)
- Expert cheat cases (section B) still reject
- Concurrent two-SKU classify independence
- FINDINGS must say workflow experiment — not broker replacement (section D)
- Money-honesty checks (section C) still hold on every digest

---

## Explicit defer

Full 10-digit HTS, Section 301 dollar claims, GRI 3 UI, CSOS/Form 222.
