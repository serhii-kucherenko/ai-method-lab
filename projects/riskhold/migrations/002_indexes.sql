-- 002_indexes
CREATE INDEX idx_positions_book ON positions(book_id);
CREATE INDEX idx_clears_position ON position_clears(position_id);
