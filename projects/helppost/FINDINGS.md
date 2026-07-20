# Helppost Findings

## What worked
- A03+A10 sustained a help-request product: boards ACL, posted→claimed→resolved — **19/19**.

## What failed / was brittle
- Entity singular `request` collided with the transition response alias `{ request, clip }` → duplicate keys. Fixed by keeping a single `request` field. Prefer entity names other than `request` in future clones.

## Method notes for the matrix
- Helppost is portfolio evidence #49 for A03+A10.
