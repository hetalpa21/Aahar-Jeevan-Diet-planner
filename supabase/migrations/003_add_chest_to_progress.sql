-- Add chest column to progress_entries table
ALTER TABLE progress_entries ADD COLUMN IF NOT EXISTS chest NUMERIC;
