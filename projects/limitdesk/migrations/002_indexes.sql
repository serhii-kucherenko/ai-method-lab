-- 002_indexes
CREATE INDEX idx_lines_desk ON credit_lines(desk_id);
CREATE INDEX idx_draws_line ON draws(line_id);
CREATE INDEX idx_releases_draw ON draw_releases(draw_id);
