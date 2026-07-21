# Autonomous controller

**Default mode for this lab.** Experiment by building products under `projects/`. After any product phase finishes (score + findings), immediately start the next phase or next queued product. Do **not** ask the human to confirm.

Human contact is allowed only for **hard stops** (see below).

## Goal

Prove the workflow can produce **few, deep, comprehensive products**. Prefer slow research and idea verification (`protocols/IDEA_DEPTH.md`) over starting another project. Build only ideas that reach `ready_to_build`. Use promoted workflow (`docs/DEVELOPMENT_WORKFLOW.md`) inside products. See `docs/DEPTH_RESTART.md`.

## State file

Read/write: `matrix/CONTROLLER.json`

| Field | Meaning |
|-------|---------|
| `mode` | `autonomous` \| `paused` \| `hard_stop` |
| `current_cell` | Phase cell id in flight, or `null` |
| `current_product` | Product id under `projects/`, or `null` |
| `current_idea` | Idea id under `docs/ideas/`, or `null` |
| `phase` | `idle` \| `research` \| `running` \| `scoring` \| `learning` \| `starting_next` |
| `next_cell` | Next backlog cell id |
| `last_completed` | Last scored cell id |
| `ask_human` | Always `false` unless hard stop |
| `hard_stop_reason` | Set only on hard stop |
| `notify` | Resend digest config — see `protocols/NOTIFY.md` |
| `depth_policy` | When set, block isomorphic dual-gate product starts |

## Loop (one tick)

1. Load `matrix/CONTROLLER.json`. If `mode` is `paused` or `hard_stop`, stop.
2. If `phase` is `research`: execute one IDEA_DEPTH tick on `current_idea` (docs only). Update dossier + RESEARCH. Do **not** create/extend product trees. Then go to step 7.
3. If `phase` is `running` / `scoring` / `learning` for `current_cell`, **resume that phase** — do not start another.
4. If idle: take highest-priority **ready_to_build** idea from `docs/BACKLOG.md`, or continue research if none. Never queue isomorphic dual-gate clones. Set `current_product` / `current_idea`, `current_cell`, `phase` accordingly.
5. For products: execute `protocols/PRODUCT_RUNBOOK.md` (preferred) or legacy `protocols/RUNBOOK.md` for sandbox A/B cells only.
6. Write scores/findings; update portfolio. For research ticks: append `docs/RESEARCH.md` with a skeptical summary (G6).
7. Mark backlog progress. Set `last_completed`, advance idea state or clear cell, `phase: starting_next` or stay in `research`.
8. **Notify** if configured (`protocols/NOTIFY.md`). Non-blocking.
9. **Without waiting:** next research gate, next product phase, or next **ready_to_build** idea — never the next noun-swap.
10. When a product sustains: email a **depth** findings digest per `protocols/NOTIFY.md` (claim + test ladder + framing **in plain language in the body**, no acronyms or internal codes, not a link dump); return to research before queuing another product.
11. When method ladder work remains (rare): continue approach cells; with `auto_promote`, apply `METHOD_DEFAULTS` without asking.

## Mid-phase failure

- Approach/process bug → `MIDTERM_CHANGE.md` + `TRIPLE_TEST.md`, then continue.
- Flaky product tests → retry up to **2** times; then score fail, document in product FINDINGS, decide continue/abandon per hypothesis falsifiers.

## Hard stops

Set `mode: hard_stop`, `ask_human: true`, reason in state + FINDINGS:

1. Secret / credential required that is not in the environment
2. Destructive action outside `projects/` / `sandboxes/` (e.g. force-push, deleting unrelated repos)
3. Controller JSON corrupted and cannot be repaired safely
4. Explicit human message: pause / stop

## Merge + ship policy (mandatory)

When `defaults.always_commit`, `always_push`, and `always_merge` are true:

1. **Commit** after every scored phase, product update, or meta change
2. **Push** to `origin/main` immediately
3. **Merge** controller PRs when CI green — never leave merge-ready PRs open

Never force-push `main`.

## Defaults when the approach card is silent

- Stack: Node + TypeScript, HTTP API, SQLite or memory, Vitest or node:test; minimal web UI for sustain
- Work in `projects/<id>/` for portfolio products
- Commit product source + matrix scores after green tests

## Saved wake prompt

See `docs/AUTOMATION.md`.
