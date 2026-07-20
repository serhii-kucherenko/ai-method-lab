-- 002_indexes
CREATE INDEX idx_bookings_calendar ON bookings(calendar_id);
CREATE INDEX idx_overrides_booking ON booking_overrides(booking_id);
CREATE INDEX idx_bookings_range ON bookings(calendar_id, starts_at, ends_at);
