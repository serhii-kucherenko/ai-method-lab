# amendwin — Kill A challenge (EDC already does this)

## Claim under test

Medidata Rave / Veeva already solve amendment-aware visit windows, so amendwin is pointless.

## Evidence

- Rave **Amendment Manager** migrates subjects between CRF versions (OID mapping, dry-run, audit). Edit checks can “Bypass During Migration.”
- HPTN 084 SSP defines target days + allowable windows in Rave retention reporting terms.
- Industry still reports PD data fragmented across EDC/CTMS/Excel (PHUSE 2025; vendor commentary on FDA Dec 2024 draft).

## Outcome

**Kill A stands for GTM** — do not claim undiscovered market.

**Kill A fails as method-stress blocker** — unique claim is deterministic **version-at-visit-date** scoring + **non-retroactive lock**, with golden fixtures. Rave migration is a heavy ops process; the lab tests whether A03+A10 can sustain the temporal invariant without dual-gate collapse.

Digests must say method stress, not “better than Medidata.”
