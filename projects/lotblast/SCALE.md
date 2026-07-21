# Scale notes — lotblast

List queries use `ORDER BY tlc LIMIT ? OFFSET ?` on indexed `plant_id` (`idx_lots_plant`).

Cost per page is O(limit + offset scan within plant), not O(n²) joins. Full walks use fixed page size; `limit` is capped at 100 with default 20.
