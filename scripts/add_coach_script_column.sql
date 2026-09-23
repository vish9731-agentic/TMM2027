-- Migration to add strategy_splits and coach_script to Supabase daily_workouts
ALTER TABLE daily_workouts ADD COLUMN IF NOT EXISTS strategy_splits JSONB;
ALTER TABLE daily_workouts ADD COLUMN IF NOT EXISTS coach_script JSONB;
