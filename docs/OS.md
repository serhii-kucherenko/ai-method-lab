# Operating system under test

End-to-end flow every approach must implement (compression varies by method card).

| Stage | Artifact / exit | Enterprise gate | Speed trick |
|-------|-----------------|-----------------|-------------|
| Idea / intake | Problem + success metric + non-goals | Reject vague ideas | One-paragraph template |
| Research | Options + decision | No silent assumptions | Time-box; docs-only |
| PRD | Stories + acceptance criteria | Testable AC; out-of-scope | PRD-lite for small slices |
| ERD / contracts | Schema, APIs, auth boundaries | Migrations / compatibility | Diff-only ERD |
| Plan / spikes | Tasks + DoD | Riskiest unknown first | Skip if risk known |
| Implement | Branch / worktree | No secrets; follow contracts | AI builds; human owns intent |
| Verify | Unit + contract + oracle + CI | Gates independent of agent | Fail fast |
| PR | Linked artifacts; checklist | CI green | Template fills links |
| Review | Human and/or adversarial AI | Security + scope | Auto-approve only low-risk |
| Merge + ship | Main green; rollback known | Trunk + flags when needed | Small slices |
| Learn | FINDINGS / backlog update | Promote only with scores | One note per cell |

## Team size (same stages, different owners)

| Size | Ownership pattern |
|------|-------------------|
| 1 + AI | Human: intake, PRD intent, merge. AI: drafts, impl, first review |
| 2 | A: product/accept. B: architecture/review. Both impl with AI |
| 3 | Intake, eng lead, builder(+AI); rotate review |
| 5 | Intake, design/data, 2 builders, review/QA lane; WIP limits |

**Scalability rule:** adding people must not rewrite stage contracts — only who signs each gate.
