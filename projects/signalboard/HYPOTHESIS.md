# Hypothesis — signalboard

```yaml
product_id: signalboard
workflow: A03+A05
started: 2026-07-20
```

## Claim

A03 test-first plus **A05 adversarial review** improves security outcomes on a public status board versus A03 alone (evidence: explicit adversary pass on authz/IDOR).

## Success metrics

1. Phase oracles green
2. ADVERSARIAL_REVIEW.md present and resolved/waived per phase when A05 applies
3. Interventions ≤ 1 per phase
4. Sustain criteria met

## Falsifiers

Repeated correctness failure; midterm method change; abandoned sustain
