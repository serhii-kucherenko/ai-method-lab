# Oracle — P-crud-001

Agents must not edit this file during a cell run.

## Required behaviors

1. Permission matrix enforced for owner / member / viewer on Project, Task, Comment
2. Viewer cannot mutate; member can mutate tasks/comments per brief; owner can manage members
3. At least one schema migration applied after initial create
4. Negative permission tests exist and pass

## Fail tags

`rbac-broken` · `migration-missing` · `no-negative-tests` · `approach-violation`
