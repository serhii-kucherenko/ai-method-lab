# tariffstep — G1 evidence notes

Purpose: anchor the idea in concrete, repeatable pain rather than generic “billing is hard” claims.

## Source-backed pain signals

1. **Demand ratchets can lock high bills for months after one short peak**
   - PNNL FEDS explains common ratchet design (`max(actual, % of historical peak)`), including 80% of prior high peak behavior.
   - Source: [https://feds.pnnl.gov/faq/what-demand-ratchet](https://feds.pnnl.gov/faq/what-demand-ratchet)

2. **Tier/block structures and demand components are standard tariff primitives**
   - CPUC training material describes tiered volumetric rates and tariff rules; larger non-residential tariffs include demand-based components.
   - Source: [https://webtraining.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates](https://webtraining.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates)

3. **Billing disputes are common enough to require formal regulator workflows**
   - PUCT/CPUC/PA PUC all document complaint processes specifically for billing disputes, with escalation from utility support to formal proceedings.
   - Sources:
     - [https://www.puc.texas.gov/consumer-help/complaints/complaint/](https://www.puc.texas.gov/consumer-help/complaints/complaint/)
     - [https://www.cpuc.ca.gov/consumer-support/file-a-complaint/utility-complaint](https://www.cpuc.ca.gov/consumer-support/file-a-complaint/utility-complaint)
     - [https://www.puc.pa.gov/complaints/](https://www.puc.pa.gov/complaints/)

## Research interpretation

- This supports a **real pain** narrative for verification and audit tooling around stepped-rate and ratchet calculations.
- It does **not** overturn Kill A (incumbent CIS tools exist). Framing remains method stress.
- Next evidence upgrade: collect 2-3 real tariff sheets and map our fixtures directly to published clauses.
