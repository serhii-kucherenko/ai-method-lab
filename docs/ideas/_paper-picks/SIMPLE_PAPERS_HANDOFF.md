# simple-papers handoff — people / recruiter scoring (2026-07-26)

## Why

Method Lab screened **1944** papers and shortlisted **top 10 + 5 adjacent** for scoring people with rubrics (recruiters first, then education / LLM judges / fairness / psychometrics).

simple-papers is the intake source for Method Lab. This folder is the **import package** so those papers enter digests.

## Drop into simple-papers

Copy the digest JSON into the simple-papers repo:

```bash
cp docs/ideas/_paper-picks/digests/2026-07-26.json \
  "$SIMPLE_PAPERS_ROOT/data/digests/2026-07-26-people-scoring.json"
# or merge into that day's digest if one already exists
```

Suggested commit message in simple-papers:

> Add people-scoring rubric shortlist from Method Lab screen

## Contents

| File | Role |
| --- | --- |
| `digests/2026-07-26.json` | Digest-shaped papers with `tags`, `impact.forTech`, `code.url` when known |
| This README | Import instructions |

## Theme stack (for digest tags / topics)

`recruiting` · `rubrics` · `llm-judge` · `fairness` · `psychometrics` · `person-job-fit` · `interview-scoring`

## Source write-up

- Research log: `docs/RESEARCH.md` (2026-07-26 section)
- PR: https://github.com/serhii-kucherenko/ai-method-lab/pull/6

## Do not

- Do not open a Method Lab product from this seed while another product is in flight.
- Prefer papers with `code.url` when picking for build.
