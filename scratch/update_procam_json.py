import json

# Load training_data.json
with open('/Users/altcreative/Downloads/Procam afterthought/training_data.json', 'r') as f:
    data = json.load(f)

# Update athlete metadata
data['athlete']['procam_slam'] = [
    { "event": "Vedanta Delhi Half Marathon (VDHM)", "date": "2026-10-18", "distance_km": 21.1, "week": 9, "role": "Controlled Long Run Rehearsal" },
    { "event": "Tata Steel World 25K Kolkata (TSW 25K)", "date": "2026-12-20", "distance_km": 25.0, "week": 18, "role": "Marathon Pace Race Simulation" },
    { "event": "Tata Mumbai Marathon (TMM 2027)", "date": "2027-01-17", "distance_km": 42.195, "week": 22, "role": "THE GOAL RACE (Sub-5:00:00)" }
]

# Update Week 9
for w in data['weeks']:
    if w['week_number'] == 9:
        w['total_planned_km'] = 41.1
        w['focus'] = "PROCAM SLAM #1: Vedanta Delhi Half Marathon (VDHM) — Non-Tapered Training Effort"
        for wo in w['workouts']:
            if wo['day'] == 'Sunday':
                wo['type'] = 'VDHM 2026 (HM)'
                wo['distance_km'] = 21.1
                wo['target_pace'] = '7:20 - 7:35 min/km'
                wo['rpe'] = 5
                wo['description'] = 'PROCAM SLAM #1: VEDANTA DELHI HALF MARATHON (21.1 km). Steady, controlled training pace. Gels at km 6, 12, 17 + Salt capsules at km 6 & 14. Do not race at 100% effort.'
                wo['fueling'] = '3 Gels + 2 Salt capsules + on-course water'
            elif wo['day'] == 'Friday':
                wo['type'] = 'Speed (Strides)'
                wo['distance_km'] = 7.0
                wo['target_pace'] = '7:40 warmup, strides'
                wo['description'] = '2 km warmup, 4x100m relaxed strides, 4.5 km easy. Pre-Delhi shakeout.'

    elif w['week_number'] == 17:
        w['total_planned_km'] = 55.0
        w['focus'] = "Heavy volume builder; 30 km Peak Distance Long Run"
        for wo in w['workouts']:
            if wo['day'] == 'Sunday':
                wo['type'] = 'Peak Long Run'
                wo['distance_km'] = 30.0
                wo['target_pace'] = '7:35 - 7:45 min/km (Last 3k @ 7:06)'
                wo['rpe'] = 6
                wo['description'] = '30 km Peak Distance Run. First 27 km @ 7:35 min/km, last 3 km @ Marathon Pace (7:06 min/km). Max time-on-feet conditioning.'
                wo['fueling'] = '6 Gels + 4 Salt capsules + 2L water'

    elif w['week_number'] == 18:
        w['total_planned_km'] = 49.0
        w['focus'] = "PROCAM SLAM #2: Tata Steel World 25K Kolkata — Marathon Pace Dress Rehearsal"
        for wo in w['workouts']:
            if wo['day'] == 'Friday':
                wo['type'] = 'Pre-Race Easy + Strides'
                wo['distance_km'] = 8.0
                wo['target_pace'] = '7:30 - 7:45 min/km'
                wo['description'] = '2 km warmup, 4x100m strides, 5.5 km easy shakeout before traveling to Kolkata.'
            elif wo['day'] == 'Sunday':
                wo['type'] = 'TSW Kolkata 25K'
                wo['distance_km'] = 25.0
                wo['target_pace'] = 'First 15k @ 7:25, Last 10k @ 7:05 min/km'
                wo['rpe'] = 6
                wo['description'] = 'PROCAM SLAM #2: TATA STEEL WORLD 25K KOLKATA (25 km). Marathon Goal Pace Dress Rehearsal. First 15 km steady @ 7:25 min/km, last 10 km locked at Marathon Goal Pace (7:00-7:06 min/km). Target: ~3:00:00.'
                wo['fueling'] = '5 Gels + 3 Salt capsules + water'

# Save updated training_data.json
with open('/Users/altcreative/Downloads/Procam afterthought/training_data.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Updated training_data.json with Procam Slam milestones")
