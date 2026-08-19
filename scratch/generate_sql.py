import json

with open('/Users/altcreative/Downloads/Procam afterthought/training_data.json', 'r') as f:
    data = json.load(f)

sql_lines = []

sql_lines.append("""-- ==============================================================================
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
""")

for phase in data['phases']:
    sql_lines.append(f"""INSERT INTO training_phases (id, name, start_week, end_week, description)
VALUES ({phase['id']}, '{phase['name'].replace("'", "''")}', {phase['start_week']}, {phase['end_week']}, '{phase['description'].replace("'", "''")}')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
""")

sql_lines.append("\n-- 4. Insert Training Weeks\n")

for week in data['weeks']:
    is_deload = 'TRUE' if week['is_deload'] else 'FALSE'
    sql_lines.append(f"""INSERT INTO training_weeks (week_number, phase_name, start_date, end_date, total_planned_km, is_deload, focus)
VALUES ({week['week_number']}, '{week['phase'].replace("'", "''")}', '{week['start_date']}', '{week['end_date']}', {week['total_planned_km']}, {is_deload}, '{week['focus'].replace("'", "''")}')
ON CONFLICT (week_number) DO UPDATE SET total_planned_km = EXCLUDED.total_planned_km, focus = EXCLUDED.focus;
""")

sql_lines.append("\n-- 5. Insert Daily Workouts\n")

for week in data['weeks']:
    for w in week['workouts']:
        sql_lines.append(f"""INSERT INTO daily_workouts (week_number, day_of_week, workout_date, workout_type, distance_km, target_pace, rpe_target, description, strength_prehab, fueling_hydration_strategy)
VALUES ({week['week_number']}, '{w['day']}', '{w['date']}', '{w['type'].replace("'", "''")}', {w['distance_km']}, '{w['target_pace'].replace("'", "''")}', {w['rpe']}, '{w['description'].replace("'", "''")}', '{w['strength_prehab'].replace("'", "''")}', '{w['fueling'].replace("'", "''")}');
""")

with open('/Users/altcreative/Downloads/Procam afterthought/supabase_schema.sql', 'w') as f:
    f.write("".join(sql_lines))

print("Successfully generated supabase_schema.sql")
