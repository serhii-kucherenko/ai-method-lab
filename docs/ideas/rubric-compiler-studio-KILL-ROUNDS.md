# Rubric Compiler Studio — kill rounds (ARS)

Grounded against `docs/ideas/rubric-compiler-studio-RELATED-WORKS.json` and seed arXiv:2601.08654.

## Kill 1 — Existing tools already solve this

**Attack:** Promptfoo, Braintrust, LangSmith, OpenAI Evals already run LLM judges; surveys like “LLMs-as-Judges” / “From Generation to Judgment” show the category is flooded.

**Answer:** Those tools **run** judges; they rarely **compile** human rubric intent into versioned, evidence-anchored, calibrated criteria with auditability as the core object. RULERS frames criteria-transfer as the hard problem - that is the wedge. If we only wrap another judge runner, accept this kill.

**Verdict:** answered (survive only if compiler + calibration + evidence locks ship as the product spine).

## Kill 2 — Too niche / infrequent

**Attack:** Only frontier labs care about rubric psychometrics; SMBs won’t pay.

**Answer:** Every team shipping agent evals hits flaky judges weekly. Guidelines papers for LLM judges show governance pressure rising. Frequency is “every eval release,” not annual accreditation. Niche is **serious** eval teams - acceptable ICP if A/B under business rubric.

**Verdict:** answered for B2B eval leads; killed for classroom/consumer grading toys.

## Kill 3 — Hard part is offline / social / legal

**Attack:** Rubric quality is politics and SME time; software can’t hold value.

**Answer:** Partially true. Software holds value where it **locks** agreed criteria, shows evidence anchors, and detects drift vs human raters. SME workshops stay human. Product refuses to pretend it replaces domain ownership.

**Verdict:** answered with fence - offline SME authoring remains; product owns lock/diff/calibration/audit.

## Outcome

Survives adversarial round **if** climb stays software-solvable B2B eval tooling and refuses device/clinical/retail costumes. Park if pack drifts into holistic “AI grader for schools” without a money hook.
