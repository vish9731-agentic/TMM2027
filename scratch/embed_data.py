import json

with open('/Users/altcreative/Downloads/Procam afterthought/training_data.json', 'r') as f:
    data = json.load(f)

with open('/Users/altcreative/Downloads/Procam afterthought/app.js', 'r') as f:
    app_js_content = f.read()

# Replace generateFallbackWeeks with the full dataset
full_weeks_json = json.dumps(data['weeks'], indent=2)

updated_app_js = app_js_content.replace(
    'rawWeeksData = generateFallbackWeeks();',
    f'rawWeeksData = {full_weeks_json};'
)

# Also update the generateFallbackWeeks function at the bottom
updated_app_js = updated_app_js.replace(
    '''function generateFallbackWeeks() {
  return [
    {
      "week_number": 1,
      "phase": "Prep & Foundation",
      "start_date": "2026-08-17",
      "end_date": "2026-08-23",
      "total_planned_km": 21,
      "is_deload": false,
      "focus": "Establishing 4-day rhythm & calf strength baseline",
      "workouts": [
        { "day": "Monday", "date": "2026-08-17", "type": "Recovery Run", "distance_km": 4.0, "target_pace": "7:50 - 8:10 min/km", "rpe": 2, "description": "Short easy shakeout run to start cycle.", "strength_prehab": "Post-run calf & hip flexor stretches (15 mins)", "fueling": "Hydration with water post-run" },
        { "day": "Tuesday", "date": "2026-08-18", "type": "Strength Day 1", "distance_km": 0.0, "target_pace": "N/A", "rpe": 5, "description": "Lower Body & Calf Armor.", "strength_prehab": "Single-leg eccentric heel drops (3x15/leg), seated calf raises (3x15), Bulgarian split squats (3x8/leg), glute bridges (3x12/leg), tibialis wall raises (3x20).", "fueling": "Adequate protein intake" },
        { "day": "Wednesday", "date": "2026-08-19", "type": "Mid-Week Aerobic", "distance_km": 5.0, "target_pace": "7:20 - 7:35 min/km", "rpe": 3, "description": "Smooth conversational pace.", "strength_prehab": "Dynamic warmup & ankle mobility", "fueling": "Water as needed" },
        { "day": "Thursday", "date": "2026-08-20", "type": "Strength Day 2", "distance_km": 0.0, "target_pace": "N/A", "rpe": 5, "description": "Posterior Chain & Core Stability.", "strength_prehab": "Romanian Deadlifts (3x10), Bird-dogs (3x10/side), Side planks (3x35s/side), Deadbugs (3x12).", "fueling": "Normal balanced diet" },
        { "day": "Friday", "date": "2026-08-21", "type": "Speed (Strides)", "distance_km": 5.0, "target_pace": "7:45 warmup, ~5:30 strides", "rpe": 6, "description": "1.5 km warmup, 5x100m fast relaxed strides with 90s walk rest, 2 km cooldown.", "strength_prehab": "Hamstring and calf dynamic stretches", "fueling": "Light carbs pre-run" },
        { "day": "Saturday", "date": "2026-08-22", "type": "Rest", "distance_km": 0.0, "target_pace": "N/A", "rpe": 1, "description": "Complete rest day before long run.", "strength_prehab": "Light walking / gentle stretching", "fueling": "Hydrate with 2L fluids" },
        { "day": "Sunday", "date": "2026-08-23", "type": "Long Run", "distance_km": 7.0, "target_pace": "7:35 - 7:45 min/km", "rpe": 3, "description": "Week 1 long run. Focus on relaxed breathing and light foot strikes.", "strength_prehab": "Post-run 10-min calf flush", "fueling": "Water sips every 2 km" }
      ]
    }
  ];
}''',
    f'function generateFallbackWeeks() {{\n  return {full_weeks_json};\n}}'
)

with open('/Users/altcreative/Downloads/Procam afterthought/app.js', 'w') as f:
    f.write(updated_app_js)

print("Updated app.js with embedded 22-week dataset")
