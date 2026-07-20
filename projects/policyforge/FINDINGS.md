# Policyforge Findings

## What we built
Packs (ACL) + rules (severity threshold) + violations (`open→waived|enforced`) + dual waive approvals + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules unit tests + health/ACL/severity gate/dual-waive path/direct enforce/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Dual-approver gate (owner + auditor) is a real cross-actor constraint — not a noun-swap of Screenlane.
- Severity threshold mirrors SLO-style domain rules from Datacontract without cloning its state machine.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`). Dual-approval is a reusable gate pattern with releasetrain/grantlane.
