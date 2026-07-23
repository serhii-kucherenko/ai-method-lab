# Consult Bench Desk — findings

## What worked

- Cloning a mature Next desk and rebranding domain axes (text + image · real cases · cross-modal rubric) kept the sustain ladder intact while staying non-isomorphic to secure-tutor / joint-care / chest-xray / evidence-synthesis desks.
- Dual-impl scorers + regenerated goldens caught silent label drift after rename.
- Live `app-up` (build + `next start` GET `/`) blocked finish until the marketing landing actually served.
- Escaped paper-id regexes in tests (`2607\.09142`) do not match plain `2607.09305` replace pairs — patch both forms after a clone.

## What to watch

- Mechanical string rebrand can leave chest-xray / radiology / Thailand leftovers; scrub user-facing copy and honesty links after rename.
- Guide number must be the next free slot (`32-…`) when `31-…` is already taken.
- Never claim telemedicine product or brand MedRealMM as the product name.

## Dual-gate

Good path: real-world multimodal consult evaluation plans (text + image + real cases + cross-modal rubric).  
Naive baselines: text-only scoring; image-blind scoring; synthetic-chat-only benches.
