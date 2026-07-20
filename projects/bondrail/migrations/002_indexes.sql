-- 002_indexes
CREATE INDEX idx_bonds_workspace ON bonds(workspace_id);
CREATE INDEX idx_draws_bond ON draws(bond_id);
CREATE INDEX idx_releases_draw ON draw_releases(draw_id);
