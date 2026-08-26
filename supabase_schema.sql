-- ==============================================================================
-- SUPABASE / POSTGRESQL SCHEMA & SEED DATA
-- 22-Week Marathon Training Plan (Tata Mumbai Marathon 2027)
-- ==============================================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS training_phases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_week INT NOT NULL,
    end_week INT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS training_weeks (
    week_number INT PRIMARY KEY,
    phase_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_planned_km NUMERIC(5, 2) NOT NULL,
    is_deload BOOLEAN DEFAULT FALSE,
    focus TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_workouts (
    id SERIAL PRIMARY KEY,
    week_number INT REFERENCES training_weeks(week_number) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL,
    workout_date DATE NOT NULL,
    workout_type VARCHAR(50) NOT NULL,
    distance_km NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    target_pace VARCHAR(100),
    rpe_target INT,
    description TEXT,
    strength_prehab TEXT,
    fueling_hydration_strategy TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    actual_distance_km NUMERIC(5, 2),
    actual_pace VARCHAR(50),
    actual_rpe INT,
    athlete_notes TEXT,
    actual_duration_min NUMERIC(6, 2),
    distance_variance_km NUMERIC(5, 2),
    pace_variance_sec INT,
    compliance_score_pct INT,
    ingestion_source VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS race_targets (
    id SERIAL PRIMARY KEY,
    race_name VARCHAR(100) NOT NULL,
    race_date DATE NOT NULL,
    target_finish_time VARCHAR(20) NOT NULL,
    target_pace VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_daily_workouts_date ON daily_workouts(workout_date);
CREATE INDEX IF NOT EXISTS idx_daily_workouts_week ON daily_workouts(week_number);
CREATE INDEX IF NOT EXISTS idx_daily_workouts_type ON daily_workouts(workout_type);

-- 2. Insert Race Target
INSERT INTO race_targets (race_name, race_date, target_finish_time, target_pace)
VALUES ('Tata Mumbai Marathon 2027', '2027-01-17', '04:59:59', '7:06 min/km')
ON CONFLICT DO NOTHING;

-- 3. Insert Training Phases
INSERT INTO training_phases (id, name, start_week, end_week, description)
VALUES (1, 'Phase 1: Prep & Foundation', 1, 4, 'Establish 4-day weekly habit, build calf resilience (eccentric loading), core stability for lower back, adapt tendons.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO training_phases (id, name, start_week, end_week, description)
VALUES (2, 'Phase 2: Aerobic Base Building', 5, 12, 'Expand mitochondrial density, overcome the 18-20k calf cramp barrier with hydration/electrolytes, Pedder road hill repeats, 10K time trial benchmark.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO training_phases (id, name, start_week, end_week, description)
VALUES (3, 'Phase 3: Peak & Race Specificity', 13, 19, 'Peak volume tolerance, Marathon Pace threshold endurance, Half Marathon simulation, Peak 32 km Long Run.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO training_phases (id, name, start_week, end_week, description)
VALUES (4, 'Phase 4: Taper & Race Execution', 20, 22, 'Glycogen restoration, cellular repair, short sharp MP strides, race logistics and execution at Tata Mumbai Marathon.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 4. Insert Training Weeks
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (1, 'Prep & Foundation', '2026-08-17', '2026-08-23', 21, FALSE, 'Establishing 4-day rhythm & calf strength baseline')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (2, 'Prep & Foundation', '2026-08-24', '2026-08-30', 24, FALSE, 'Introducing hill form & tempo strides')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (3, 'Prep & Foundation', '2026-08-31', '2026-09-06', 27, FALSE, 'First double-digit long run + hydration & salt capsule test')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (4, 'Prep & Foundation', '2026-09-07', '2026-09-13', 20, TRUE, 'DELOAD WEEK 1: Neuromuscular recovery & soft-tissue adaptation')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (5, 'Aerobic Base Building', '2026-09-14', '2026-09-20', 29, FALSE, 'Aerobic base expansion; introducing 400m intervals')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (6, 'Aerobic Base Building', '2026-09-21', '2026-09-27', 33, FALSE, 'Pedder Road hill simulation workout #1')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (7, 'Aerobic Base Building', '2026-09-28', '2026-10-04', 37, FALSE, 'Long run nutrition & electrolyte test (400mg Na/hr)')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (8, 'Aerobic Base Building', '2026-10-05', '2026-10-11', 26, TRUE, 'DELOAD WEEK 2: Mid-Base 10K Time Trial Benchmark (Aim: Sub-59 min)')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (9, 'Aerobic Base Building', '2026-10-12', '2026-10-18', 41.1, FALSE, 'PROCAM SLAM #1: Vedanta Delhi Half Marathon (VDHM) — Non-Tapered Training Effort')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (10, 'Aerobic Base Building', '2026-10-19', '2026-10-25', 42, FALSE, 'Breaking the 20K barrier @ 7:30-7:45 min/km')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (11, 'Aerobic Base Building', '2026-10-26', '2026-11-01', 45, FALSE, 'Sustained aerobic volume + 1K speed repeats')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (12, 'Aerobic Base Building', '2026-11-02', '2026-11-08', 32, TRUE, 'DELOAD WEEK 3: Mid-program reset & musculoskeletal check')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (13, 'Peak & Race Specificity', '2026-11-09', '2026-11-15', 46, FALSE, 'Peak phase opening; Marathon Pace threshold blocks')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (14, 'Peak & Race Specificity', '2026-11-16', '2026-11-22', 40, FALSE, 'HALF MARATHON RACE SIMULATION (Aim: 2:23-2:27)')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (15, 'Peak & Race Specificity', '2026-11-23', '2026-11-29', 50, FALSE, 'High volume peak week; Pedder Road Hill Attack; 26 km Long Run')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (16, 'Peak & Race Specificity', '2026-11-30', '2026-12-06', 36, TRUE, 'DELOAD WEEK 4: Pre-peak recovery & glycogen store refresh')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (17, 'Peak & Race Specificity', '2026-12-07', '2026-12-13', 55.0, FALSE, 'Heavy volume builder; 30 km Peak Distance Long Run')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (18, 'Peak & Race Specificity', '2026-12-14', '2026-12-20', 49.0, FALSE, 'PROCAM SLAM #2: Tata Steel World 25K Kolkata — Marathon Pace Dress Rehearsal')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (19, 'Peak & Race Specificity', '2026-12-21', '2026-12-27', 46, FALSE, 'Post-peak consolidation run (24 km Long Run)')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (20, 'Taper & Race Execution', '2026-12-28', '2027-01-03', 35, TRUE, 'TAPER WEEK 1: 35% Volume Reduction; Glycogen supercompensation begins')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (21, 'Taper & Race Execution', '2027-01-04', '2027-01-10', 26, TRUE, 'TAPER WEEK 2: 55% Volume Reduction; Final race gear rehearsal')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES (22, 'Taper & Race Execution', '2027-01-11', '2027-01-17', 54.2, FALSE, 'RACE WEEK: TATA MUMBAI MARATHON 2027 (Sub-5:00:00 Target: 4:58:30)')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;

-- 5. Insert Daily Workouts
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (1, 'Monday', '2026-08-17', 'Recovery Run', 4.0, '7:50 - 8:10 min/km', 2, 'Short easy shakeout run to start the cycle.', 'Post-run calf & hip flexor stretches (15 mins)', 'Hydration with water post-run');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (1, 'Tuesday', '2026-08-18', 'Strength Day 1', 0.0, 'N/A', 5, 'Lower Body & Calf Armor.', 'Single-leg eccentric heel drops (3x15/leg), seated calf raises (3x15), Bulgarian split squats (3x8/leg), glute bridges (3x12/leg), tibialis wall raises (3x20).', 'Adequate protein intake');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (1, 'Wednesday', '2026-08-19', 'Speed (Strides)', 5, '7:45 warmup/cooldown, ~5:30 strides', 6, '1.5 km warmup, 5x100m fast relaxed strides with 90s walk rest, 2 km cooldown.', 'Hamstring and calf dynamic stretches', 'Light carbs pre-run');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (1, 'Thursday', '2026-08-20', 'Strength Day 2', 0.0, 'N/A', 5, 'Posterior Chain & Core Stability.', 'Romanian Deadlifts (3x10), Bird-dogs (3x10/side with 3s hold), Side planks (3x35s/side), Deadbugs (3x12), Back extensions (3x12).', 'Normal balanced diet');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (1, 'Friday', '2026-08-21', 'Speed (Strides)', 5.0, '7:45 warmup/cooldown, ~5:30 strides', 6, '1.5 km warmup, 5x100m fast relaxed strides with 90s walk rest, 2 km cooldown.', 'Hamstring and calf dynamic stretches', 'Light carbs pre-run');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (1, 'Saturday', '2026-08-22', 'Rest', 0.0, 'N/A', 1, 'Complete rest day before long run.', 'Light walking / gentle stretching only', 'Hydrate well with 2-2.5L fluids');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (1, 'Sunday', '2026-08-23', 'Long Run', 7.0, '7:35 - 7:45 min/km', 3, 'Week 1 long run. Focus on relaxed breathing, light foot strikes, and time on feet.', 'Post-run 10-min calf and quad flush', 'Water sips every 2 km');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (2, 'Monday', '2026-08-24', 'Recovery Run', 4.5, '7:50 - 8:10 min/km', 2, 'Gentle recovery run.', 'Calf stretching on step', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (2, 'Tuesday', '2026-08-25', 'Strength Day 1', 0.0, 'N/A', 5, 'Lower Body & Calf Armor.', 'Eccentric heel drops (3x15), seated soleus raises (3x15), split squats, glute bridges, tibialis raises.', 'Protein & carbs');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (2, 'Wednesday', '2026-08-26', 'Speed (Hill Intro)', 6, '7:45 warmup/cooldown, uphill RPE 7-8', 7, '2 km warmup, 4x60-sec steady uphill repeats (focus on posture & high knees, jog down recovery), 2 km cooldown.', 'Calf & Achilles dynamic activation', 'Banana/toast 45 min before');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (2, 'Thursday', '2026-08-27', 'Strength Day 2', 0.0, 'N/A', 5, 'Posterior Chain & Core.', 'RDLs, Bird-dogs, Side planks, Deadbugs, Supermans.', 'Balanced nutrition');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (2, 'Friday', '2026-08-28', 'Speed (Hill Intro)', 6.0, '7:45 warmup/cooldown, uphill RPE 7-8', 7, '2 km warmup, 4x60-sec steady uphill repeats (focus on posture & high knees, jog down recovery), 2 km cooldown.', 'Calf & Achilles dynamic activation', 'Banana/toast 45 min before');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (2, 'Saturday', '2026-08-29', 'Rest', 0.0, 'N/A', 1, 'Complete Rest.', 'Foam roll quads & glutes', 'Hydration tracking');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (2, 'Sunday', '2026-08-30', 'Long Run', 8.0, '7:30 - 7:45 min/km', 3, 'Long run. Test 1st Energy Gel at 45-min mark with water.', 'Post-run calf massage', '1 Energy Gel at 45 min + water sips');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (3, 'Monday', '2026-08-31', 'Recovery Run', 5.0, '7:50 - 8:10 min/km', 2, 'Easy recovery jog.', 'Hip & calf flush', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (3, 'Tuesday', '2026-09-01', 'Strength Day 1', 0.0, 'N/A', 5, 'Lower Body & Calf Armor (Add 2.5kg weight).', 'Eccentric heel drops, soleus raises, lunges, glute bridges, tibialis raises.', 'Protein');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (3, 'Wednesday', '2026-09-02', 'Speed (Tempo Intro)', 6, '6:30 min/km tempo intervals', 7, '1.5 km warmup, 3x1 km @ Tempo Pace (6:30 min/km) with 2 min walk rest, 1.5 km cooldown.', 'Hamstring dynamic swings', 'Carb snack pre-run');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (3, 'Thursday', '2026-09-03', 'Strength Day 2', 0.0, 'N/A', 5, 'Posterior Chain & Core.', 'RDLs, Bird-dogs, Side planks, Pallof press, Supermans.', 'Balanced nutrition');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (3, 'Friday', '2026-09-04', 'Speed (Tempo Intro)', 6.0, '6:30 min/km tempo intervals', 7, '1.5 km warmup, 3x1 km @ Tempo Pace (6:30 min/km) with 2 min walk rest, 1.5 km cooldown.', 'Hamstring dynamic swings', 'Carb snack pre-run');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (3, 'Saturday', '2026-09-05', 'Rest', 0.0, 'N/A', 1, 'Rest & hydrate for 10k long run.', 'Light stretching', 'Electrolyte drink');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (3, 'Sunday', '2026-09-06', 'Long Run', 10.0, '7:30 - 7:45 min/km', 4, 'First 10 km long run. Take 1 Gel at km 6 + 1 Salt capsule at km 5.', 'Post-run calf and hamstring stretch', '1 Gel at km 6 + 1 Salt capsule at km 5 + water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (4, 'Monday', '2026-09-07', 'Recovery Run', 4.0, '8:00 min/km', 2, 'Very easy recovery jog.', 'Gentle foam rolling', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (4, 'Tuesday', '2026-09-08', 'Strength Day 1', 0.0, 'N/A', 4, 'Light bodyweight mobility & calf activation (2x10 reps).', 'Bodyweight only', 'Nutritious recovery meals');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (4, 'Wednesday', '2026-09-09', 'Speed (Strides)', 4, '7:45 warmup, strides', 5, '2 km easy, 4x100m relaxed strides, 1.5 km easy.', 'Dynamic leg swings', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (4, 'Thursday', '2026-09-10', 'Strength Day 2', 0.0, 'N/A', 4, 'Light core & spine stabilization.', 'Bird-dogs, deadbugs, side planks (2 sets)', 'Balanced diet');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (4, 'Friday', '2026-09-11', 'Speed (Strides)', 4.0, '7:45 warmup, strides', 5, '2 km easy, 4x100m relaxed strides, 1.5 km easy.', 'Dynamic leg swings', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (4, 'Saturday', '2026-09-12', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Sleep 8+ hours', 'Hydration');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (4, 'Sunday', '2026-09-13', 'Long Run', 7.0, '7:40 - 7:50 min/km', 3, 'Deload long run. Low heart rate, super easy effort.', 'Calf stretching', 'Water sips');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (5, 'Monday', '2026-09-14', 'Recovery Run', 5.0, '7:50 min/km', 2, 'Recovery run.', 'Calf & hamstring flush', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (5, 'Tuesday', '2026-09-15', 'Strength Day 1', 0.0, 'N/A', 5, 'Lower Body & Calf Armor (3x15 eccentric drops).', 'Heel drops, soleus raises, split squats, glute bridges, tibialis raises.', 'Protein');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (5, 'Wednesday', '2026-09-16', 'Speed (Intervals)', 6, '5:50 min/km intervals', 7, '1.5 km warmup, 4x400m @ 5:50 min/km (200m jog rest), 2 km cooldown.', 'Calf dynamic prep', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (5, 'Thursday', '2026-09-17', 'Strength Day 2', 0.0, 'N/A', 5, 'Posterior Chain & Core.', 'RDLs, Bird-dogs, Side planks, Pallof press.', 'Balanced diet');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (5, 'Friday', '2026-09-18', 'Speed (Intervals)', 6.0, '5:50 min/km intervals', 7, '1.5 km warmup, 4x400m @ 5:50 min/km (200m jog rest), 2 km cooldown.', 'Calf dynamic prep', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (5, 'Saturday', '2026-09-19', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Mobility work', 'Hydration');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (5, 'Sunday', '2026-09-20', 'Long Run', 12.0, '7:30 - 7:45 min/km', 4, '12 km long run. Gels at km 5 and 10; salt capsule at km 6.', 'Post-run calf recovery', '2 Gels + 1 Salt capsule + water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (6, 'Monday', '2026-09-21', 'Recovery Run', 5.0, '7:50 min/km', 2, 'Easy recovery run.', 'Calf & hip stretch', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (6, 'Tuesday', '2026-09-22', 'Strength Day 1', 0.0, 'N/A', 5, 'Lower Body & Calf Armor.', 'Eccentric heel drops (weighted), soleus raises, split squats, glute bridges, tibialis raises.', 'Protein');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (6, 'Wednesday', '2026-09-23', 'Speed (Hill Repeats)', 7, 'Uphill RPE 8, cooldown 7:45', 8, '2 km warmup, 5x90-sec steady uphill repeats (focus on glute drive, jog down recovery), 2 km cooldown.', 'Calf & Achilles prep', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (6, 'Thursday', '2026-09-24', 'Strength Day 2', 0.0, 'N/A', 5, 'Posterior Chain & Core.', 'RDLs, Bird-dogs, Side planks, Supermans.', 'Balanced nutrition');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (6, 'Friday', '2026-09-25', 'Speed (Hill Repeats)', 7.0, 'Uphill RPE 8, cooldown 7:45', 8, '2 km warmup, 5x90-sec steady uphill repeats (focus on glute drive, jog down recovery), 2 km cooldown.', 'Calf & Achilles prep', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (6, 'Saturday', '2026-09-26', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Gentle stretching', 'Electrolyte hydration');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (6, 'Sunday', '2026-09-27', 'Long Run', 14.0, '7:30 - 7:45 min/km', 4, '14 km long run with full hydration vest test.', 'Post-run calf flush', '2 Gels (km 5, 10) + 1 Salt capsule (km 6) + 1L water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (7, 'Monday', '2026-09-28', 'Recovery Run', 6.0, '7:50 min/km', 2, 'Easy recovery run.', 'Foam rolling calves & quads', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (7, 'Tuesday', '2026-09-29', 'Strength Day 1', 0.0, 'N/A', 5, 'Lower Body & Calf Armor.', 'Eccentric heel drops, soleus raises, split squats, glute bridges, tibialis raises.', 'Protein');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (7, 'Wednesday', '2026-09-30', 'Speed (Threshold Tempo)', 7, '6:25 - 6:35 min/km tempo', 7, '1.5 km warmup, 4 km continuous @ Tempo (6:25-6:35 min/km), 1.5 km cooldown.', 'Hamstring & calf dynamic stretches', 'Carb snack pre-run');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (7, 'Thursday', '2026-10-01', 'Strength Day 2', 0.0, 'N/A', 5, 'Posterior Chain & Core.', 'RDLs, Bird-dogs, Side planks, Deadbugs.', 'Balanced diet');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (7, 'Friday', '2026-10-02', 'Speed (Threshold Tempo)', 7.0, '6:25 - 6:35 min/km tempo', 7, '1.5 km warmup, 4 km continuous @ Tempo (6:25-6:35 min/km), 1.5 km cooldown.', 'Hamstring & calf dynamic stretches', 'Carb snack pre-run');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (7, 'Saturday', '2026-10-03', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Light walking only', 'Carb-focused dinner + hydration');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (7, 'Sunday', '2026-10-04', 'Long Run', 16.0, '7:30 - 7:45 min/km', 4, '16 km long run. Gels at km 5, 10, 14 + Salt capsules at km 5 & 12.', 'Post-run calf & hamstring stretch', '3 Gels + 2 Salt capsules + water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (8, 'Monday', '2026-10-05', 'Recovery Run', 4.0, '8:00 min/km', 2, 'Gentle shakeout.', 'Calf stretching', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (8, 'Tuesday', '2026-10-06', 'Strength Day 1', 0.0, 'N/A', 4, 'Light bodyweight calf raises & glute bridges (2x10).', 'Bodyweight only', 'Balanced meals');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (8, 'Wednesday', '2026-10-07', 'Speed (Shakeout)', 3, '7:45 min/km + pickups', 4, '3 km shakeout + 3x30-sec pickups.', 'Light dynamic stretches', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (8, 'Thursday', '2026-10-08', 'Strength Day 2', 0.0, 'N/A', 4, 'Light core and back mobility.', 'Bird-dogs and side planks (2 sets)', 'Balanced diet');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (8, 'Friday', '2026-10-09', 'Speed (Shakeout)', 3.0, '7:45 min/km + pickups', 4, '3 km shakeout + 3x30-sec pickups.', 'Light dynamic stretches', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (8, 'Saturday', '2026-10-10', 'Rest', 0.0, 'N/A', 1, 'Full Rest before Time Trial.', 'Rest', 'Carb dinner + hydration');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (8, 'Sunday', '2026-10-11', '10K Time Trial', 10.0, '5:50 - 5:55 min/km race effort', 9, '10K TIME TRIAL BENCHMARK: 1.5 km warmup, 10 km Time Trial @ Maximum Sustainable Effort (Target: 58:00-59:30), 1 km cooldown.', 'Full post-race stretching and recovery', 'Pre-race snack + water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (9, 'Monday', '2026-10-12', 'Recovery Run', 5.0, '7:55 min/km', 2, 'Post-10K recovery run.', 'Calf & hamstring flush', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (9, 'Tuesday', '2026-10-13', 'Strength Day 1', 0.0, 'N/A', 5, 'Lower Body & Calf Armor.', 'Eccentric heel drops (3x15), seated calf raises (3x15), split squats, glute bridges, tibialis raises.', 'Protein');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (9, 'Wednesday', '2026-10-14', 'Speed (Strides)', 7, '7:40 warmup, strides', 7, '2 km warmup, 4x100m relaxed strides, 4.5 km easy. Pre-Delhi shakeout.', 'Dynamic prep', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (9, 'Thursday', '2026-10-15', 'Strength Day 2', 0.0, 'N/A', 5, 'Posterior Chain & Core.', 'RDLs, Bird-dogs, Side planks, Pallof press, Back extensions.', 'Balanced nutrition');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (9, 'Friday', '2026-10-16', 'Speed (Strides)', 7.0, '7:40 warmup, strides', 7, '2 km warmup, 4x100m relaxed strides, 4.5 km easy. Pre-Delhi shakeout.', 'Dynamic prep', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (9, 'Saturday', '2026-10-17', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Foam roll calves & quads', 'Hydrate with electrolyte drink');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (9, 'Sunday', '2026-10-18', 'VDHM 2026 (HM)', 21.1, '7:20 - 7:35 min/km', 5, 'PROCAM SLAM #1: VEDANTA DELHI HALF MARATHON (21.1 km). Steady, controlled training pace. Gels at km 6, 12, 17 + Salt capsules at km 6 & 14. Do not race at 100% effort.', 'Post-run calf ice/elevation & stretch', '3 Gels + 2 Salt capsules + on-course water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (10, 'Monday', '2026-10-19', 'Recovery Run', 6.0, '7:50 min/km', 2, 'Recovery run.', 'Calf & hamstring flush', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (10, 'Tuesday', '2026-10-20', 'Strength Day 1', 0.0, 'N/A', 5, 'Lower Body & Calf Armor.', 'Eccentric heel drops, seated calf raises, Bulgarian split squats, glute bridges, tibialis raises.', 'Protein');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (10, 'Wednesday', '2026-10-21', 'Speed (Hills + Tempo)', 8, 'Hills RPE 8, Tempo 6:30 min/km', 8, '2 km warmup, 4x75-sec hill repeats, 2 km @ Tempo (6:30 min/km), 1.5 km cooldown.', 'Calf & Achilles prep', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (10, 'Thursday', '2026-10-22', 'Strength Day 2', 0.0, 'N/A', 5, 'Posterior Chain & Core.', 'RDLs, Bird-dogs, Side planks, Supermans.', 'Balanced nutrition');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (10, 'Friday', '2026-10-23', 'Speed (Hills + Tempo)', 8.0, 'Hills RPE 8, Tempo 6:30 min/km', 8, '2 km warmup, 4x75-sec hill repeats, 2 km @ Tempo (6:30 min/km), 1.5 km cooldown.', 'Calf & Achilles prep', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (10, 'Saturday', '2026-10-24', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Light stretching', 'Carb-rich dinner + electrolytes');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (10, 'Sunday', '2026-10-25', 'Long Run', 20.0, '7:30 - 7:45 min/km', 4, '20 km Long Run. 4 Gels (every 40 min) + 2 Salt capsules (km 6, 14) + hydration vest.', 'Post-run calf massage', '4 Gels + 2 Salt capsules + 1.5L water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (11, 'Monday', '2026-10-26', 'Recovery Run', 6.0, '7:50 min/km', 2, 'Recovery run.', 'Calf & hip stretch', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (11, 'Tuesday', '2026-10-27', 'Strength Day 1', 0.0, 'N/A', 5, 'Lower Body & Calf Armor.', 'Eccentric heel drops, soleus raises, split squats, glute bridges, tibialis raises.', 'Protein');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (11, 'Wednesday', '2026-10-28', 'Speed (1K Repeats)', 8, '5:50 min/km intervals', 8, '1.5 km warmup, 4x1 km @ 5:50 min/km (2 min jog rest), 1.5 km cooldown.', 'Dynamic leg swings', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (11, 'Thursday', '2026-10-29', 'Strength Day 2', 0.0, 'N/A', 5, 'Posterior Chain & Core.', 'RDLs, Bird-dogs, Side planks, Deadbugs.', 'Balanced diet');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (11, 'Friday', '2026-10-30', 'Speed (1K Repeats)', 8.0, '5:50 min/km intervals', 8, '1.5 km warmup, 4x1 km @ 5:50 min/km (2 min jog rest), 1.5 km cooldown.', 'Dynamic leg swings', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (11, 'Saturday', '2026-10-31', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Foam rolling', 'Hydration tracking');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (11, 'Sunday', '2026-11-01', 'Long Run', 22.0, '7:30 - 7:45 min/km (Last 2k @ 7:06)', 5, '22 km Long Run. First 20 km @ 7:35 min/km, last 2 km @ Marathon Pace (7:06 min/km).', 'Post-run calf recovery', '4 Gels + 3 Salt capsules + 1.5L water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (12, 'Monday', '2026-11-02', 'Recovery Run', 5.0, '8:00 min/km', 2, 'Gentle recovery jog.', 'Gentle stretching', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (12, 'Tuesday', '2026-11-03', 'Strength Day 1', 0.0, 'N/A', 4, 'Bodyweight maintenance (2 sets).', 'Calf raises, glute bridges, lunges', 'Balanced meals');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (12, 'Wednesday', '2026-11-04', 'Speed (Strides)', 5, '7:45 warmup, strides', 5, '2 km easy, 5x100m strides, 1.5 km easy.', 'Dynamic prep', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (12, 'Thursday', '2026-11-05', 'Strength Day 2', 0.0, 'N/A', 4, 'Core stability & hip flexor release.', 'Bird-dogs, deadbugs (2 sets)', 'Balanced diet');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (12, 'Friday', '2026-11-06', 'Speed (Strides)', 5.0, '7:45 warmup, strides', 5, '2 km easy, 5x100m strides, 1.5 km easy.', 'Dynamic prep', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (12, 'Saturday', '2026-11-07', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Sleep 8+ hours', 'Hydration');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (12, 'Sunday', '2026-11-08', 'Long Run', 14.0, '7:35 - 7:45 min/km', 3, 'Deload long run. Low heart rate, smooth cruising.', 'Calf stretching', '2 Gels + 1 Salt capsule + water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (13, 'Monday', '2026-11-09', 'Recovery Run', 6.0, '7:50 min/km', 2, 'Recovery run.', 'Calf & hamstring flush', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (13, 'Tuesday', '2026-11-10', 'Strength Day 1', 0.0, 'N/A', 5, 'Lower Body & Calf Armor.', 'Eccentric heel drops, seated calf raises, Bulgarian split squats, glute bridges, tibialis raises.', 'Protein');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (13, 'Wednesday', '2026-11-11', 'Speed (MP Tempo)', 8, '7:00 - 7:06 min/km MP block', 6, '2 km warmup, 4 km continuous @ Marathon Pace (7:00-7:06 min/km), 2 km cooldown.', 'Dynamic stretches', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (13, 'Thursday', '2026-11-12', 'Strength Day 2', 0.0, 'N/A', 5, 'Posterior Chain & Core.', 'RDLs, Bird-dogs, Side planks, Pallof press.', 'Balanced nutrition');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (13, 'Friday', '2026-11-13', 'Speed (MP Tempo)', 8.0, '7:00 - 7:06 min/km MP block', 6, '2 km warmup, 4 km continuous @ Marathon Pace (7:00-7:06 min/km), 2 km cooldown.', 'Dynamic stretches', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (13, 'Saturday', '2026-11-14', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Foam rolling', 'Hydration tracking');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (13, 'Sunday', '2026-11-15', 'Long Run', 24.0, '7:30 - 7:45 min/km', 4, '24 km Long Run. Gels every 40 mins + Salt capsules at km 6, 12, 18.', 'Post-run calf recovery', '5 Gels + 3 Salt capsules + 1.5L water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (14, 'Monday', '2026-11-16', 'Recovery Run', 5.0, '8:00 min/km', 2, 'Short easy recovery.', 'Gentle calf stretches', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (14, 'Tuesday', '2026-11-17', 'Strength Day 1', 0.0, 'N/A', 4, 'Light calf & glute activation (2 sets).', 'Bodyweight only', 'Balanced meals');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (14, 'Wednesday', '2026-11-18', 'Speed (Shakeout)', 4, '7:45 min/km + strides', 4, '4 km shakeout + 4x100m strides.', 'Dynamic stretches', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (14, 'Thursday', '2026-11-19', 'Strength Day 2', 0.0, 'N/A', 3, 'Core & mobility only.', 'Bird-dogs, deadbugs', 'Balanced diet');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (14, 'Friday', '2026-11-20', 'Speed (Shakeout)', 4.0, '7:45 min/km + strides', 4, '4 km shakeout + 4x100m strides.', 'Dynamic stretches', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (14, 'Saturday', '2026-11-21', 'Rest', 0.0, 'N/A', 1, 'Full Rest. Full race-morning meal rehearsal.', 'Rest', 'High-carb dinner + hydration');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (14, 'Sunday', '2026-11-22', 'HM Simulation', 21.1, 'Progressive: 7:10 -> 6:50 -> 6:35 min/km', 8, 'HALF MARATHON RACE SIMULATION (21.1 km): First 5 km @ 7:10, km 5-16 @ 6:45-6:55, km 16-21.1 @ 6:30-6:40. Target: 2:23:00-2:27:00.', 'Full post-race recovery protocol', '3 Gels (km 6, 12, 17) + 2 Salt capsules + 1.2L water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (15, 'Monday', '2026-11-23', 'Recovery Run', 6.0, '7:55 min/km', 2, 'Post-HM recovery run.', 'Calf & hamstring flush', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (15, 'Tuesday', '2026-11-24', 'Strength Day 1', 0.0, 'N/A', 5, 'Lower Body & Calf Armor.', 'Eccentric heel drops, seated calf raises, Bulgarian split squats, glute bridges, tibialis raises.', 'Protein');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (15, 'Wednesday', '2026-11-25', 'Speed (Hill Attack)', 9, 'Uphill RPE 8, cooldown 7:45', 8, '2 km warmup, 6x90-sec hill repeats @ RPE 8 (Pedder Road prep), 2 km cooldown.', 'Calf & Achilles prep', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (15, 'Thursday', '2026-11-26', 'Strength Day 2', 0.0, 'N/A', 5, 'Posterior Chain & Core.', 'RDLs, Bird-dogs, Side planks, Supermans.', 'Balanced nutrition');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (15, 'Friday', '2026-11-27', 'Speed (Hill Attack)', 9.0, 'Uphill RPE 8, cooldown 7:45', 8, '2 km warmup, 6x90-sec hill repeats @ RPE 8 (Pedder Road prep), 2 km cooldown.', 'Calf & Achilles prep', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (15, 'Saturday', '2026-11-28', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Foam rolling', 'Carb dinner + hydration');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (15, 'Sunday', '2026-11-29', 'Long Run', 26.0, '7:30 - 7:45 min/km', 5, '26 km Long Run. Practice taking 5 full gels + 3 salt capsules.', 'Post-run calf recovery', '5 Gels + 3 Salt capsules + 1.8L water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (16, 'Monday', '2026-11-30', 'Recovery Run', 5.0, '8:00 min/km', 2, 'Gentle recovery run.', 'Gentle stretching', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (16, 'Tuesday', '2026-12-01', 'Strength Day 1', 0.0, 'N/A', 4, 'Bodyweight maintenance (2 sets).', 'Calf raises, glute bridges', 'Balanced meals');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (16, 'Wednesday', '2026-12-02', 'Speed (Strides)', 6, '7:45 warmup, strides', 5, '2 km easy, 5x100m strides, 2 km easy.', 'Dynamic prep', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (16, 'Thursday', '2026-12-03', 'Strength Day 2', 0.0, 'N/A', 4, 'Core & lower back mobility.', 'Bird-dogs, deadbugs (2 sets)', 'Balanced diet');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (16, 'Friday', '2026-12-04', 'Speed (Strides)', 6.0, '7:45 warmup, strides', 5, '2 km easy, 5x100m strides, 2 km easy.', 'Dynamic prep', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (16, 'Saturday', '2026-12-05', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Sleep 8+ hours', 'Hydration');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (16, 'Sunday', '2026-12-06', 'Long Run', 16.0, '7:35 - 7:45 min/km', 3, 'Deload long run. Easy, relaxed rhythm.', 'Calf stretching', '2 Gels + 1 Salt capsule + water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (17, 'Monday', '2026-12-07', 'Recovery Run', 7.0, '7:50 min/km', 2, 'Recovery run.', 'Calf & hamstring flush', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (17, 'Tuesday', '2026-12-08', 'Strength Day 1', 0.0, 'N/A', 5, 'Lower Body & Calf Armor.', 'Eccentric heel drops, seated calf raises, Bulgarian split squats, glute bridges, tibialis raises.', 'Protein');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (17, 'Wednesday', '2026-12-09', 'Speed (Threshold Blocks)', 8, '6:25 min/km tempo blocks', 7, '2 km warmup, 3x1.5 km @ 6:25 min/km (2 min rest), 1.5 km cooldown.', 'Dynamic stretches', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (17, 'Thursday', '2026-12-10', 'Strength Day 2', 0.0, 'N/A', 5, 'Posterior Chain & Core.', 'RDLs, Bird-dogs, Side planks, Pallof press.', 'Balanced nutrition');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (17, 'Friday', '2026-12-11', 'Speed (Threshold Blocks)', 8.0, '6:25 min/km tempo blocks', 7, '2 km warmup, 3x1.5 km @ 6:25 min/km (2 min rest), 1.5 km cooldown.', 'Dynamic stretches', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (17, 'Saturday', '2026-12-12', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Foam rolling', 'Carb dinner + hydration');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (17, 'Sunday', '2026-12-13', 'Peak Long Run', 30.0, '7:35 - 7:45 min/km (Last 3k @ 7:06)', 6, '30 km Peak Distance Run. First 27 km @ 7:35 min/km, last 3 km @ Marathon Pace (7:06 min/km). Max time-on-feet conditioning.', 'Post-run calf recovery', '6 Gels + 4 Salt capsules + 2L water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (18, 'Monday', '2026-12-14', 'Recovery Run', 6.0, '7:55 min/km', 2, 'Gentle recovery run.', 'Calf & hamstring flush', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (18, 'Tuesday', '2026-12-15', 'Strength Day 1', 0.0, 'N/A', 5, 'Lower Body & Calf Armor (Final heavy strength week).', 'Eccentric heel drops, seated calf raises, split squats, glute bridges, tibialis raises.', 'Protein');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (18, 'Wednesday', '2026-12-16', 'Pre-Race Easy + Strides', 8, '7:30 - 7:45 min/km', 6, '2 km warmup, 4x100m strides, 5.5 km easy shakeout before traveling to Kolkata.', 'Dynamic stretches', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (18, 'Thursday', '2026-12-17', 'Strength Day 2', 0.0, 'N/A', 5, 'Posterior Chain & Core.', 'RDLs, Bird-dogs, Side planks, Supermans.', 'Balanced nutrition');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (18, 'Friday', '2026-12-18', 'Mid-Week Aerobic', 10, '7:15 - 7:30 min/km', 3, 'Mid-week aerobic anchor.', 'Hip mobility', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (18, 'Saturday', '2026-12-19', 'Rest', 0.0, 'N/A', 1, 'Full Rest. Hyper-hydrate with electrolytes.', 'Rest', 'High-carb loading meals + 2.5L fluids');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (18, 'Sunday', '2026-12-20', 'TSW Kolkata 25K', 25.0, 'First 15k @ 7:25, Last 10k @ 7:05 min/km', 6, 'PROCAM SLAM #2: TATA STEEL WORLD 25K KOLKATA (25 km). Marathon Goal Pace Dress Rehearsal. First 15 km steady @ 7:25 min/km, last 10 km locked at Marathon Goal Pace (7:00-7:06 min/km). Target: ~3:00:00.', 'Full post-run ice/foam roll & elevation', '5 Gels + 3 Salt capsules + water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (19, 'Monday', '2026-12-21', 'Recovery Run', 6.0, '8:00 min/km', 2, 'Gentle shakeout after peak 32k.', 'Calf & hamstring flush', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (19, 'Tuesday', '2026-12-22', 'Strength Day 1', 0.0, 'N/A', 4, 'Lighter maintenance strength (2 sets/exercise).', 'Bodyweight heel drops, glute bridges', 'Protein');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (19, 'Wednesday', '2026-12-23', 'Speed (Tempo)', 8, '6:30 min/km tempo', 7, '2 km warmup, 3 km @ 6:30 min/km tempo, 2 km cooldown.', 'Dynamic stretches', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (19, 'Thursday', '2026-12-24', 'Strength Day 2', 0.0, 'N/A', 4, 'Core & bodyweight back stabilization.', 'Bird-dogs, deadbugs (2 sets)', 'Balanced nutrition');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (19, 'Friday', '2026-12-25', 'Speed (Tempo)', 8.0, '6:30 min/km tempo', 7, '2 km warmup, 3 km @ 6:30 min/km tempo, 2 km cooldown.', 'Dynamic stretches', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (19, 'Saturday', '2026-12-26', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Foam rolling', 'Carb dinner + hydration');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (19, 'Sunday', '2026-12-27', 'Long Run', 24.0, '7:35 - 7:45 min/km', 4, '24 km Long Run. Comfortable rhythm.', 'Post-run calf recovery', '4 Gels + 3 Salt capsules + 1.5L water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (20, 'Monday', '2026-12-28', 'Recovery Run', 5.0, '7:55 min/km', 2, 'Easy recovery run.', 'Gentle calf stretches', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (20, 'Tuesday', '2026-12-29', 'Strength Day 1', 0.0, 'N/A', 3, 'Bodyweight only (Calf raises 2x15, glute bridges, bird-dogs). No heavy lifting.', 'Mobility & activation', 'Balanced meals');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (20, 'Wednesday', '2026-12-30', 'Speed (MP Sharpening)', 5, '7:00 min/km MP block', 5, '1.5 km warmup, 2 km @ Marathon Pace (7:00 min/km), 1.5 km cooldown.', 'Dynamic stretches', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (20, 'Thursday', '2026-12-31', 'Strength Day 2', 0.0, 'N/A', 3, 'Light core & stretching (15 mins).', 'Bird-dogs, deadbugs (2 sets)', 'Balanced diet');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (20, 'Friday', '2027-01-01', 'Speed (MP Sharpening)', 5.0, '7:00 min/km MP block', 5, '1.5 km warmup, 2 km @ Marathon Pace (7:00 min/km), 1.5 km cooldown.', 'Dynamic stretches', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (20, 'Saturday', '2027-01-02', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Rest & sleep', 'Hydration');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (20, 'Sunday', '2027-01-03', 'Long Run', 18.0, '7:30 - 7:40 min/km', 3, 'Taper 1 Long Run: 18 km. Legs should feel fresh and bouncy.', 'Post-run calf flush', '3 Gels + 2 Salt capsules + water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (21, 'Monday', '2027-01-04', 'Recovery Run', 4.0, '8:00 min/km', 2, 'Short shakeout.', 'Gentle stretching', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (21, 'Tuesday', '2027-01-05', 'Mobility', 0.0, 'N/A', 2, 'Light mobility, foam rolling, dynamic hip openers.', 'Mobility only', 'Balanced meals');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (21, 'Wednesday', '2027-01-06', 'Speed (MP Sharpener)', 5, '7:05 min/km MP block', 4, '2 km easy, 1.5 km @ Marathon Pace (7:05 min/km), 1.5 km cooldown.', 'Dynamic prep', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (21, 'Thursday', '2027-01-07', 'Rest', 0.0, 'N/A', 1, 'Complete Rest & hydration tracking.', 'Rest', 'Hydration tracking');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (21, 'Friday', '2027-01-08', 'Speed (MP Sharpener)', 5.0, '7:05 min/km MP block', 4, '2 km easy, 1.5 km @ Marathon Pace (7:05 min/km), 1.5 km cooldown.', 'Dynamic prep', 'Carb snack');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (21, 'Saturday', '2027-01-09', 'Rest', 0.0, 'N/A', 1, 'Full Rest.', 'Rest', 'Hydration');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (21, 'Sunday', '2027-01-10', 'Long Run', 12.0, '7:30 - 7:40 min/km', 3, 'Final dress rehearsal: 12 km @ 7:30-7:40 min/km with Adidas Evo SL 2 and race vest.', 'Calf stretching', '2 Gels + 1 Salt capsule + water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (22, 'Monday', '2027-01-11', 'Recovery Shakeout', 4.0, '8:00 min/km', 2, '4 km shakeout run + gentle calf stretches.', 'Light stretching', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (22, 'Tuesday', '2027-01-12', 'Rest & Packing', 0.0, 'N/A', 1, 'Rest & Travel Packing (Vest, Gels, Salt Tabs, Shoes).', 'Rest', 'Balanced meals');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (22, 'Wednesday', '2027-01-13', 'Mumbai Shakeout', 3, '7:45 min/km + 2 strides', 3, '3 km morning shakeout run in Mumbai to acclimatize to coastal humidity.', 'Light dynamic stretches', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (22, 'Thursday', '2027-01-14', 'Travel / Expo', 0.0, 'N/A', 1, 'Travel to Mumbai. Bib collection at MMRDA Expo. Rest off feet.', 'Rest', 'Hydrate with electrolyte bottle');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (22, 'Friday', '2027-01-15', 'Easy Jog', 4, '7:30 min/km + 3 strides', 3, '4 km easy jog + 3x60m light strides.', 'Mobility', 'Water');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (22, 'Saturday', '2027-01-16', 'Pre-Race Rest', 0.0, 'N/A', 1, 'Full Rest Day. Stay off feet. High carb meals (rice/potatoes). Sleep by 9 PM.', 'Rest', 'High-carb loading (350-400g carbs) + 2L electrolyte fluids');
INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES (22, 'Sunday', '2027-01-17', 'RACE DAY', 42.195, '7:05 min/km avg (Sub-5:00 Target: 4:58:30)', 9, 'TATA MUMBAI MARATHON 2027: Gun off ~5:00 AM. km 0-10 @ 7:10-7:15, Pedder Rd #1 @ 7:25, Sea Link @ 7:02-7:06, Pedder Rd #2 @ 7:35, Finish sprint @ 6:55-7:00!', 'FINISH LINE MEDAL CELEBRATION! 🏅', '6 Gels + 5 Salt capsules + water sips every 15 mins');
