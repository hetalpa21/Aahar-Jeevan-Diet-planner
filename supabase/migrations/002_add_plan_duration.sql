-- Add plan duration tracking columns to patients table
ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS plan_start_date DATE,
  ADD COLUMN IF NOT EXISTS plan_duration_months INTEGER,
  ADD COLUMN IF NOT EXISTS plan_end_date DATE;
