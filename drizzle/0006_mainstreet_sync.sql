-- Add MainStreet sync fields to sessions table
ALTER TABLE sessions ADD COLUMN location_name TEXT;
ALTER TABLE sessions ADD COLUMN session_name TEXT;
ALTER TABLE sessions ADD COLUMN duration TEXT;
ALTER TABLE sessions ADD COLUMN mainstreet_url TEXT;
ALTER TABLE sessions ADD COLUMN mainstreet_id TEXT;
ALTER TABLE sessions ADD COLUMN synced_at INTEGER;

-- Make class_id and location_id nullable for synced sessions
-- SQLite doesn't support ALTER COLUMN, so we'll handle this in app logic
