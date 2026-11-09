-- SUPABASE MIGRATION: Add actual_splits and heart rate columns to daily_workouts
-- Run this in the Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/xtdfhxczdlgyhkqsltyq/sql/new)

ALTER TABLE daily_workouts 
ADD COLUMN IF NOT EXISTS actual_splits JSONB,
ADD COLUMN IF NOT EXISTS avg_heart_rate INT,
ADD COLUMN IF NOT EXISTS max_heart_rate INT,
ADD COLUMN IF NOT EXISTS actual_duration_min NUMERIC(6, 2),
ADD COLUMN IF NOT EXISTS distance_variance_km NUMERIC(5, 2),
ADD COLUMN IF NOT EXISTS pace_variance_sec INT,
ADD COLUMN IF NOT EXISTS compliance_score_pct INT,
ADD COLUMN IF NOT EXISTS ingestion_source VARCHAR(50);

-- Comment on columns for documentation
COMMENT ON COLUMN daily_workouts.actual_splits IS 'Per-kilometer splits parsed from Strava/Galaxy Watch (split, distance, pace, duration, HR, elevation)';
COMMENT ON COLUMN daily_workouts.avg_heart_rate IS 'Average heart rate (BPM) recorded during the workout';
COMMENT ON COLUMN daily_workouts.max_heart_rate IS 'Maximum/peak heart rate (BPM) recorded during the workout';
