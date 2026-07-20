# Sandboxes

Optional **short-lived** approach A/B working trees:

```text
sandboxes/<cell_id>/
```

Portfolio products live under **`projects/<id>/`** — that is the durable testing folder.

Use sandboxes only when comparing methods without polluting a product tree. Scores still go to `matrix/`. Sandbox contents are gitignored; product source in `projects/` is committed.
