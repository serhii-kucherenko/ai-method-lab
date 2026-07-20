# Chessclub Findings

## What worked
- A03+A10 sustained a chess-match product: clubs ACL, paired→playing→scored — **19/19**.

## What failed / was brittle
- Entity `Match` renamed `transitionClip` → `transitionMatch`, which shadowed the local regex variable `transitionMatch`. Fixed by renaming the regex binding to `transitionPath`.

## Method notes for the matrix
- Chessclub is portfolio evidence #62 for A03+A10. Avoid entity names that collide with `transition*` + regex `*Match` locals.
