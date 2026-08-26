// ==============================================================================
// 22-WEEK MARATHON TRAINING APP LOGIC & EMBEDDED DATA
// ==============================================================================

const APP_DATA = {
  "athlete": {
    "name": "Marathon Runner",
    "target_race": "Tata Mumbai Marathon 2027",
    "race_date": "2027-01-17T05:00:00",
    "start_date": "2026-08-17",
    "goal_time": "04:59:59",
    "goal_pace": "7:06 min/km",
    "current_10k_time": "01:00:00",
    "baseline_easy_pace": "7:15 min/km",
    "shoe": "Adidas Adizero Evo SL 2"
  },
  "phases": [
    { "id": 1, "name": "Phase 1: Prep & Foundation", "weeks": "Weeks 1–4", "dates": "Aug 17 – Sep 13", "description": "Establish 4-day weekly habit, build calf armor (eccentric drops) to avoid cramps, core stability for lower back." },
    { "id": 2, "name": "Phase 2: Aerobic Base Building", "weeks": "Weeks 5–12", "dates": "Sep 14 – Nov 08", "description": "Expand mitochondrial density, break through 18-20k calf cramp barrier, VDHM 2026 milestone, 10K time trial." },
    { "id": 3, "name": "Phase 3: Peak & Race Specificity", "weeks": "Weeks 13–19", "dates": "Nov 09 – Dec 27", "description": "Peak volume tolerance, 30 km Long Run, Kolkata 25K MP simulation, HM simulation race." },
    { "id": 4, "name": "Phase 4: Taper & Race Execution", "weeks": "Weeks 20–22", "dates": "Dec 28 – Jan 17", "description": "Glycogen restoration, cellular repair, short sharp MP strides, race logistics and execution at Tata Mumbai Marathon." }
  ],
  
  "raceCourses": {
    "vdhm": {
      "id": "vdhm",
      "name": "Vedanta Delhi Half Marathon 2026",
      "badge": "PROCAM SLAM #1 • WEEK 9",
      "date": "Sunday, October 18, 2026",
      "distance": "21.0975 km",
      "venue": "Jawaharlal Nehru Stadium (JLN), New Delhi",
      "role": "Non-tapered aerobic long training run (Target: ~2:35:00)",
      "target_pace": "7:20 – 7:35 min/km (Easy Aerobic)",
      "svg_elevation": `
        <svg viewBox="0 0 900 180" style="width: 100%; height: auto; overflow: visible;">
          <defs>
            <linearGradient id="vdhmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.05"/>
            </linearGradient>
          </defs>
          <line x1="50" y1="40" x2="850" y2="40" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
          <line x1="50" y1="90" x2="850" y2="90" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
          <line x1="50" y1="130" x2="850" y2="130" stroke="rgba(255,255,255,0.15)"/>
          
          <!-- Flat fast Delhi road curve with subtle flyover dips -->
          <path d="M 50,130 L 180,130 L 250,115 L 320,130 L 450,128 L 520,115 L 600,130 L 750,130 L 850,130 L 850,150 L 50,150 Z" fill="url(#vdhmGrad)" stroke="#38bdf8" stroke-width="3"/>
          
          <circle cx="50" cy="130" r="5" fill="#38bdf8"/>
          <text x="50" y="165" fill="#94a3b8" font-size="11" text-anchor="middle">0 km (JLN Stadium)</text>

          <circle cx="250" cy="115" r="5" fill="#38bdf8"/>
          <text x="250" y="95" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">Lodhi Road & Mathura Rd (km 6)</text>
          <text x="250" y="165" fill="#94a3b8" font-size="11" text-anchor="middle">6 km (Gel #1 + Salt)</text>

          <circle cx="520" cy="115" r="6" fill="#38bdf8"/>
          <text x="520" y="95" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">🏛️ India Gate & Kartavya Path (km 12–16)</text>
          <text x="520" y="165" fill="#94a3b8" font-size="11" text-anchor="middle">12.5 km (Gel #2)</text>

          <circle cx="850" cy="130" r="6" fill="#eab308"/>
          <text x="850" y="165" fill="#eab308" font-size="11" font-weight="700" text-anchor="middle">21.1 km JLN Finish</text>
        </svg>
      `,
      "sectors": [
        { "name": "JLN Stadium to Lodhi Road & Mathura Rd", "dist": "0 – 6 km", "pace": "7:30 – 7:35 min/km", "strategy": "Smooth, conservative start. Avoid surging in early morning excitement. Sips of water at every station." },
        { "name": "Subramania Bharti Marg to India Gate", "dist": "6 – 12 km", "pace": "7:25 – 7:30 min/km", "strategy": "Wide, flat boulevards. Lock into conversational rhythm. Take Gel #1 at km 6 with water + 1 Salt capsule." },
        { "name": "Kartavya Path & Rajpath Loop", "dist": "12 – 16 km", "pace": "7:20 – 7:25 min/km", "strategy": "Scenic monumental stretch. Keep cadence high (168+ spm). Take Gel #2 at km 12 + 1 Salt capsule at km 14." },
        { "name": "Mansingh Road to JLN Stadium Finish", "dist": "16 – 21.1 km", "pace": "7:15 – 7:20 min/km", "strategy": "Take Gel #3 at km 17. Cruise comfortably to the finish line with plenty in the tank for next week's training!" }
      ],
      "fueling": [
        { "time": "Pre-Race (2 hrs before)", "fuel": "Banana + Toast / Oatmeal", "electrolytes": "1 Salt capsule + 300ml water", "hydration": "Hydrate until urine is pale straw" },
        { "time": "km 6 (~45 mins)", "fuel": "Gel #1", "electrolytes": "1 Salt capsule (200mg Na)", "hydration": "150 ml on-course water" },
        { "time": "km 12 (~90 mins)", "fuel": "Gel #2", "electrolytes": "Electrolytes if needed", "hydration": "150 ml on-course water" },
        { "time": "km 14 (~105 mins)", "fuel": "None", "electrolytes": "1 Salt capsule (Pre-cramp defense)", "hydration": "150 ml on-course water" },
        { "time": "km 17 (~125 mins)", "fuel": "Gel #3", "electrolytes": "None", "hydration": "150 ml on-course water" }
      ]
    },
    "kolkata": {
      "id": "kolkata",
      "name": "Tata Steel World 25K Kolkata 2026",
      "badge": "PROCAM SLAM #2 • WEEK 18",
      "date": "Sunday, December 20, 2026",
      "distance": "25.0000 km",
      "venue": "Red Road, Kolkata (Near Rangers Club)",
      "role": "Marathon Goal Pace (MP) Dress Rehearsal (Target: ~3:00:00)",
      "target_pace": "First 15k @ 7:20–7:25, Last 10k @ 7:00–7:06 (MP)",
      "svg_elevation": `
        <svg viewBox="0 0 900 180" style="width: 100%; height: auto; overflow: visible;">
          <defs>
            <linearGradient id="kolGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.05"/>
            </linearGradient>
          </defs>
          <line x1="50" y1="40" x2="850" y2="40" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
          <line x1="50" y1="85" x2="850" y2="85" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
          <line x1="50" y1="130" x2="850" y2="130" stroke="rgba(255,255,255,0.15)"/>
          
          <!-- Route with Vidyasagar Setu flyover incline at km 8-13 -->
          <path d="M 50,130 L 220,130 L 320,65 L 420,65 L 480,130 L 620,130 L 750,130 L 850,130 L 850,150 L 50,150 Z" fill="url(#kolGrad)" stroke="#f59e0b" stroke-width="3"/>
          
          <circle cx="50" cy="130" r="5" fill="#f59e0b"/>
          <text x="50" y="165" fill="#94a3b8" font-size="11" text-anchor="middle">0 km (Red Road)</text>

          <circle cx="180" cy="130" r="5" fill="#f59e0b"/>
          <text x="180" y="115" fill="#f8fafc" font-size="11" text-anchor="middle">Strand Road</text>

          <circle cx="370" cy="65" r="6" fill="#ef4444"/>
          <text x="370" y="45" fill="#ef4444" font-size="11" font-weight="700" text-anchor="middle">🌉 Vidyasagar Setu Incline (km 8–13)</text>
          <text x="370" y="165" fill="#94a3b8" font-size="11" text-anchor="middle">10 km (Gel #2 + Salt)</text>

          <circle cx="580" cy="130" r="5" fill="#10b981"/>
          <text x="580" y="115" fill="#10b981" font-size="11" font-weight="700" text-anchor="middle">Alipore & Victoria Memorial</text>
          <text x="580" y="165" fill="#10b981" font-size="11" font-weight="700" text-anchor="middle">15 km (Shift to 7:06 MP!)</text>

          <circle cx="850" cy="130" r="6" fill="#eab308"/>
          <text x="850" y="165" fill="#eab308" font-size="11" font-weight="700" text-anchor="middle">25 km Finish</text>
        </svg>
      `,
      "sectors": [
        { "name": "Red Road to Strand Road & Riverbank", "dist": "0 – 8 km", "pace": "7:20 – 7:25 min/km", "strategy": "Conversational cruise past Raj Bhavan and Eden Gardens. Take Gel #1 at km 5 + Salt cap at km 8." },
        { "name": "Vidyasagar Setu Bridge Climb & Crossing", "dist": "8 – 13 km", "pace": "7:35 – 7:40 min/km (Climb) / 7:15 min/km (Descent)", "strategy": "Shorten stride on the ramp incline; relax arms and avoid spiking heart rate. Take Gel #2 at km 10." },
        { "name": "Khidderpore to Alipore & National Library", "dist": "13 – 15 km", "pace": "7:15 – 7:20 min/km", "strategy": "Flat recovery stretch following bridge descent. Take Gel #3 at km 15 + Salt cap at km 16." },
        { "name": "Victoria Memorial to Red Road (MP BLOCK)", "dist": "15 – 25 km", "pace": "7:00 – 7:06 min/km (MARATHON GOAL PACE)", "strategy": "THE 10 KM MP DRESS REHEARSAL! Lock into 7:06 min/km. Take Gel #4 at km 20. Rehearse race-day finish focus!" }
      ],
      "fueling": [
        { "time": "Pre-Race (2 hrs before)", "fuel": "Toast + Peanut Butter + Banana", "electrolytes": "1 Salt capsule + 300ml water", "hydration": "Hydrate steadily" },
        { "time": "km 5 (~37 mins)", "fuel": "Gel #1", "electrolytes": "None", "hydration": "150 ml water" },
        { "time": "km 8 (~60 mins)", "fuel": "None", "electrolytes": "1 Salt capsule (Before Bridge Climb)", "hydration": "150 ml water" },
        { "time": "km 10 (~75 mins)", "fuel": "Gel #2", "electrolytes": "None", "hydration": "150 ml water" },
        { "time": "km 15 (~110 mins)", "fuel": "Gel #3", "electrolytes": "None", "hydration": "150 ml water" },
        { "time": "km 16 (~118 mins)", "fuel": "None", "electrolytes": "1 Salt capsule (Pre-cramp defense)", "hydration": "150 ml water" },
        { "time": "km 20 (~145 mins)", "fuel": "Gel #4", "electrolytes": "Electrolytes if humid", "hydration": "150 ml water" }
      ]
    },
    "tmm": {
      "id": "tmm",
      "name": "Tata Mumbai Marathon 2027",
      "badge": "THE GRAND FINALE 🏆 • WEEK 22",
      "date": "Sunday, January 17, 2027",
      "distance": "42.1950 km (Full Marathon)",
      "venue": "Chhatrapati Shivaji Maharaj Terminus (CSMT) / Azad Maidan",
      "role": "THE PRIMARY GOAL RACE: Sub-5:00:00 Target (Pace: 7:05 min/km)",
      "target_pace": "7:05 min/km average (Target Finish: 4:58:30)",
      "svg_elevation": `
        <svg viewBox="0 0 900 220" style="width: 100%; height: auto; overflow: visible;">
          <defs>
            <linearGradient id="tmmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.05"/>
            </linearGradient>
          </defs>
          <line x1="50" y1="30" x2="850" y2="30" stroke="rgba(255,255,255,0.08)" stroke-dasharray="4"/>
          <line x1="50" y1="90" x2="850" y2="90" stroke="rgba(255,255,255,0.08)" stroke-dasharray="4"/>
          <line x1="50" y1="150" x2="850" y2="150" stroke="rgba(255,255,255,0.15)"/>
          
          <path d="M 50,150 L 150,150 L 220,70 L 250,75 L 280,150 L 350,145 L 510,145 L 600,150 L 700,50 L 730,55 L 760,150 L 850,150 L 850,170 L 50,170 Z" fill="url(#tmmGrad)" stroke="#10b981" stroke-width="3"/>
          
          <circle cx="50" cy="150" r="5" fill="#38bdf8"/>
          <text x="50" y="195" fill="#94a3b8" font-size="11" text-anchor="middle">0 km (CSMT)</text>
          <text x="140" y="130" fill="#f8fafc" font-size="11" text-anchor="middle" font-weight="600">Marine Drive</text>

          <circle cx="235" cy="70" r="6" fill="#f59e0b"/>
          <text x="235" y="50" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">Pedder Rd #1 (km 10–12)</text>
          <text x="235" y="195" fill="#94a3b8" font-size="11" text-anchor="middle">10 km</text>

          <circle cx="430" cy="145" r="5" fill="#38bdf8"/>
          <text x="430" y="130" fill="#38bdf8" font-size="11" font-weight="600" text-anchor="middle">Bandra-Worli Sea Link (Flat)</text>
          <text x="430" y="195" fill="#94a3b8" font-size="11" text-anchor="middle">21.1 km (Half)</text>

          <circle cx="715" cy="50" r="7" fill="#ef4444"/>
          <text x="715" y="30" fill="#ef4444" font-size="12" font-weight="800" text-anchor="middle">⚠️ THE WALL: Jaslok Hill (km 35–37)</text>
          <text x="715" y="195" fill="#94a3b8" font-size="11" text-anchor="middle">35 km</text>

          <circle cx="850" cy="150" r="6" fill="#eab308"/>
          <text x="850" y="195" fill="#eab308" font-size="11" font-weight="700" text-anchor="middle">42.2 km Finish</text>
        </svg>
      `,
      "sectors": [
        { "name": "CSMT to Marine Drive & Chowpatty", "dist": "0 – 10 km", "pace": "7:10 – 7:15 min/km", "strategy": "Start slower than goal pace! Resist crowd adrenaline, protect calves from early shock. Take Gel #1 at km 6 + Salt cap at km 6." },
        { "name": "Pedder Road Flyover Climb #1", "dist": "10 – 12 km", "pace": "7:25 – 7:30 min/km", "strategy": "Shorten stride, relax shoulders, lean from ankles. Do not surge to pass runners on the climb." },
        { "name": "Bandra-Worli Sea Link & U-Turn", "dist": "12 – 24 km", "pace": "7:02 – 7:06 min/km", "strategy": "Dial into target marathon pace. Take Gel #2 at km 12, Gel #3 at km 18 + Salt cap at km 16 before cramp zone." },
        { "name": "Worli / Mahim Return (Danger Zone)", "dist": "24 – 34 km", "pace": "7:05 – 7:08 min/km", "strategy": "Mental grit zone. Keep cadence high (170+ spm). Take Gel #4 at km 24, Gel #5 at km 30 + Salt cap at km 28." },
        { "name": "Pedder Road #2 (The Wall - Jaslok Hospital)", "dist": "35 – 37 km", "pace": "7:30 – 7:40 min/km", "strategy": "Crucial hill! Power-march if calves feel tight; do not redline heart rate. Take Gel #6 with water." },
        { "name": "Marine Drive to Azad Maidan Finish", "dist": "37 – 42.2 km", "pace": "6:55 – 7:05 min/km", "strategy": "Descend into Chowpatty, coastal crowd cheering, sprint down DN Road to claim your sub-5:00 medal! 🏅" }
      ],
      "fueling": [
        { "time": "Pre-Race (2:30 AM)", "fuel": "Banana + Oats / White Bread + PB", "electrolytes": "1 Salt capsule + 300ml water", "hydration": "Sips until 4:15 AM" },
        { "time": "km 6 (~42 mins)", "fuel": "Gel #1", "electrolytes": "1 Salt capsule (200mg Na)", "hydration": "150 ml water" },
        { "time": "km 12 (~85 mins)", "fuel": "Gel #2", "electrolytes": "1 Salt capsule", "hydration": "150 ml water" },
        { "time": "km 16 (~115 mins)", "fuel": "None", "electrolytes": "CRITICAL: 1 Salt capsule (Pre-cramp)", "hydration": "150 ml water" },
        { "time": "km 18 (~128 mins)", "fuel": "Gel #3", "electrolytes": "None", "hydration": "150 ml water" },
        { "time": "km 24 (~170 mins)", "fuel": "Gel #4", "electrolytes": "1 Salt capsule", "hydration": "150 ml water" },
        { "time": "km 30 (~212 mins)", "fuel": "Gel #5", "electrolytes": "1 Salt capsule", "hydration": "150 ml water" },
        { "time": "km 35 (~250 mins)", "fuel": "Gel #6 (Caffeine)", "electrolytes": "1 Salt capsule (Before Jaslok Hill)", "hydration": "150 ml water" }
      ]
    }
  },
  "strengthRoutines": {
    "lower": {
      "title": "Tuesday: Lower Body & Calf Armor (30–35 Mins)",
      "focus": "Calf Cramp Prevention & Achilles Resilience",
      "exercises": [
        { "name": "Single-Leg Eccentric Heel Drops (on a step)", "sets": "3 x 15 reps / leg", "desc": "Lower down slowly over 3 seconds; rise on both feet. Directly bolsters Achilles and gastrocnemius." },
        { "name": "Seated Bent-Knee Calf Raises", "sets": "3 x 15 reps", "desc": "Sit with weight/backpack on knees. Isolates soleus muscle—the #1 protector against late-race calf cramps." },
        { "name": "Tibialis Anterior Wall Raises", "sets": "3 x 20 reps", "desc": "Lean back against wall, lift toes high. Eliminates shin splints and anterior fatigue." },
        { "name": "Bulgarian Split Squats / Reverse Lunges", "sets": "3 x 8-10 reps / leg", "desc": "Knee tracking and quad stability without spinal compression." },
        { "name": "Single-Leg Glute Bridges", "sets": "3 x 12 reps / leg", "desc": "Hold top position for 2 seconds. Fires glutes to take stress off the lower back." }
      ]
    },
    "core": {
      "title": "Thursday: Posterior Chain & Lumbar Core (30 Mins)",
      "focus": "Lower Back Pain Elimination & Dynamic Posture",
      "exercises": [
        { "name": "Dumbbell / Resistance Band RDLs", "sets": "3 x 10 reps", "desc": "Hinge at hips with flat back. Strengthens hamstrings and lumbar spinal erectors." },
        { "name": "Bird-Dogs with 3-Second Hold", "sets": "3 x 10 reps / side", "desc": "Deep transverse abdominis and multifidus stabilization." },
        { "name": "Side Planks (Quadratus Lumborum)", "sets": "3 x 35-45s / side", "desc": "Stabilizes pelvis and prevents side-to-side hip drop when tired." },
        { "name": "Deadbugs", "sets": "3 x 12 alternating reps", "desc": "Anti-extension core strength to stop the lower back from hyperextending during long runs." },
        { "name": "Supermans / Prone Cobras", "sets": "3 x 12 reps", "desc": "Upper and lower back muscular endurance for late marathon posture." }
      ]
    },
    "mobility": {
      "title": "Monday Post-Run: 15-Minute Hip & Calf Flush",
      "focus": "Active Recovery & Soft Tissue Restoration",
      "exercises": [
        { "name": "Foam Roll Calves, Quads & ITB", "sets": "30 sec / muscle group", "desc": "Gentle sweeping strokes to flush metabolic byproducts." },
        { "name": "Pigeon Pose / Figure-4 Stretch", "sets": "60 sec / side", "desc": "Opens piriformis and deep lateral glutes." },
        { "name": "Couch Stretch (Hip Flexors & Quads)", "sets": "60 sec / side", "desc": "Unlocks tight hip flexors that pull on the lumbar spine." },
        { "name": "Cat-Cow Breathing Drill", "sets": "10 slow breath cycles", "desc": "Restores thoracic and lumbar segmental mobility." }
      ]
    }
  }
};

// State Management
let currentFilter = 'all';
let currentPhaseFilter = null;
let currentViewMode = 'grid';
let searchQuery = '';
let allCollapsed = false;
let completedWorkouts = JSON.parse(localStorage.getItem('tmm_completed_workouts') || '{}');
let rawWeeksData = [
  {
    "week_number": 1,
    "phase": "Prep & Foundation",
    "start_date": "2026-08-17",
    "end_date": "2026-08-23",
    "total_planned_km": 21,
    "is_deload": false,
    "focus": "Establishing 4-day rhythm & calf strength baseline",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-08-17",
        "type": "Recovery Run",
        "distance_km": 4,
        "target_pace": "7:50 - 8:10 min/km",
        "rpe": 2,
        "description": "Short easy shakeout run to start the cycle.",
        "strength_prehab": "Post-run calf & hip flexor stretches (15 mins)",
        "fueling": "Hydration with water post-run"
      },
      {
        "day": "Tuesday",
        "date": "2026-08-18",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Lower Body & Calf Armor.",
        "strength_prehab": "Single-leg eccentric heel drops (3x15/leg), seated calf raises (3x15), Bulgarian split squats (3x8/leg), glute bridges (3x12/leg), tibialis wall raises (3x20).",
        "fueling": "Adequate protein intake"
      },
      {
        "day": "Wednesday",
        "date": "2026-08-19",
        "type": "Speed (Strides)",
        "distance_km": 5,
        "target_pace": "7:45 warmup/cooldown, ~5:30 strides",
        "rpe": 6,
        "description": "1.5 km warmup, 5x100m fast relaxed strides with 90s walk rest, 2 km cooldown.",
        "strength_prehab": "Hamstring and calf dynamic stretches",
        "fueling": "Light carbs pre-run"
      },
      {
        "day": "Thursday",
        "date": "2026-08-20",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Posterior Chain & Core Stability.",
        "strength_prehab": "Romanian Deadlifts (3x10), Bird-dogs (3x10/side with 3s hold), Side planks (3x35s/side), Deadbugs (3x12), Back extensions (3x12).",
        "fueling": "Normal balanced diet"
      },
      {
        "day": "Friday",
        "date": "2026-08-21",
        "type": "Mid-Week Aerobic",
        "distance_km": 5,
        "target_pace": "7:20 - 7:35 min/km",
        "rpe": 3,
        "description": "Smooth conversational pace to build weekly aerobic base.",
        "strength_prehab": "Dynamic warmup & ankle mobility",
        "fueling": "Water as needed"
      },
      {
        "day": "Saturday",
        "date": "2026-08-22",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Complete rest day before long run.",
        "strength_prehab": "Light walking / gentle stretching only",
        "fueling": "Hydrate well with 2-2.5L fluids"
      },
      {
        "day": "Sunday",
        "date": "2026-08-23",
        "type": "Long Run",
        "distance_km": 7,
        "target_pace": "7:35 - 7:45 min/km",
        "rpe": 3,
        "description": "Week 1 long run. Focus on relaxed breathing, light foot strikes, and time on feet.",
        "strength_prehab": "Post-run 10-min calf and quad flush",
        "fueling": "Water sips every 2 km"
      }
    ]
  },
  {
    "week_number": 2,
    "phase": "Prep & Foundation",
    "start_date": "2026-08-24",
    "end_date": "2026-08-30",
    "total_planned_km": 24,
    "is_deload": false,
    "focus": "Introducing hill form & tempo strides",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-08-24",
        "type": "Recovery Run",
        "distance_km": 4.5,
        "target_pace": "7:50 - 8:10 min/km",
        "rpe": 2,
        "description": "Gentle recovery run.",
        "strength_prehab": "Calf stretching on step",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-08-25",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Lower Body & Calf Armor.",
        "strength_prehab": "Eccentric heel drops (3x15), seated soleus raises (3x15), split squats, glute bridges, tibialis raises.",
        "fueling": "Protein & carbs"
      },
      {
        "day": "Wednesday",
        "date": "2026-08-26",
        "type": "Speed (Hill Intro)",
        "distance_km": 6,
        "target_pace": "7:45 warmup/cooldown, uphill RPE 7-8",
        "rpe": 7,
        "description": "2 km warmup, 4x60-sec steady uphill repeats (focus on posture & high knees, jog down recovery), 2 km cooldown.",
        "strength_prehab": "Calf & Achilles dynamic activation",
        "fueling": "Banana/toast 45 min before"
      },
      {
        "day": "Thursday",
        "date": "2026-08-27",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Posterior Chain & Core.",
        "strength_prehab": "RDLs, Bird-dogs, Side planks, Deadbugs, Supermans.",
        "fueling": "Balanced nutrition"
      },
      {
        "day": "Friday",
        "date": "2026-08-28",
        "type": "Mid-Week Aerobic",
        "distance_km": 5.5,
        "target_pace": "7:15 - 7:30 min/km",
        "rpe": 3,
        "description": "Aerobic cruise.",
        "strength_prehab": "Hip mobility drills",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-08-29",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Complete Rest.",
        "strength_prehab": "Foam roll quads & glutes",
        "fueling": "Hydration tracking"
      },
      {
        "day": "Sunday",
        "date": "2026-08-30",
        "type": "Long Run",
        "distance_km": 8,
        "target_pace": "7:30 - 7:45 min/km",
        "rpe": 3,
        "description": "Long run. Test 1st Energy Gel at 45-min mark with water.",
        "strength_prehab": "Post-run calf massage",
        "fueling": "1 Energy Gel at 45 min + water sips"
      }
    ]
  },
  {
    "week_number": 3,
    "phase": "Prep & Foundation",
    "start_date": "2026-08-31",
    "end_date": "2026-09-06",
    "total_planned_km": 27,
    "is_deload": false,
    "focus": "First double-digit long run + hydration & salt capsule test",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-08-31",
        "type": "Recovery Run",
        "distance_km": 5,
        "target_pace": "7:50 - 8:10 min/km",
        "rpe": 2,
        "description": "Easy recovery jog.",
        "strength_prehab": "Hip & calf flush",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-09-01",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Lower Body & Calf Armor (Add 2.5kg weight).",
        "strength_prehab": "Eccentric heel drops, soleus raises, lunges, glute bridges, tibialis raises.",
        "fueling": "Protein"
      },
      {
        "day": "Wednesday",
        "date": "2026-09-02",
        "type": "Speed (Tempo Intro)",
        "distance_km": 6,
        "target_pace": "6:30 min/km tempo intervals",
        "rpe": 7,
        "description": "1.5 km warmup, 3x1 km @ Tempo Pace (6:30 min/km) with 2 min walk rest, 1.5 km cooldown.",
        "strength_prehab": "Hamstring dynamic swings",
        "fueling": "Carb snack pre-run"
      },
      {
        "day": "Thursday",
        "date": "2026-09-03",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Posterior Chain & Core.",
        "strength_prehab": "RDLs, Bird-dogs, Side planks, Pallof press, Supermans.",
        "fueling": "Balanced nutrition"
      },
      {
        "day": "Friday",
        "date": "2026-09-04",
        "type": "Mid-Week Aerobic",
        "distance_km": 6,
        "target_pace": "7:15 - 7:30 min/km",
        "rpe": 3,
        "description": "Aerobic base builder.",
        "strength_prehab": "Ankle mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-09-05",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Rest & hydrate for 10k long run.",
        "strength_prehab": "Light stretching",
        "fueling": "Electrolyte drink"
      },
      {
        "day": "Sunday",
        "date": "2026-09-06",
        "type": "Long Run",
        "distance_km": 10,
        "target_pace": "7:30 - 7:45 min/km",
        "rpe": 4,
        "description": "First 10 km long run. Take 1 Gel at km 6 + 1 Salt capsule at km 5.",
        "strength_prehab": "Post-run calf and hamstring stretch",
        "fueling": "1 Gel at km 6 + 1 Salt capsule at km 5 + water"
      }
    ]
  },
  {
    "week_number": 4,
    "phase": "Prep & Foundation",
    "start_date": "2026-09-07",
    "end_date": "2026-09-13",
    "total_planned_km": 20,
    "is_deload": true,
    "focus": "DELOAD WEEK 1: Neuromuscular recovery & soft-tissue adaptation",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-09-07",
        "type": "Recovery Run",
        "distance_km": 4,
        "target_pace": "8:00 min/km",
        "rpe": 2,
        "description": "Very easy recovery jog.",
        "strength_prehab": "Gentle foam rolling",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-09-08",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 4,
        "description": "Light bodyweight mobility & calf activation (2x10 reps).",
        "strength_prehab": "Bodyweight only",
        "fueling": "Nutritious recovery meals"
      },
      {
        "day": "Wednesday",
        "date": "2026-09-09",
        "type": "Speed (Strides)",
        "distance_km": 4,
        "target_pace": "7:45 warmup, strides",
        "rpe": 5,
        "description": "2 km easy, 4x100m relaxed strides, 1.5 km easy.",
        "strength_prehab": "Dynamic leg swings",
        "fueling": "Water"
      },
      {
        "day": "Thursday",
        "date": "2026-09-10",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 4,
        "description": "Light core & spine stabilization.",
        "strength_prehab": "Bird-dogs, deadbugs, side planks (2 sets)",
        "fueling": "Balanced diet"
      },
      {
        "day": "Friday",
        "date": "2026-09-11",
        "type": "Mid-Week Aerobic",
        "distance_km": 5,
        "target_pace": "7:25 - 7:40 min/km",
        "rpe": 3,
        "description": "Easy cruise.",
        "strength_prehab": "Hip openers",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-09-12",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Sleep 8+ hours",
        "fueling": "Hydration"
      },
      {
        "day": "Sunday",
        "date": "2026-09-13",
        "type": "Long Run",
        "distance_km": 7,
        "target_pace": "7:40 - 7:50 min/km",
        "rpe": 3,
        "description": "Deload long run. Low heart rate, super easy effort.",
        "strength_prehab": "Calf stretching",
        "fueling": "Water sips"
      }
    ]
  },
  {
    "week_number": 5,
    "phase": "Aerobic Base Building",
    "start_date": "2026-09-14",
    "end_date": "2026-09-20",
    "total_planned_km": 29,
    "is_deload": false,
    "focus": "Aerobic base expansion; introducing 400m intervals",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-09-14",
        "type": "Recovery Run",
        "distance_km": 5,
        "target_pace": "7:50 min/km",
        "rpe": 2,
        "description": "Recovery run.",
        "strength_prehab": "Calf & hamstring flush",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-09-15",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Lower Body & Calf Armor (3x15 eccentric drops).",
        "strength_prehab": "Heel drops, soleus raises, split squats, glute bridges, tibialis raises.",
        "fueling": "Protein"
      },
      {
        "day": "Wednesday",
        "date": "2026-09-16",
        "type": "Speed (Intervals)",
        "distance_km": 6,
        "target_pace": "5:50 min/km intervals",
        "rpe": 7,
        "description": "1.5 km warmup, 4x400m @ 5:50 min/km (200m jog rest), 2 km cooldown.",
        "strength_prehab": "Calf dynamic prep",
        "fueling": "Carb snack"
      },
      {
        "day": "Thursday",
        "date": "2026-09-17",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Posterior Chain & Core.",
        "strength_prehab": "RDLs, Bird-dogs, Side planks, Pallof press.",
        "fueling": "Balanced diet"
      },
      {
        "day": "Friday",
        "date": "2026-09-18",
        "type": "Mid-Week Aerobic",
        "distance_km": 6,
        "target_pace": "7:15 - 7:30 min/km",
        "rpe": 3,
        "description": "Smooth aerobic building run.",
        "strength_prehab": "Dynamic warmup",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-09-19",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Mobility work",
        "fueling": "Hydration"
      },
      {
        "day": "Sunday",
        "date": "2026-09-20",
        "type": "Long Run",
        "distance_km": 12,
        "target_pace": "7:30 - 7:45 min/km",
        "rpe": 4,
        "description": "12 km long run. Gels at km 5 and 10; salt capsule at km 6.",
        "strength_prehab": "Post-run calf recovery",
        "fueling": "2 Gels + 1 Salt capsule + water"
      }
    ]
  },
  {
    "week_number": 6,
    "phase": "Aerobic Base Building",
    "start_date": "2026-09-21",
    "end_date": "2026-09-27",
    "total_planned_km": 33,
    "is_deload": false,
    "focus": "Pedder Road hill simulation workout #1",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-09-21",
        "type": "Recovery Run",
        "distance_km": 5,
        "target_pace": "7:50 min/km",
        "rpe": 2,
        "description": "Easy recovery run.",
        "strength_prehab": "Calf & hip stretch",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-09-22",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Lower Body & Calf Armor.",
        "strength_prehab": "Eccentric heel drops (weighted), soleus raises, split squats, glute bridges, tibialis raises.",
        "fueling": "Protein"
      },
      {
        "day": "Wednesday",
        "date": "2026-09-23",
        "type": "Speed (Hill Repeats)",
        "distance_km": 7,
        "target_pace": "Uphill RPE 8, cooldown 7:45",
        "rpe": 8,
        "description": "2 km warmup, 5x90-sec steady uphill repeats (focus on glute drive, jog down recovery), 2 km cooldown.",
        "strength_prehab": "Calf & Achilles prep",
        "fueling": "Carb snack"
      },
      {
        "day": "Thursday",
        "date": "2026-09-24",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Posterior Chain & Core.",
        "strength_prehab": "RDLs, Bird-dogs, Side planks, Supermans.",
        "fueling": "Balanced nutrition"
      },
      {
        "day": "Friday",
        "date": "2026-09-25",
        "type": "Mid-Week Aerobic",
        "distance_km": 7,
        "target_pace": "7:15 - 7:30 min/km",
        "rpe": 3,
        "description": "Aerobic foundation run.",
        "strength_prehab": "Ankle mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-09-26",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Gentle stretching",
        "fueling": "Electrolyte hydration"
      },
      {
        "day": "Sunday",
        "date": "2026-09-27",
        "type": "Long Run",
        "distance_km": 14,
        "target_pace": "7:30 - 7:45 min/km",
        "rpe": 4,
        "description": "14 km long run with full hydration vest test.",
        "strength_prehab": "Post-run calf flush",
        "fueling": "2 Gels (km 5, 10) + 1 Salt capsule (km 6) + 1L water"
      }
    ]
  },
  {
    "week_number": 7,
    "phase": "Aerobic Base Building",
    "start_date": "2026-09-28",
    "end_date": "2026-10-04",
    "total_planned_km": 37,
    "is_deload": false,
    "focus": "Long run nutrition & electrolyte test (400mg Na/hr)",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-09-28",
        "type": "Recovery Run",
        "distance_km": 6,
        "target_pace": "7:50 min/km",
        "rpe": 2,
        "description": "Easy recovery run.",
        "strength_prehab": "Foam rolling calves & quads",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-09-29",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Lower Body & Calf Armor.",
        "strength_prehab": "Eccentric heel drops, soleus raises, split squats, glute bridges, tibialis raises.",
        "fueling": "Protein"
      },
      {
        "day": "Wednesday",
        "date": "2026-09-30",
        "type": "Speed (Threshold Tempo)",
        "distance_km": 7,
        "target_pace": "6:25 - 6:35 min/km tempo",
        "rpe": 7,
        "description": "1.5 km warmup, 4 km continuous @ Tempo (6:25-6:35 min/km), 1.5 km cooldown.",
        "strength_prehab": "Hamstring & calf dynamic stretches",
        "fueling": "Carb snack pre-run"
      },
      {
        "day": "Thursday",
        "date": "2026-10-01",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Posterior Chain & Core.",
        "strength_prehab": "RDLs, Bird-dogs, Side planks, Deadbugs.",
        "fueling": "Balanced diet"
      },
      {
        "day": "Friday",
        "date": "2026-10-02",
        "type": "Mid-Week Aerobic",
        "distance_km": 8,
        "target_pace": "7:15 - 7:30 min/km",
        "rpe": 3,
        "description": "Aerobic base builder.",
        "strength_prehab": "Hip openers",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-10-03",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Light walking only",
        "fueling": "Carb-focused dinner + hydration"
      },
      {
        "day": "Sunday",
        "date": "2026-10-04",
        "type": "Long Run",
        "distance_km": 16,
        "target_pace": "7:30 - 7:45 min/km",
        "rpe": 4,
        "description": "16 km long run. Gels at km 5, 10, 14 + Salt capsules at km 5 & 12.",
        "strength_prehab": "Post-run calf & hamstring stretch",
        "fueling": "3 Gels + 2 Salt capsules + water"
      }
    ]
  },
  {
    "week_number": 8,
    "phase": "Aerobic Base Building",
    "start_date": "2026-10-05",
    "end_date": "2026-10-11",
    "total_planned_km": 26,
    "is_deload": true,
    "focus": "DELOAD WEEK 2: Mid-Base 10K Time Trial Benchmark (Aim: Sub-59 min)",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-10-05",
        "type": "Recovery Run",
        "distance_km": 4,
        "target_pace": "8:00 min/km",
        "rpe": 2,
        "description": "Gentle shakeout.",
        "strength_prehab": "Calf stretching",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-10-06",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 4,
        "description": "Light bodyweight calf raises & glute bridges (2x10).",
        "strength_prehab": "Bodyweight only",
        "fueling": "Balanced meals"
      },
      {
        "day": "Wednesday",
        "date": "2026-10-07",
        "type": "Speed (Shakeout)",
        "distance_km": 3,
        "target_pace": "7:45 min/km + pickups",
        "rpe": 4,
        "description": "3 km shakeout + 3x30-sec pickups.",
        "strength_prehab": "Light dynamic stretches",
        "fueling": "Water"
      },
      {
        "day": "Thursday",
        "date": "2026-10-08",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 4,
        "description": "Light core and back mobility.",
        "strength_prehab": "Bird-dogs and side planks (2 sets)",
        "fueling": "Balanced diet"
      },
      {
        "day": "Friday",
        "date": "2026-10-09",
        "type": "Mid-Week Aerobic",
        "distance_km": 5,
        "target_pace": "7:20 min/km + 3 strides",
        "rpe": 3,
        "description": "5 km easy with 3x100m strides.",
        "strength_prehab": "Dynamic mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-10-10",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest before Time Trial.",
        "strength_prehab": "Rest",
        "fueling": "Carb dinner + hydration"
      },
      {
        "day": "Sunday",
        "date": "2026-10-11",
        "type": "10K Time Trial",
        "distance_km": 10,
        "target_pace": "5:50 - 5:55 min/km race effort",
        "rpe": 9,
        "description": "10K TIME TRIAL BENCHMARK: 1.5 km warmup, 10 km Time Trial @ Maximum Sustainable Effort (Target: 58:00-59:30), 1 km cooldown.",
        "strength_prehab": "Full post-race stretching and recovery",
        "fueling": "Pre-race snack + water"
      }
    ]
  },
  {
    "week_number": 9,
    "phase": "Aerobic Base Building",
    "start_date": "2026-10-12",
    "end_date": "2026-10-18",
    "total_planned_km": 41.1,
    "is_deload": false,
    "focus": "PROCAM SLAM #1: Vedanta Delhi Half Marathon (VDHM) — Non-Tapered Training Effort",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-10-12",
        "type": "Recovery Run",
        "distance_km": 5,
        "target_pace": "7:55 min/km",
        "rpe": 2,
        "description": "Post-10K recovery run.",
        "strength_prehab": "Calf & hamstring flush",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-10-13",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Lower Body & Calf Armor.",
        "strength_prehab": "Eccentric heel drops (3x15), seated calf raises (3x15), split squats, glute bridges, tibialis raises.",
        "fueling": "Protein"
      },
      {
        "day": "Wednesday",
        "date": "2026-10-14",
        "type": "Speed (Strides)",
        "distance_km": 7,
        "target_pace": "7:40 warmup, strides",
        "rpe": 7,
        "description": "2 km warmup, 4x100m relaxed strides, 4.5 km easy. Pre-Delhi shakeout.",
        "strength_prehab": "Dynamic prep",
        "fueling": "Carb snack"
      },
      {
        "day": "Thursday",
        "date": "2026-10-15",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Posterior Chain & Core.",
        "strength_prehab": "RDLs, Bird-dogs, Side planks, Pallof press, Back extensions.",
        "fueling": "Balanced nutrition"
      },
      {
        "day": "Friday",
        "date": "2026-10-16",
        "type": "Mid-Week Aerobic",
        "distance_km": 8,
        "target_pace": "7:15 - 7:30 min/km",
        "rpe": 3,
        "description": "Aerobic cruise.",
        "strength_prehab": "Hip mobility drills",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-10-17",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Foam roll calves & quads",
        "fueling": "Hydrate with electrolyte drink"
      },
      {
        "day": "Sunday",
        "date": "2026-10-18",
        "type": "VDHM 2026 (HM)",
        "distance_km": 21.1,
        "target_pace": "7:20 - 7:35 min/km",
        "rpe": 5,
        "description": "PROCAM SLAM #1: VEDANTA DELHI HALF MARATHON (21.1 km). Steady, controlled training pace. Gels at km 6, 12, 17 + Salt capsules at km 6 & 14. Do not race at 100% effort.",
        "strength_prehab": "Post-run calf ice/elevation & stretch",
        "fueling": "3 Gels + 2 Salt capsules + on-course water"
      }
    ]
  },
  {
    "week_number": 10,
    "phase": "Aerobic Base Building",
    "start_date": "2026-10-19",
    "end_date": "2026-10-25",
    "total_planned_km": 42,
    "is_deload": false,
    "focus": "Breaking the 20K barrier @ 7:30-7:45 min/km",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-10-19",
        "type": "Recovery Run",
        "distance_km": 6,
        "target_pace": "7:50 min/km",
        "rpe": 2,
        "description": "Recovery run.",
        "strength_prehab": "Calf & hamstring flush",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-10-20",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Lower Body & Calf Armor.",
        "strength_prehab": "Eccentric heel drops, seated calf raises, Bulgarian split squats, glute bridges, tibialis raises.",
        "fueling": "Protein"
      },
      {
        "day": "Wednesday",
        "date": "2026-10-21",
        "type": "Speed (Hills + Tempo)",
        "distance_km": 8,
        "target_pace": "Hills RPE 8, Tempo 6:30 min/km",
        "rpe": 8,
        "description": "2 km warmup, 4x75-sec hill repeats, 2 km @ Tempo (6:30 min/km), 1.5 km cooldown.",
        "strength_prehab": "Calf & Achilles prep",
        "fueling": "Carb snack"
      },
      {
        "day": "Thursday",
        "date": "2026-10-22",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Posterior Chain & Core.",
        "strength_prehab": "RDLs, Bird-dogs, Side planks, Supermans.",
        "fueling": "Balanced nutrition"
      },
      {
        "day": "Friday",
        "date": "2026-10-23",
        "type": "Mid-Week Aerobic",
        "distance_km": 8,
        "target_pace": "7:15 - 7:30 min/km",
        "rpe": 3,
        "description": "Aerobic foundation run.",
        "strength_prehab": "Ankle mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-10-24",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Light stretching",
        "fueling": "Carb-rich dinner + electrolytes"
      },
      {
        "day": "Sunday",
        "date": "2026-10-25",
        "type": "Long Run",
        "distance_km": 20,
        "target_pace": "7:30 - 7:45 min/km",
        "rpe": 4,
        "description": "20 km Long Run. 4 Gels (every 40 min) + 2 Salt capsules (km 6, 14) + hydration vest.",
        "strength_prehab": "Post-run calf massage",
        "fueling": "4 Gels + 2 Salt capsules + 1.5L water"
      }
    ]
  },
  {
    "week_number": 11,
    "phase": "Aerobic Base Building",
    "start_date": "2026-10-26",
    "end_date": "2026-11-01",
    "total_planned_km": 45,
    "is_deload": false,
    "focus": "Sustained aerobic volume + 1K speed repeats",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-10-26",
        "type": "Recovery Run",
        "distance_km": 6,
        "target_pace": "7:50 min/km",
        "rpe": 2,
        "description": "Recovery run.",
        "strength_prehab": "Calf & hip stretch",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-10-27",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Lower Body & Calf Armor.",
        "strength_prehab": "Eccentric heel drops, soleus raises, split squats, glute bridges, tibialis raises.",
        "fueling": "Protein"
      },
      {
        "day": "Wednesday",
        "date": "2026-10-28",
        "type": "Speed (1K Repeats)",
        "distance_km": 8,
        "target_pace": "5:50 min/km intervals",
        "rpe": 8,
        "description": "1.5 km warmup, 4x1 km @ 5:50 min/km (2 min jog rest), 1.5 km cooldown.",
        "strength_prehab": "Dynamic leg swings",
        "fueling": "Carb snack"
      },
      {
        "day": "Thursday",
        "date": "2026-10-29",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Posterior Chain & Core.",
        "strength_prehab": "RDLs, Bird-dogs, Side planks, Deadbugs.",
        "fueling": "Balanced diet"
      },
      {
        "day": "Friday",
        "date": "2026-10-30",
        "type": "Mid-Week Aerobic",
        "distance_km": 9,
        "target_pace": "7:15 - 7:30 min/km",
        "rpe": 3,
        "description": "Mid-week aerobic anchor.",
        "strength_prehab": "Hip openers",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-10-31",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Foam rolling",
        "fueling": "Hydration tracking"
      },
      {
        "day": "Sunday",
        "date": "2026-11-01",
        "type": "Long Run",
        "distance_km": 22,
        "target_pace": "7:30 - 7:45 min/km (Last 2k @ 7:06)",
        "rpe": 5,
        "description": "22 km Long Run. First 20 km @ 7:35 min/km, last 2 km @ Marathon Pace (7:06 min/km).",
        "strength_prehab": "Post-run calf recovery",
        "fueling": "4 Gels + 3 Salt capsules + 1.5L water"
      }
    ]
  },
  {
    "week_number": 12,
    "phase": "Aerobic Base Building",
    "start_date": "2026-11-02",
    "end_date": "2026-11-08",
    "total_planned_km": 32,
    "is_deload": true,
    "focus": "DELOAD WEEK 3: Mid-program reset & musculoskeletal check",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-11-02",
        "type": "Recovery Run",
        "distance_km": 5,
        "target_pace": "8:00 min/km",
        "rpe": 2,
        "description": "Gentle recovery jog.",
        "strength_prehab": "Gentle stretching",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-11-03",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 4,
        "description": "Bodyweight maintenance (2 sets).",
        "strength_prehab": "Calf raises, glute bridges, lunges",
        "fueling": "Balanced meals"
      },
      {
        "day": "Wednesday",
        "date": "2026-11-04",
        "type": "Speed (Strides)",
        "distance_km": 5,
        "target_pace": "7:45 warmup, strides",
        "rpe": 5,
        "description": "2 km easy, 5x100m strides, 1.5 km easy.",
        "strength_prehab": "Dynamic prep",
        "fueling": "Water"
      },
      {
        "day": "Thursday",
        "date": "2026-11-05",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 4,
        "description": "Core stability & hip flexor release.",
        "strength_prehab": "Bird-dogs, deadbugs (2 sets)",
        "fueling": "Balanced diet"
      },
      {
        "day": "Friday",
        "date": "2026-11-06",
        "type": "Mid-Week Aerobic",
        "distance_km": 6,
        "target_pace": "7:25 min/km",
        "rpe": 3,
        "description": "Easy aerobic run.",
        "strength_prehab": "Dynamic mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-11-07",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Sleep 8+ hours",
        "fueling": "Hydration"
      },
      {
        "day": "Sunday",
        "date": "2026-11-08",
        "type": "Long Run",
        "distance_km": 14,
        "target_pace": "7:35 - 7:45 min/km",
        "rpe": 3,
        "description": "Deload long run. Low heart rate, smooth cruising.",
        "strength_prehab": "Calf stretching",
        "fueling": "2 Gels + 1 Salt capsule + water"
      }
    ]
  },
  {
    "week_number": 13,
    "phase": "Peak & Race Specificity",
    "start_date": "2026-11-09",
    "end_date": "2026-11-15",
    "total_planned_km": 46,
    "is_deload": false,
    "focus": "Peak phase opening; Marathon Pace threshold blocks",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-11-09",
        "type": "Recovery Run",
        "distance_km": 6,
        "target_pace": "7:50 min/km",
        "rpe": 2,
        "description": "Recovery run.",
        "strength_prehab": "Calf & hamstring flush",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-11-10",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Lower Body & Calf Armor.",
        "strength_prehab": "Eccentric heel drops, seated calf raises, Bulgarian split squats, glute bridges, tibialis raises.",
        "fueling": "Protein"
      },
      {
        "day": "Wednesday",
        "date": "2026-11-11",
        "type": "Speed (MP Tempo)",
        "distance_km": 8,
        "target_pace": "7:00 - 7:06 min/km MP block",
        "rpe": 6,
        "description": "2 km warmup, 4 km continuous @ Marathon Pace (7:00-7:06 min/km), 2 km cooldown.",
        "strength_prehab": "Dynamic stretches",
        "fueling": "Carb snack"
      },
      {
        "day": "Thursday",
        "date": "2026-11-12",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Posterior Chain & Core.",
        "strength_prehab": "RDLs, Bird-dogs, Side planks, Pallof press.",
        "fueling": "Balanced nutrition"
      },
      {
        "day": "Friday",
        "date": "2026-11-13",
        "type": "Mid-Week Aerobic",
        "distance_km": 8,
        "target_pace": "7:15 - 7:25 min/km",
        "rpe": 3,
        "description": "Aerobic rhythm run.",
        "strength_prehab": "Hip mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-11-14",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Foam rolling",
        "fueling": "Hydration tracking"
      },
      {
        "day": "Sunday",
        "date": "2026-11-15",
        "type": "Long Run",
        "distance_km": 24,
        "target_pace": "7:30 - 7:45 min/km",
        "rpe": 4,
        "description": "24 km Long Run. Gels every 40 mins + Salt capsules at km 6, 12, 18.",
        "strength_prehab": "Post-run calf recovery",
        "fueling": "5 Gels + 3 Salt capsules + 1.5L water"
      }
    ]
  },
  {
    "week_number": 14,
    "phase": "Peak & Race Specificity",
    "start_date": "2026-11-16",
    "end_date": "2026-11-22",
    "total_planned_km": 40,
    "is_deload": false,
    "focus": "HALF MARATHON RACE SIMULATION (Aim: 2:23-2:27)",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-11-16",
        "type": "Recovery Run",
        "distance_km": 5,
        "target_pace": "8:00 min/km",
        "rpe": 2,
        "description": "Short easy recovery.",
        "strength_prehab": "Gentle calf stretches",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-11-17",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 4,
        "description": "Light calf & glute activation (2 sets).",
        "strength_prehab": "Bodyweight only",
        "fueling": "Balanced meals"
      },
      {
        "day": "Wednesday",
        "date": "2026-11-18",
        "type": "Speed (Shakeout)",
        "distance_km": 4,
        "target_pace": "7:45 min/km + strides",
        "rpe": 4,
        "description": "4 km shakeout + 4x100m strides.",
        "strength_prehab": "Dynamic stretches",
        "fueling": "Water"
      },
      {
        "day": "Thursday",
        "date": "2026-11-19",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 3,
        "description": "Core & mobility only.",
        "strength_prehab": "Bird-dogs, deadbugs",
        "fueling": "Balanced diet"
      },
      {
        "day": "Friday",
        "date": "2026-11-20",
        "type": "Mid-Week Aerobic",
        "distance_km": 6,
        "target_pace": "7:20 min/km",
        "rpe": 3,
        "description": "Easy aerobic run.",
        "strength_prehab": "Dynamic mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-11-21",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest. Full race-morning meal rehearsal.",
        "strength_prehab": "Rest",
        "fueling": "High-carb dinner + hydration"
      },
      {
        "day": "Sunday",
        "date": "2026-11-22",
        "type": "HM Simulation",
        "distance_km": 21.1,
        "target_pace": "Progressive: 7:10 -> 6:50 -> 6:35 min/km",
        "rpe": 8,
        "description": "HALF MARATHON RACE SIMULATION (21.1 km): First 5 km @ 7:10, km 5-16 @ 6:45-6:55, km 16-21.1 @ 6:30-6:40. Target: 2:23:00-2:27:00.",
        "strength_prehab": "Full post-race recovery protocol",
        "fueling": "3 Gels (km 6, 12, 17) + 2 Salt capsules + 1.2L water"
      }
    ]
  },
  {
    "week_number": 15,
    "phase": "Peak & Race Specificity",
    "start_date": "2026-11-23",
    "end_date": "2026-11-29",
    "total_planned_km": 50,
    "is_deload": false,
    "focus": "High volume peak week; Pedder Road Hill Attack; 26 km Long Run",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-11-23",
        "type": "Recovery Run",
        "distance_km": 6,
        "target_pace": "7:55 min/km",
        "rpe": 2,
        "description": "Post-HM recovery run.",
        "strength_prehab": "Calf & hamstring flush",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-11-24",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Lower Body & Calf Armor.",
        "strength_prehab": "Eccentric heel drops, seated calf raises, Bulgarian split squats, glute bridges, tibialis raises.",
        "fueling": "Protein"
      },
      {
        "day": "Wednesday",
        "date": "2026-11-25",
        "type": "Speed (Hill Attack)",
        "distance_km": 9,
        "target_pace": "Uphill RPE 8, cooldown 7:45",
        "rpe": 8,
        "description": "2 km warmup, 6x90-sec hill repeats @ RPE 8 (Pedder Road prep), 2 km cooldown.",
        "strength_prehab": "Calf & Achilles prep",
        "fueling": "Carb snack"
      },
      {
        "day": "Thursday",
        "date": "2026-11-26",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Posterior Chain & Core.",
        "strength_prehab": "RDLs, Bird-dogs, Side planks, Supermans.",
        "fueling": "Balanced nutrition"
      },
      {
        "day": "Friday",
        "date": "2026-11-27",
        "type": "Mid-Week Aerobic",
        "distance_km": 9,
        "target_pace": "7:15 - 7:30 min/km",
        "rpe": 3,
        "description": "Aerobic volume builder.",
        "strength_prehab": "Hip mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-11-28",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Foam rolling",
        "fueling": "Carb dinner + hydration"
      },
      {
        "day": "Sunday",
        "date": "2026-11-29",
        "type": "Long Run",
        "distance_km": 26,
        "target_pace": "7:30 - 7:45 min/km",
        "rpe": 5,
        "description": "26 km Long Run. Practice taking 5 full gels + 3 salt capsules.",
        "strength_prehab": "Post-run calf recovery",
        "fueling": "5 Gels + 3 Salt capsules + 1.8L water"
      }
    ]
  },
  {
    "week_number": 16,
    "phase": "Peak & Race Specificity",
    "start_date": "2026-11-30",
    "end_date": "2026-12-06",
    "total_planned_km": 36,
    "is_deload": true,
    "focus": "DELOAD WEEK 4: Pre-peak recovery & glycogen store refresh",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-11-30",
        "type": "Recovery Run",
        "distance_km": 5,
        "target_pace": "8:00 min/km",
        "rpe": 2,
        "description": "Gentle recovery run.",
        "strength_prehab": "Gentle stretching",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-12-01",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 4,
        "description": "Bodyweight maintenance (2 sets).",
        "strength_prehab": "Calf raises, glute bridges",
        "fueling": "Balanced meals"
      },
      {
        "day": "Wednesday",
        "date": "2026-12-02",
        "type": "Speed (Strides)",
        "distance_km": 6,
        "target_pace": "7:45 warmup, strides",
        "rpe": 5,
        "description": "2 km easy, 5x100m strides, 2 km easy.",
        "strength_prehab": "Dynamic prep",
        "fueling": "Water"
      },
      {
        "day": "Thursday",
        "date": "2026-12-03",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 4,
        "description": "Core & lower back mobility.",
        "strength_prehab": "Bird-dogs, deadbugs (2 sets)",
        "fueling": "Balanced diet"
      },
      {
        "day": "Friday",
        "date": "2026-12-04",
        "type": "Mid-Week Aerobic",
        "distance_km": 7,
        "target_pace": "7:25 min/km",
        "rpe": 3,
        "description": "Easy aerobic run.",
        "strength_prehab": "Dynamic mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-12-05",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Sleep 8+ hours",
        "fueling": "Hydration"
      },
      {
        "day": "Sunday",
        "date": "2026-12-06",
        "type": "Long Run",
        "distance_km": 16,
        "target_pace": "7:35 - 7:45 min/km",
        "rpe": 3,
        "description": "Deload long run. Easy, relaxed rhythm.",
        "strength_prehab": "Calf stretching",
        "fueling": "2 Gels + 1 Salt capsule + water"
      }
    ]
  },
  {
    "week_number": 17,
    "phase": "Peak & Race Specificity",
    "start_date": "2026-12-07",
    "end_date": "2026-12-13",
    "total_planned_km": 55,
    "is_deload": false,
    "focus": "Heavy volume builder; 30 km Peak Distance Long Run",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-12-07",
        "type": "Recovery Run",
        "distance_km": 7,
        "target_pace": "7:50 min/km",
        "rpe": 2,
        "description": "Recovery run.",
        "strength_prehab": "Calf & hamstring flush",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-12-08",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Lower Body & Calf Armor.",
        "strength_prehab": "Eccentric heel drops, seated calf raises, Bulgarian split squats, glute bridges, tibialis raises.",
        "fueling": "Protein"
      },
      {
        "day": "Wednesday",
        "date": "2026-12-09",
        "type": "Speed (Threshold Blocks)",
        "distance_km": 8,
        "target_pace": "6:25 min/km tempo blocks",
        "rpe": 7,
        "description": "2 km warmup, 3x1.5 km @ 6:25 min/km (2 min rest), 1.5 km cooldown.",
        "strength_prehab": "Dynamic stretches",
        "fueling": "Carb snack"
      },
      {
        "day": "Thursday",
        "date": "2026-12-10",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Posterior Chain & Core.",
        "strength_prehab": "RDLs, Bird-dogs, Side planks, Pallof press.",
        "fueling": "Balanced nutrition"
      },
      {
        "day": "Friday",
        "date": "2026-12-11",
        "type": "Mid-Week Aerobic",
        "distance_km": 10,
        "target_pace": "7:15 - 7:30 min/km",
        "rpe": 3,
        "description": "Double-digit mid-week aerobic run.",
        "strength_prehab": "Hip mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-12-12",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Foam rolling",
        "fueling": "Carb dinner + hydration"
      },
      {
        "day": "Sunday",
        "date": "2026-12-13",
        "type": "Peak Long Run",
        "distance_km": 30,
        "target_pace": "7:35 - 7:45 min/km (Last 3k @ 7:06)",
        "rpe": 6,
        "description": "30 km Peak Distance Run. First 27 km @ 7:35 min/km, last 3 km @ Marathon Pace (7:06 min/km). Max time-on-feet conditioning.",
        "strength_prehab": "Post-run calf recovery",
        "fueling": "6 Gels + 4 Salt capsules + 2L water"
      }
    ]
  },
  {
    "week_number": 18,
    "phase": "Peak & Race Specificity",
    "start_date": "2026-12-14",
    "end_date": "2026-12-20",
    "total_planned_km": 49,
    "is_deload": false,
    "focus": "PROCAM SLAM #2: Tata Steel World 25K Kolkata — Marathon Pace Dress Rehearsal",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-12-14",
        "type": "Recovery Run",
        "distance_km": 6,
        "target_pace": "7:55 min/km",
        "rpe": 2,
        "description": "Gentle recovery run.",
        "strength_prehab": "Calf & hamstring flush",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-12-15",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Lower Body & Calf Armor (Final heavy strength week).",
        "strength_prehab": "Eccentric heel drops, seated calf raises, split squats, glute bridges, tibialis raises.",
        "fueling": "Protein"
      },
      {
        "day": "Wednesday",
        "date": "2026-12-16",
        "type": "Pre-Race Easy + Strides",
        "distance_km": 8,
        "target_pace": "7:30 - 7:45 min/km",
        "rpe": 6,
        "description": "2 km warmup, 4x100m strides, 5.5 km easy shakeout before traveling to Kolkata.",
        "strength_prehab": "Dynamic stretches",
        "fueling": "Carb snack"
      },
      {
        "day": "Thursday",
        "date": "2026-12-17",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 5,
        "description": "Posterior Chain & Core.",
        "strength_prehab": "RDLs, Bird-dogs, Side planks, Supermans.",
        "fueling": "Balanced nutrition"
      },
      {
        "day": "Friday",
        "date": "2026-12-18",
        "type": "Mid-Week Aerobic",
        "distance_km": 10,
        "target_pace": "7:15 - 7:30 min/km",
        "rpe": 3,
        "description": "Mid-week aerobic anchor.",
        "strength_prehab": "Hip mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-12-19",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest. Hyper-hydrate with electrolytes.",
        "strength_prehab": "Rest",
        "fueling": "High-carb loading meals + 2.5L fluids"
      },
      {
        "day": "Sunday",
        "date": "2026-12-20",
        "type": "TSW Kolkata 25K",
        "distance_km": 25,
        "target_pace": "First 15k @ 7:25, Last 10k @ 7:05 min/km",
        "rpe": 6,
        "description": "PROCAM SLAM #2: TATA STEEL WORLD 25K KOLKATA (25 km). Marathon Goal Pace Dress Rehearsal. First 15 km steady @ 7:25 min/km, last 10 km locked at Marathon Goal Pace (7:00-7:06 min/km). Target: ~3:00:00.",
        "strength_prehab": "Full post-run ice/foam roll & elevation",
        "fueling": "5 Gels + 3 Salt capsules + water"
      }
    ]
  },
  {
    "week_number": 19,
    "phase": "Peak & Race Specificity",
    "start_date": "2026-12-21",
    "end_date": "2026-12-27",
    "total_planned_km": 46,
    "is_deload": false,
    "focus": "Post-peak consolidation run (24 km Long Run)",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-12-21",
        "type": "Recovery Run",
        "distance_km": 6,
        "target_pace": "8:00 min/km",
        "rpe": 2,
        "description": "Gentle shakeout after peak 32k.",
        "strength_prehab": "Calf & hamstring flush",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-12-22",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 4,
        "description": "Lighter maintenance strength (2 sets/exercise).",
        "strength_prehab": "Bodyweight heel drops, glute bridges",
        "fueling": "Protein"
      },
      {
        "day": "Wednesday",
        "date": "2026-12-23",
        "type": "Speed (Tempo)",
        "distance_km": 8,
        "target_pace": "6:30 min/km tempo",
        "rpe": 7,
        "description": "2 km warmup, 3 km @ 6:30 min/km tempo, 2 km cooldown.",
        "strength_prehab": "Dynamic stretches",
        "fueling": "Carb snack"
      },
      {
        "day": "Thursday",
        "date": "2026-12-24",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 4,
        "description": "Core & bodyweight back stabilization.",
        "strength_prehab": "Bird-dogs, deadbugs (2 sets)",
        "fueling": "Balanced nutrition"
      },
      {
        "day": "Friday",
        "date": "2026-12-25",
        "type": "Mid-Week Aerobic",
        "distance_km": 8,
        "target_pace": "7:20 - 7:35 min/km",
        "rpe": 3,
        "description": "Aerobic cruise.",
        "strength_prehab": "Hip mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2026-12-26",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Foam rolling",
        "fueling": "Carb dinner + hydration"
      },
      {
        "day": "Sunday",
        "date": "2026-12-27",
        "type": "Long Run",
        "distance_km": 24,
        "target_pace": "7:35 - 7:45 min/km",
        "rpe": 4,
        "description": "24 km Long Run. Comfortable rhythm.",
        "strength_prehab": "Post-run calf recovery",
        "fueling": "4 Gels + 3 Salt capsules + 1.5L water"
      }
    ]
  },
  {
    "week_number": 20,
    "phase": "Taper & Race Execution",
    "start_date": "2026-12-28",
    "end_date": "2027-01-03",
    "total_planned_km": 35,
    "is_deload": true,
    "focus": "TAPER WEEK 1: 35% Volume Reduction; Glycogen supercompensation begins",
    "workouts": [
      {
        "day": "Monday",
        "date": "2026-12-28",
        "type": "Recovery Run",
        "distance_km": 5,
        "target_pace": "7:55 min/km",
        "rpe": 2,
        "description": "Easy recovery run.",
        "strength_prehab": "Gentle calf stretches",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2026-12-29",
        "type": "Strength Day 1",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 3,
        "description": "Bodyweight only (Calf raises 2x15, glute bridges, bird-dogs). No heavy lifting.",
        "strength_prehab": "Mobility & activation",
        "fueling": "Balanced meals"
      },
      {
        "day": "Wednesday",
        "date": "2026-12-30",
        "type": "Speed (MP Sharpening)",
        "distance_km": 5,
        "target_pace": "7:00 min/km MP block",
        "rpe": 5,
        "description": "1.5 km warmup, 2 km @ Marathon Pace (7:00 min/km), 1.5 km cooldown.",
        "strength_prehab": "Dynamic stretches",
        "fueling": "Carb snack"
      },
      {
        "day": "Thursday",
        "date": "2026-12-31",
        "type": "Strength Day 2",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 3,
        "description": "Light core & stretching (15 mins).",
        "strength_prehab": "Bird-dogs, deadbugs (2 sets)",
        "fueling": "Balanced diet"
      },
      {
        "day": "Friday",
        "date": "2027-01-01",
        "type": "Mid-Week Aerobic",
        "distance_km": 7,
        "target_pace": "7:15 - 7:30 min/km",
        "rpe": 3,
        "description": "Light, springy aerobic run.",
        "strength_prehab": "Dynamic mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2027-01-02",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Rest & sleep",
        "fueling": "Hydration"
      },
      {
        "day": "Sunday",
        "date": "2027-01-03",
        "type": "Long Run",
        "distance_km": 18,
        "target_pace": "7:30 - 7:40 min/km",
        "rpe": 3,
        "description": "Taper 1 Long Run: 18 km. Legs should feel fresh and bouncy.",
        "strength_prehab": "Post-run calf flush",
        "fueling": "3 Gels + 2 Salt capsules + water"
      }
    ]
  },
  {
    "week_number": 21,
    "phase": "Taper & Race Execution",
    "start_date": "2027-01-04",
    "end_date": "2027-01-10",
    "total_planned_km": 26,
    "is_deload": true,
    "focus": "TAPER WEEK 2: 55% Volume Reduction; Final race gear rehearsal",
    "workouts": [
      {
        "day": "Monday",
        "date": "2027-01-04",
        "type": "Recovery Run",
        "distance_km": 4,
        "target_pace": "8:00 min/km",
        "rpe": 2,
        "description": "Short shakeout.",
        "strength_prehab": "Gentle stretching",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2027-01-05",
        "type": "Mobility",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 2,
        "description": "Light mobility, foam rolling, dynamic hip openers.",
        "strength_prehab": "Mobility only",
        "fueling": "Balanced meals"
      },
      {
        "day": "Wednesday",
        "date": "2027-01-06",
        "type": "Speed (MP Sharpener)",
        "distance_km": 5,
        "target_pace": "7:05 min/km MP block",
        "rpe": 4,
        "description": "2 km easy, 1.5 km @ Marathon Pace (7:05 min/km), 1.5 km cooldown.",
        "strength_prehab": "Dynamic prep",
        "fueling": "Carb snack"
      },
      {
        "day": "Thursday",
        "date": "2027-01-07",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Complete Rest & hydration tracking.",
        "strength_prehab": "Rest",
        "fueling": "Hydration tracking"
      },
      {
        "day": "Friday",
        "date": "2027-01-08",
        "type": "Mid-Week Aerobic",
        "distance_km": 5,
        "target_pace": "7:20 min/km + 3 strides",
        "rpe": 3,
        "description": "5 km easy with 3x100m strides.",
        "strength_prehab": "Dynamic mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2027-01-09",
        "type": "Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest.",
        "strength_prehab": "Rest",
        "fueling": "Hydration"
      },
      {
        "day": "Sunday",
        "date": "2027-01-10",
        "type": "Long Run",
        "distance_km": 12,
        "target_pace": "7:30 - 7:40 min/km",
        "rpe": 3,
        "description": "Final dress rehearsal: 12 km @ 7:30-7:40 min/km with Adidas Evo SL 2 and race vest.",
        "strength_prehab": "Calf stretching",
        "fueling": "2 Gels + 1 Salt capsule + water"
      }
    ]
  },
  {
    "week_number": 22,
    "phase": "Taper & Race Execution",
    "start_date": "2027-01-11",
    "end_date": "2027-01-17",
    "total_planned_km": 54.2,
    "is_deload": false,
    "focus": "RACE WEEK: TATA MUMBAI MARATHON 2027 (Sub-5:00:00 Target: 4:58:30)",
    "workouts": [
      {
        "day": "Monday",
        "date": "2027-01-11",
        "type": "Recovery Shakeout",
        "distance_km": 4,
        "target_pace": "8:00 min/km",
        "rpe": 2,
        "description": "4 km shakeout run + gentle calf stretches.",
        "strength_prehab": "Light stretching",
        "fueling": "Water"
      },
      {
        "day": "Tuesday",
        "date": "2027-01-12",
        "type": "Rest & Packing",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Rest & Travel Packing (Vest, Gels, Salt Tabs, Shoes).",
        "strength_prehab": "Rest",
        "fueling": "Balanced meals"
      },
      {
        "day": "Wednesday",
        "date": "2027-01-13",
        "type": "Mumbai Shakeout",
        "distance_km": 3,
        "target_pace": "7:45 min/km + 2 strides",
        "rpe": 3,
        "description": "3 km morning shakeout run in Mumbai to acclimatize to coastal humidity.",
        "strength_prehab": "Light dynamic stretches",
        "fueling": "Water"
      },
      {
        "day": "Thursday",
        "date": "2027-01-14",
        "type": "Travel / Expo",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Travel to Mumbai. Bib collection at MMRDA Expo. Rest off feet.",
        "strength_prehab": "Rest",
        "fueling": "Hydrate with electrolyte bottle"
      },
      {
        "day": "Friday",
        "date": "2027-01-15",
        "type": "Easy Jog",
        "distance_km": 4,
        "target_pace": "7:30 min/km + 3 strides",
        "rpe": 3,
        "description": "4 km easy jog + 3x60m light strides.",
        "strength_prehab": "Mobility",
        "fueling": "Water"
      },
      {
        "day": "Saturday",
        "date": "2027-01-16",
        "type": "Pre-Race Rest",
        "distance_km": 0,
        "target_pace": "N/A",
        "rpe": 1,
        "description": "Full Rest Day. Stay off feet. High carb meals (rice/potatoes). Sleep by 9 PM.",
        "strength_prehab": "Rest",
        "fueling": "High-carb loading (350-400g carbs) + 2L electrolyte fluids"
      },
      {
        "day": "Sunday",
        "date": "2027-01-17",
        "type": "RACE DAY",
        "distance_km": 42.195,
        "target_pace": "7:05 min/km avg (Sub-5:00 Target: 4:58:30)",
        "rpe": 9,
        "description": "TATA MUMBAI MARATHON 2027: Gun off ~5:00 AM. km 0-10 @ 7:10-7:15, Pedder Rd #1 @ 7:25, Sea Link @ 7:02-7:06, Pedder Rd #2 @ 7:35, Finish sprint @ 6:55-7:00!",
        "strength_prehab": "FINISH LINE MEDAL CELEBRATION! 🏅",
        "fueling": "6 Gels + 5 Salt capsules + water sips every 15 mins"
      }
    ]
  }
];

// Supabase State & Seamless Cross-Device Auto-Sync
const DEFAULT_SUPABASE_URL = 'https://xtdfhxczdlgyhkqsltyq.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZGZoeGN6ZGxneWhrcXNsdHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzg2OTUsImV4cCI6MjEwMjcxNDY5NX0.ARI4z_eWMhBQiF66xTXKDOrspfsBQjnG81qxaBhEuww';

let supabaseUrl = localStorage.getItem('tmm_supabase_url') || DEFAULT_SUPABASE_URL;
let supabaseAnonKey = localStorage.getItem('tmm_supabase_key') || DEFAULT_SUPABASE_ANON_KEY;
let supabaseClient = null;

try {
  const urlParams = new URLSearchParams(window.location.search);
  let hashKey = '';
  let hashSbUrl = '';
  let hashSbKey = '';
  if (window.location.hash) {
    const hashStr = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
    const hashParams = new URLSearchParams(hashStr);
    hashKey = hashParams.get('gk') || hashParams.get('gemini_key') || hashParams.get('key') || '';
    hashSbUrl = hashParams.get('sb_url') || hashParams.get('supabase_url') || '';
    hashSbKey = hashParams.get('sb_key') || hashParams.get('supabase_key') || '';
  }

  const qUrl = urlParams.get('supabase_url') || urlParams.get('sb_url') || hashSbUrl;
  const qKey = urlParams.get('supabase_key') || urlParams.get('sb_key') || hashSbKey;
  if (qUrl && qKey) {
    supabaseUrl = qUrl.startsWith('http') ? qUrl : `https://${qUrl}.supabase.co`;
    supabaseAnonKey = qKey;
    localStorage.setItem('tmm_supabase_url', supabaseUrl);
    localStorage.setItem('tmm_supabase_key', supabaseAnonKey);
    console.log('☁️ Supabase credentials synced from URL parameter');
  }

  const qGeminiKey = urlParams.get('gemini_key') || urlParams.get('gk') || urlParams.get('key') || hashKey;
  if (qGeminiKey) {
    const cleanKey = decodeURIComponent(qGeminiKey).trim();
    if (cleanKey) {
      geminiApiKey = cleanKey;
      localStorage.setItem('tmm_gemini_api_key', cleanKey);
      console.log('🔑 Gemini API Key successfully synced from mobile link');
    }
  }

  const qGhToken = urlParams.get('github_token') || urlParams.get('gh') || urlParams.get('pat');
  if (qGhToken) {
    const cleanGh = decodeURIComponent(qGhToken).trim();
    if (cleanGh) {
      githubToken = cleanGh;
      localStorage.setItem('tmm_github_pat', cleanGh);
      console.log('⚡ GitHub PAT successfully synced from transfer link');
    }
  }

  const syncPayload = urlParams.get('sync_payload') || urlParams.get('sync');
  if (syncPayload) {
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(syncPayload)));
      if (decoded.githubToken) {
        githubToken = decoded.githubToken;
        localStorage.setItem('tmm_github_pat', decoded.githubToken);
      }
      if (decoded.geminiKey) {
        geminiApiKey = decoded.geminiKey;
        localStorage.setItem('tmm_gemini_api_key', decoded.geminiKey);
      }
      if (decoded.vegaIcon) {
        localStorage.setItem('tmm_vega_icon_concept', decoded.vegaIcon);
      }
      if (decoded.gcalTime) {
        localStorage.setItem('tmm_gcal_run_time', decoded.gcalTime);
      }
      console.log('📱 All device tokens and preferences synced successfully!');
    } catch (err) {}
  }

  // Clean URL query and hash params without refreshing to keep address bar clean & secure
  if ((qUrl || qKey || qGeminiKey || qGhToken || syncPayload) && window.history && window.history.replaceState) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
} catch (e) {
  console.warn('URL sync param handling error:', e);
}

// Initialize App on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  try {
    updateVegaIconEverywhere();
  } catch (e) {
    console.error('Error updating Vega icon on DOMContentLoaded:', e);
  }

  setupCountdown();
  setupNavigation();
  setupFilters();
  setupSearch();
  setupPaceCalculator();
  renderPhases();
  renderWeekJumper();
  renderWeeklyPlan();
  renderProcamRaceDetails();
  updateProgressMetrics();
  initSupabase(supabaseUrl, supabaseAnonKey);
  initBookmarklet();
  updateCoachStatusDot();
  pruneCoachChatHistory();
  checkAndResumePendingCoachQuery();

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.log('SW registration notice:', err);
      });
    });
  }
});

// Also trigger immediate icon sync if DOM is already parsed
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  try {
    updateVegaIconEverywhere();
  } catch (e) {}
}

// Countdown to Jan 17, 2027
function setupCountdown() {
  const targetDate = new Date('2027-01-17T05:00:00+05:30').getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      const d = document.getElementById('cd-days');
      const h = document.getElementById('cd-hours');
      const m = document.getElementById('cd-mins');
      if (d) d.textContent = '00';
      if (h) h.textContent = '00';
      if (m) m.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const d = document.getElementById('cd-days');
    const h = document.getElementById('cd-hours');
    const m = document.getElementById('cd-mins');
    if (d) d.textContent = String(days).padStart(2, '0');
    if (h) h.textContent = String(hours).padStart(2, '0');
    if (m) m.textContent = String(mins).padStart(2, '0');
  }

  update();
  setInterval(update, 60000);
}

// Navigation Tabs
function setupNavigation() {
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-content-panel').forEach(panel => {
        panel.classList.remove('active');
      });

      const activePanel = document.getElementById(`tab-${targetTab}`);
      if (activePanel) activePanel.classList.add('active');
    });
  });
}

// Filter Controls
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderWeeklyPlan();
    });
  });
}

// Search Input
function setupSearch() {
  const searchInput = document.getElementById('search-workouts');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderWeeklyPlan();
    });
  }
}

// Render Phase Timeline
function renderPhases() {
  const container = document.getElementById('phase-timeline-container');
  if (!container) return;

  container.innerHTML = APP_DATA.phases.map(p => `
    <div class="phase-card ${currentPhaseFilter === p.id ? 'active' : ''}" onclick="togglePhaseFilter(${p.id})">
      <div class="phase-header">
        <span class="phase-tag">Phase ${p.id}</span>
        <span class="phase-weeks">${p.weeks}</span>
      </div>
      <div class="phase-name">${p.name.split(': ')[1] || p.name}</div>
      <div class="phase-desc">${p.description}</div>
    </div>
  `).join('');
}

function togglePhaseFilter(phaseId) {
  if (currentPhaseFilter === phaseId) {
    currentPhaseFilter = null;
  } else {
    currentPhaseFilter = phaseId;
  }
  renderPhases();
  renderWeeklyPlan();
}

// Render Week Jumper Bar
function renderWeekJumper() {
  const container = document.getElementById('week-jumper-bar');
  if (!container) return;

  container.innerHTML = rawWeeksData.map(w => {
    const isDeload = w.is_deload;
    let extraClass = '';
    let label = `W${w.week_number}`;
    
    if (w.week_number === 9) { extraClass = 'milestone-btn'; label = 'W9 (VDHM 21K 🇮🇳)'; }
    else if (w.week_number === 17) { extraClass = 'peak-btn'; label = 'W17 (30K Peak)'; }
    else if (w.week_number === 18) { extraClass = 'peak-btn'; label = 'W18 (KOL 25K 🏃)'; }
    else if (w.week_number === 22) { extraClass = 'peak-btn'; label = 'W22 (TMM 42K 🏆)'; }
    else if (w.week_number === 8) { extraClass = 'milestone-btn'; label = 'W8 (10K TT)'; }
    else if (w.week_number === 14) { extraClass = 'milestone-btn'; label = 'W14 (HM Sim)'; }
    else if (isDeload) { extraClass = 'milestone-btn'; label = `W${w.week_number} 🔋`; }

    return `<button class="week-jump-btn ${extraClass}" onclick="scrollToWeek(${w.week_number})">${label}</button>`;
  }).join('');
}

function scrollToWeek(weekNum) {
  const card = document.getElementById(`week-card-${weekNum}`);
  if (card) {
    if (card.classList.contains('collapsed')) card.classList.remove('collapsed');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.borderColor = 'var(--primary)';
    card.style.boxShadow = '0 0 24px var(--primary-glow)';
    setTimeout(() => {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    }, 2000);
  }
}

// View Mode Switching
function setViewMode(mode) {
  currentViewMode = mode;
  const btnGrid = document.getElementById('btn-view-grid');
  const btnTable = document.getElementById('btn-view-table');
  if (btnGrid) btnGrid.classList.toggle('active', mode === 'grid');
  if (btnTable) btnTable.classList.toggle('active', mode === 'table');
  renderWeeklyPlan();
}

function toggleAllWeeks() {
  allCollapsed = !allCollapsed;
  document.querySelectorAll('.week-card').forEach(card => {
    card.classList.toggle('collapsed', allCollapsed);
  });
  const label = document.getElementById('expand-toggle-label');
  if (label) label.textContent = allCollapsed ? '📁 Expand All' : '📂 Collapse All';
}

// Render Weekly Plan
function renderWeeklyPlan() {
  const container = document.getElementById('weeks-container');
  if (!container) return;

  let filteredWeeks = rawWeeksData;

  if (currentPhaseFilter !== null) {
    const startW = currentPhaseFilter === 1 ? 1 : currentPhaseFilter === 2 ? 5 : currentPhaseFilter === 3 ? 13 : 20;
    const endW = currentPhaseFilter === 1 ? 4 : currentPhaseFilter === 2 ? 12 : currentPhaseFilter === 3 ? 19 : 22;
    filteredWeeks = filteredWeeks.filter(w => w.week_number >= startW && w.week_number <= endW);
  }

  if (currentFilter === 'deload') {
    filteredWeeks = filteredWeeks.filter(w => w.is_deload);
  } else if (currentFilter === 'procam') {
    filteredWeeks = filteredWeeks.filter(w => [9, 18, 22].includes(w.week_number));
  } else if (currentFilter === 'milestone') {
    filteredWeeks = filteredWeeks.filter(w => [8, 9, 14, 17, 18, 22].includes(w.week_number));
  }

  if (searchQuery) {
    filteredWeeks = filteredWeeks.filter(w => {
      const matchFocus = w.focus && w.focus.toLowerCase().includes(searchQuery);
      const matchWorkouts = w.workouts.some(wo => 
        (wo.description && wo.description.toLowerCase().includes(searchQuery)) ||
        (wo.type && wo.type.toLowerCase().includes(searchQuery)) ||
        (wo.target_pace && wo.target_pace.toLowerCase().includes(searchQuery))
      );
      return matchFocus || matchWorkouts;
    });
  }

  if (filteredWeeks.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
        <p style="color: var(--text-muted); font-size: 1.1rem;">No workouts match your current filter or search criteria.</p>
        <button class="filter-btn active" style="margin-top: 1rem;" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredWeeks.map(week => renderWeekCard(week)).join('');
}

function resetFilters() {
  currentFilter = 'all';
  currentPhaseFilter = null;
  searchQuery = '';
  const searchInput = document.getElementById('search-workouts');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
  });
  renderPhases();
  renderWeeklyPlan();
}

// Render Single Week Card
function renderWeekCard(week) {
  const isDeload = week.is_deload;
  const isVdhm = week.week_number === 9;
  const isKolkata = week.week_number === 18;
  const isTmm = week.week_number === 22;
  const is30kPeak = week.week_number === 17;
  const isMilestone = [8, 14].includes(week.week_number);

  let badgeHtml = '';
  if (isTmm) {
    badgeHtml += `<span class="badge badge-peak">🏆 PROCAM SLAM #3: TMM FULL MARATHON</span>`;
  } else if (isKolkata) {
    badgeHtml += `<span class="badge badge-peak">🏃 PROCAM SLAM #2: TSW KOLKATA 25K</span>`;
  } else if (isVdhm) {
    badgeHtml += `<span class="badge badge-milestone">🇮🇳 PROCAM SLAM #1: VDHM (21.1 KM)</span>`;
  } else if (is30kPeak) {
    badgeHtml += `<span class="badge badge-peak">🔥 30 KM PEAK DISTANCE</span>`;
  } else if (isMilestone) {
    badgeHtml += `<span class="badge badge-milestone">${week.week_number === 8 ? '⏱️ 10K TIME TRIAL' : '🏅 HM SIMULATION'}</span>`;
  } else if (isDeload) {
    badgeHtml += `<span class="badge badge-deload">🔋 DELOAD RECOVERY</span>`;
  }

  const contentHtml = currentViewMode === 'table' ? renderWeekTableView(week) : renderWeekGridView(week);

  return `
    <div class="week-card ${allCollapsed ? 'collapsed' : ''}" id="week-card-${week.week_number}">
      <div class="week-header" onclick="toggleWeekCollapse(${week.week_number})">
        <div class="week-title-area">
          <div class="week-num-badge">W${week.week_number}</div>
          <div class="week-info">
            <h3>Week ${week.week_number} <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">• ${week.phase}</span></h3>
            <span class="week-dates">${week.start_date} to ${week.end_date}</span>
          </div>
        </div>
        <div class="week-badges">
          <span class="badge badge-distance">${week.total_planned_km} KM TOTAL</span>
          ${badgeHtml}
          <span class="collapse-icon">▼</span>
        </div>
      </div>
      <div class="week-body">
        <div class="week-focus-text"><strong>Focus:</strong> ${week.focus}</div>
        ${contentHtml}
      </div>
    </div>
  `;
}

// Render Grid View (7-Column Calendar Row)
function renderWeekGridView(week) {
  return `
    <div class="days-grid">
      ${week.workouts.map(wo => renderDayCard(week.week_number, wo)).join('')}
    </div>
  `;
}

// Render Agenda Table View
// Render Agenda Table View
function renderWeekTableView(week) {
  return `
    <div class="week-table-container">
      <table class="week-agenda-table">
        <thead>
          <tr>
            <th style="width: 40px;">Done</th>
            <th style="width: 120px;">Day & Date</th>
            <th style="width: 160px;">Workout Type</th>
            <th style="width: 100px;">Distance</th>
            <th style="width: 150px;">Target Pace</th>
            <th style="width: 100px;">Effort</th>
            <th>Workout Details & Strategy</th>
          </tr>
        </thead>
        <tbody>
          ${week.workouts.map(wo => {
            const workoutKey = `${week.week_number}_${wo.day}_${wo.date}`;
            const logData = completedWorkouts[workoutKey];
            const isDone = !!logData;
            const tagClass = getTagClass(wo.type);
            const actualsHtml = isDone ? renderActualsBox(logData, wo.distance_km, wo.target_pace, wo.date, workoutKey) : '';
            return `
              <tr class="${isDone ? 'completed-row' : ''}">
                <td>
                  <input type="checkbox" class="checkbox-custom" ${isDone ? 'checked' : ''} onchange="toggleWorkoutDone('${workoutKey}', ${wo.distance_km}, this.checked, '${wo.date}', '${wo.target_pace}')">
                </td>
                <td>
                  <strong style="color: var(--text-main); font-size: 0.85rem;">${wo.day}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-dim);">${wo.date}</div>
                </td>
                <td>
                  <span class="workout-tag ${tagClass}" style="margin: 0;">${wo.type}</span>
                </td>
                <td>
                  <strong style="font-size: 1.1rem; color: var(--text-main); font-family: 'Outfit';">${wo.distance_km > 0 ? `${wo.distance_km} km` : '—'}</strong>
                </td>
                <td>
                  <span class="mono" style="font-size: 0.8rem; color: var(--text-muted);">${wo.target_pace}</span>
                </td>
                <td>
                  <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-orange);">RPE ${wo.rpe}/10</span>
                </td>
                <td>
                  <div style="font-size: 0.85rem; line-height: 1.4; color: var(--text-muted);">${wo.description}</div>
                  ${actualsHtml}
                  <div style="margin-top: 0.35rem; display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                    <button class="workout-card-strategy-btn" onclick="showDailyWorkoutStrategyModal('${wo.date}', ${week.week_number}, '${wo.day}')">🎯 Strategy</button>
                    ${wo.strength_prehab && wo.strength_prehab !== 'N/A' ? `<button class="action-pill-btn" onclick="showStrengthModal('${escapeHtml(wo.strength_prehab)}')">💪 Prehab</button>` : ''}
                    ${wo.fueling && wo.fueling !== 'N/A' ? `<button class="action-pill-btn" onclick="showFuelingModal('${escapeHtml(wo.fueling)}')">⚡ Fueling</button>` : ''}
                    ${!isDone && wo.distance_km > 0 ? `<button class="action-pill-btn" style="border-color: rgba(16, 185, 129, 0.4); color: var(--primary);" onclick="openManualLogForDate('${wo.date}', ${wo.distance_km})">✏️ Log Run</button>` : ''}
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function getTagClass(type) {
  const typeLower = (type || '').toLowerCase();
  if (typeLower.includes('recovery') || typeLower.includes('shakeout')) return 'tag-recovery';
  if (typeLower.includes('speed') || typeLower.includes('tempo') || typeLower.includes('interval') || typeLower.includes('hill')) return 'tag-speed';
  if (typeLower.includes('long')) return 'tag-long';
  if (typeLower.includes('strength') || typeLower.includes('mobility')) return 'tag-strength';
  if (typeLower.includes('rest')) return 'tag-rest';
  if (typeLower.includes('race') || typeLower.includes('trial') || typeLower.includes('simulation') || typeLower.includes('vdhm') || typeLower.includes('kolkata')) return 'tag-race';
  return 'tag-aerobic';
}

// Render Sleek Interactive Variance Pill Button on Cards
function renderActualsBox(logData, plannedDist, targetPace, dateStr, workoutKey) {
  if (!logData || (!logData.actualPace && !logData.dist)) return '';

  const dist = logData.dist || 0;
  let pace = logData.actualPace || 'N/A';
  pace = pace.replace(' min/km', '/km').replace(' - ', '-');

  // Dynamic variance calculation
  let score = logData.scorePct;
  let distDelta = logData.distDelta;
  let paceDeltaSec = logData.paceDeltaSec;

  if (score === undefined || (score === 100 && paceDeltaSec === 0 && logData.actualPace !== logData.targetPace && targetPace !== 'N/A')) {
    const v = calculateVariance(plannedDist, dist, targetPace, logData.actualPace);
    score = v.scorePct;
    distDelta = v.distDelta;
    paceDeltaSec = v.paceDeltaSec;
  }

  if (score === undefined) score = 100;
  if (distDelta === undefined) distDelta = dist - plannedDist;
  if (paceDeltaSec === undefined) paceDeltaSec = 0;

  let pillClass = 'on-target';
  let pillText = `🎯 ${score}% Match`;
  let subText = `On Target`;

  if (plannedDist === 0 && dist > 0) {
    pillClass = 'on-target';
    pillText = `🏃 Extra Run`;
    subText = `${dist} km @ ${pace}`;
  } else if (paceDeltaSec < -15) {
    pillClass = 'too-fast';
    pillText = `⚡ ${score}% Match`;
    subText = `${Math.abs(paceDeltaSec)}s Fast`;
  } else if (paceDeltaSec > 25) {
    pillClass = 'too-slow';
    pillText = `🐢 ${score}% Match`;
    subText = `${paceDeltaSec}s Slow`;
  } else if (distDelta < -1) {
    pillClass = 'under-volume';
    pillText = `⚠️ ${score}% Match`;
    subText = `${Math.abs(distDelta).toFixed(1)}k Under`;
  }

  return `
    <button class="variance-pill-btn ${pillClass}" onclick="event.stopPropagation(); showVarianceDetailModal('${workoutKey}', '${dateStr}')" title="Click to view detailed execution report">
      <span style="display: flex; align-items: center; gap: 0.35rem;">
        <span>${pillText}</span>
        <span style="opacity: 0.8; font-weight: 500; font-size: 0.68rem;">(${subText})</span>
      </span>
      <span style="font-size: 0.65rem; opacity: 0.75; font-weight: 800;">Breakdown ▾</span>
    </button>
  `;
}

// Show Detailed Execution & Variance Modal Breakdown
function showVarianceDetailModal(workoutKey, dateStr) {
  const logData = completedWorkouts[workoutKey];
  const match = findWorkoutInfoByDate(dateStr);
  const modal = document.getElementById('variance-detail-modal');
  const container = document.getElementById('variance-modal-content');

  if (!modal || !container || !logData) return;

  const plannedDist = match ? match.workout.distance_km : (logData.plannedDist || 0);
  const targetPace = match ? match.workout.target_pace : (logData.targetPace || 'N/A');
  const actualDist = logData.dist || 0;
  const actualPace = logData.actualPace || 'N/A';
  const workoutType = match ? match.workout.type : 'Workout';
  const dayName = match ? `Week ${match.weekNumber} • ${match.workout.day}` : dateStr;

  const variance = calculateVariance(plannedDist, actualDist, targetPace, actualPace);
  const score = variance.scorePct;
  const distDelta = variance.distDelta;
  const paceDeltaSec = variance.paceDeltaSec;

  // Generate "What You Got Right" Wins
  const wins = [];
  if (actualDist >= plannedDist * 0.95 && plannedDist > 0) {
    wins.push(`🎯 <strong>Volume Completed:</strong> You ran <strong>${actualDist} km</strong> (${Math.round((actualDist/plannedDist)*100)}% of the planned ${plannedDist} km target).`);
  } else if (plannedDist === 0 && actualDist > 0) {
    wins.push(`🏃 <strong>Bonus Mileage:</strong> Logged an extra <strong>${actualDist} km</strong> aerobic volume.`);
  }

  if (Math.abs(paceDeltaSec) <= 15 && targetPace !== 'N/A') {
    wins.push(`🎯 <strong>Zone 2 Precision:</strong> Maintained your prescribed pace zone (<strong>${actualPace}</strong> vs target <strong>${targetPace}</strong>).`);
  }

  if (logData.source) {
    wins.push(`☁️ <strong>Automated Tracking:</strong> Successfully recorded and synced from <strong>${logData.source.includes('strava') ? 'Strava' : logData.source}</strong>.`);
  }

  // Generate "What Needs Attention / Adjustments"
  const warnings = [];
  if (paceDeltaSec < -15 && targetPace !== 'N/A') {
    warnings.push(`⚡ <strong>Pace Was ${Math.abs(paceDeltaSec)}s/km Too Fast:</strong> Ran at <strong>${actualPace}</strong> against prescribed easy ceiling of <strong>${targetPace}</strong>.`);
    warnings.push(`💡 <strong>Coach Strategy:</strong> In early Base Building (Weeks 1–4), running faster than Zone 2 increases calf/Achilles strain and burns glycogen instead of building mitochondrial fat adaptation. Slow down by ~45–60s on easy days to stay fresh!`);
  } else if (paceDeltaSec > 25 && targetPace !== 'N/A') {
    warnings.push(`🐢 <strong>Pace Was ${paceDeltaSec}s/km Slower than Target:</strong> Check your hydration, sleep, and fatigue levels.`);
  }

  if (distDelta < -1.0 && plannedDist > 0) {
    warnings.push(`⚠️ <strong>Volume Shortfall:</strong> Stopped ${Math.abs(distDelta).toFixed(1)} km short of the planned distance.`);
  }

  if (warnings.length === 0) {
    warnings.push(`✨ <strong>Flawless Execution:</strong> You followed all prescribed training constraints perfectly! Keep this consistency rolling.`);
  }

  const scoreColor = score >= 90 ? 'var(--primary)' : score >= 75 ? 'var(--accent-orange)' : 'var(--accent-red)';

  container.innerHTML = `
    <div style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
        <div>
          <span class="workout-tag tag-aerobic" style="margin-bottom: 0.4rem;">${workoutType}</span>
          <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin: 0;">${dayName} Execution Report</h2>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">Date: ${dateStr}</div>
        </div>
        <div style="text-align: right; background: rgba(0,0,0,0.3); padding: 0.5rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Overall Match</div>
          <div style="font-size: 1.6rem; font-weight: 900; color: ${scoreColor}; font-family: 'JetBrains Mono', monospace; line-height: 1;">
            ${score}%
          </div>
        </div>
      </div>
    </div>

    <!-- Section 1: Wins -->
    <div class="breakdown-section" style="border-left: 3px solid var(--primary);">
      <div class="breakdown-section-title" style="color: var(--primary);">
        <span>✅</span> What You Got Right
      </div>
      <ul class="breakdown-list">
        ${wins.map(w => `<li><span>•</span><div>${w}</div></li>`).join('')}
      </ul>
    </div>

    <!-- Section 2: Areas for Focus -->
    <div class="breakdown-section" style="border-left: 3px solid ${paceDeltaSec < -15 ? 'var(--accent-red)' : 'var(--accent-orange)'};">
      <div class="breakdown-section-title" style="color: ${paceDeltaSec < -15 ? 'var(--accent-red)' : 'var(--accent-orange)'};">
        <span>${paceDeltaSec < -15 ? '⚡' : '⚠️'}</span> What Needs Attention &amp; Coach Guidance
      </div>
      <ul class="breakdown-list">
        ${warnings.map(w => `<li><span>•</span><div>${w}</div></li>`).join('')}
      </ul>
    </div>

    <!-- Section 3: Side-by-Side Comparison Table -->
    <div class="breakdown-section">
      <div class="breakdown-section-title" style="color: var(--text-main);">
        <span>📊</span> Target vs Actual Breakdown
      </div>
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Planned Target</th>
            <th>Actual Strava Run</th>
            <th>Variance / Delta</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Distance</strong></td>
            <td>${plannedDist > 0 ? `${plannedDist} km` : 'Rest / Strength'}</td>
            <td><strong>${actualDist} km</strong></td>
            <td style="color: ${distDelta >= 0 ? 'var(--primary)' : 'var(--accent-red)'}; font-weight: 700;">${distDelta >= 0 ? '+' : ''}${distDelta.toFixed(2)} km</td>
          </tr>
          <tr>
            <td><strong>Pace</strong></td>
            <td>${targetPace}</td>
            <td style="font-family: monospace;"><strong>${actualPace}</strong></td>
            <td style="font-weight: 700; color: ${paceDeltaSec < -15 ? 'var(--accent-red)' : paceDeltaSec > 25 ? 'var(--accent-orange)' : 'var(--primary)'};">
              ${paceDeltaSec < 0 ? `⚡ ${Math.abs(paceDeltaSec)}s fast` : paceDeltaSec > 0 ? `🐢 ${paceDeltaSec}s slow` : '🎯 On Target'}
            </td>
          </tr>
          ${logData.notes ? `
            <tr>
              <td><strong>Notes</strong></td>
              <td colspan="3" style="color: var(--text-muted); font-style: italic;">"${escapeHtml(logData.notes)}"</td>
            </tr>
          ` : ''}
        </tbody>
      </table>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
      <button class="action-pill-btn" style="color: var(--primary); border-color: rgba(16, 185, 129, 0.4);" onclick="closeVarianceModal(); openManualLogForDate('${dateStr}', ${plannedDist});">
        ✏️ Edit Run Actuals
      </button>
      <button class="btn-icon" style="background: rgba(255,255,255,0.08);" onclick="closeVarianceModal()">
        ✕ Close
      </button>
    </div>
  `;

  modal.classList.add('open');
}

function closeVarianceModal() {
  const modal = document.getElementById('variance-detail-modal');
  if (modal) modal.classList.remove('open');
}

// ==============================================================================
// DAILY WORKOUT STRATEGY BLUEPRINT & GOOGLE CALENDAR LINK GENERATOR
// ==============================================================================
function getGCalPreferences() {
  const defaultTime = localStorage.getItem('tmm_gcal_time') || '06:00';
  const defaultReminder = parseInt(localStorage.getItem('tmm_gcal_reminder') || '30', 10);
  return { defaultTime, defaultReminder };
}

function saveGCalPreferences() {
  const timeInput = document.getElementById('gcal-run-time-input');
  const reminderSelect = document.getElementById('gcal-reminder-select');
  if (timeInput) localStorage.setItem('tmm_gcal_time', timeInput.value);
  if (reminderSelect) localStorage.setItem('tmm_gcal_reminder', reminderSelect.value);
}

function generateGoogleCalendarUrl(wo, customTime = null) {
  const { defaultTime } = getGCalPreferences();
  const startTimeStr = customTime || defaultTime; // e.g. "06:00"
  
  // Format Date & Times: YYYYMMDDTHHMMSS
  const [year, month, day] = (wo.date || new Date().toISOString().slice(0, 10)).split('-');
  const [startHour, startMin] = startTimeStr.split(':');
  
  const startDt = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(startHour, 10), parseInt(startMin, 10), 0);
  
  const dist = wo.distance_km || 0;
  const isRest = dist === 0;
  const targetPace = wo.target_pace || 'N/A';
  const type = wo.type || wo.workout_type || 'Workout';
  const rpe = wo.rpe || wo.rpe_target || (isRest ? 1 : 3);
  const fuelingStrategy = wo.fueling || wo.fueling_hydration_strategy || (dist > 10 ? 'Water sips every 2 km + 1 Gel at km 7' : 'Water sips as needed');

  let durationMins = 45;
  let estDurationStr = '25 – 35 mins';
  if (dist > 0) {
    const minMins = Math.round(dist * 7.1);
    const maxMins = Math.round(dist * 7.8);
    durationMins = Math.max(30, Math.round(dist * 7.5 + 15));
    estDurationStr = `${minMins} – ${maxMins} mins`;
  } else {
    durationMins = 40;
    estDurationStr = '30 – 45 mins';
  }

  const endDt = new Date(startDt.getTime() + durationMins * 60 * 1000);

  const formatGCalDate = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  };

  // Title: "7km Long Run (7:35 - 7:45 min/km)"
  const title = dist > 0 
    ? `${dist}km ${type}${targetPace && targetPace !== 'N/A' ? ` (${targetPace})` : ''}`
    : `${type}${targetPace && targetPace !== 'N/A' ? ` (${targetPace})` : ''}`;

  const splitsData = generateWorkoutSplits(wo);
  const splits = splitsData.map(s => `  • ${s.km} (${s.phase}): ${s.pace} — ${s.desc}`);

  const prehabDrill = wo.strength_prehab && wo.strength_prehab !== 'N/A' 
    ? wo.strength_prehab 
    : 'Post-run eccentric heel drops on a step (3x15) + foam roll calves';

  let details = '';
  if (dist > 0) {
    details = [
      `⏱️ ${estDurationStr}  •  RPE ${rpe}/10 (Aerobic Base)\n`,
      `💧 PRE-RUN FUELING`,
      `• 250ml water + pinch of pink salt (30m before)`,
      dist >= 10 ? `• 1 banana or toast with honey (45m before)\n` : `\n`,
      `🦵 WARMUP (3–5 Mins)`,
      `• 3m ankle mobility & soleus calf rockers (2x15)`,
      `• Start Km 1 as a gentle warmup float\n`,
      `🎯 RUN STRATEGY`,
      `• Focus: ${wo.description || 'Smooth aerobic running.'}`,
      `• Target Pace: ${targetPace}`,
      splits.length > 0 ? splits.join('\n') : '',
      `• In-Run: ${fuelingStrategy}\n`,
      `🧘 COOL-DOWN & PREHAB`,
      `• 5m walking float`,
      `• Step eccentric heel drops (3x15 straight + 3x15 bent knee)`,
      `• ${prehabDrill}\n`,
      `⚡ POST-RUN RECOVERY`,
      `• 500ml electrolyte water within 20m`,
      `• 20g protein + recovery meal within 45m`
    ].filter(Boolean).join('\n');
  } else {
    details = [
      `⏱️ ${estDurationStr}  •  RPE ${rpe}/10 (Recovery)\n`,
      `💧 DAILY HYDRATION`,
      `• 2.0–2.5L fluids throughout the day\n`,
      `🦵 MOBILITY (5 Mins)`,
      `• Gentle hip openers & ankle mobility\n`,
      `🎯 SESSION GOAL`,
      `• ${wo.description || 'Rest and tissue recovery.'}\n`,
      `🧘 PREHAB PROTOCOL`,
      `• ${prehabDrill}\n`,
      `⚡ RECOVERY`,
      `• Rest, elevate legs & 7–8 hrs sleep`
    ].filter(Boolean).join('\n');
  }

  const encodedTitle = encodeURIComponent(title);
  const encodedDetails = encodeURIComponent(details);
  const dates = `${formatGCalDate(startDt)}/${formatGCalDate(endDt)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${dates}&details=${encodedDetails}&sf=true&output=xml`;
}

function generateWorkoutSplits(wo) {
  if (!wo || typeof wo !== 'object') return [];
  
  // 1. Primary Source of Truth: Persisted Structured Strategy Splits (from Supabase or training_data.json)
  if (Array.isArray(wo.strategy_splits) && wo.strategy_splits.length > 0) {
    return wo.strategy_splits;
  }

  const dist = parseFloat(wo.distance_km || 0);
  const typeLower = (wo.type || '').toLowerCase();
  const desc = wo.description || '';
  const descLower = desc.toLowerCase();
  const targetPace = wo.target_pace || 'N/A';

  if (dist === 0) {
    return [
      { km: 'Prehab 1', phase: 'Ankle & Foot Mobility', pace: '10 Mins', desc: 'Ankle alphabets, plantar roll with lacrosse ball', color: '#10b981' },
      { km: 'Prehab 2', phase: 'Eccentric Calf Loading', pace: '15 Mins', desc: 'Heel drops on a step (3x15 straight leg + 3x15 bent knee)', color: '#ffcc00' },
      { km: 'Prehab 3', phase: 'Foam Rolling & Recovery', pace: '10 Mins', desc: 'Soleus, gastrocnemius, and quads myofascial release', color: '#38bdf8' }
    ];
  }

  const splits = [];

  // A. Hybrid: Hills + Tempo
  if (descLower.includes('hill') && descLower.includes('tempo')) {
    const warmupMatch = desc.match(/([\d\.]+)\s*km\s*warmup/i);
    const warmupKm = warmupMatch ? parseFloat(warmupMatch[1]) : 2.0;
    splits.push({
      km: `Km 0 – ${warmupKm.toFixed(1)}`,
      phase: 'Phase 1: Warm-up Float',
      pace: '7:45 – 8:00 min/km',
      desc: 'Easy aerobic warmup on flat ground, dynamic ankle mobility (RPE 3)',
      color: '#10b981'
    });

    const hillMatch = desc.match(/(\d+)\s*[x×X]\s*([0-9\-]+(?:sec|s|min|m)?\s*[a-zA-Z\s\-]*repeats?|[0-9\-]+(?:sec|s|min|m)?)/i);
    const repCount = hillMatch ? parseInt(hillMatch[1], 10) : 4;
    const durationStr = hillMatch ? (hillMatch[2].match(/\d+\s*(?:sec|s|min|m)/i)?.[0] || '75-sec') : '75-sec';

    let subSectionIdx = 1;
    for (let i = 1; i <= repCount; i++) {
      splits.push({
        km: `${subSectionIdx}. ${durationStr} Hill ${i}`,
        phase: `Hill Rep ${i}/${repCount}`,
        pace: 'Uphill Sprint (RPE 8)',
        desc: `Rep ${i} of ${repCount}: Powerful glute drive, high knees, upright torso (RPE 8)`,
        color: '#ff3b00'
      });
      subSectionIdx++;

      splits.push({
        km: `${subSectionIdx}. Jog-Down Rest ${i}`,
        phase: `Recovery ${i}/${repCount}`,
        pace: 'Walk / Easy Jog',
        desc: `Rest ${i} of ${repCount}: Controlled jog down to hill base, reset heart rate (RPE 2)`,
        color: '#38bdf8'
      });
      subSectionIdx++;
    }

    const tempoMatch = desc.match(/([\d\.]+)\s*km\s*@\s*tempo\s*(?:\(([^)]+)\))?/i);
    const tempoKm = tempoMatch ? parseFloat(tempoMatch[1]) : 2.0;
    const tempoPace = tempoMatch && tempoMatch[2] ? tempoMatch[2] : '6:30 min/km';
    const tempoStartKm = warmupKm;
    const tempoEndKm = warmupKm + tempoKm;

    splits.push({
      km: `Km ${tempoStartKm.toFixed(1)} – ${tempoEndKm.toFixed(1)}`,
      phase: 'Phase 2: Continuous Tempo Block',
      pace: tempoPace,
      desc: `${tempoKm.toFixed(1)} km sustained threshold lock post-hills. Lock into 172+ SPM rhythm (RPE 7)`,
      color: '#ff7700'
    });

    const cooldownMatch = desc.match(/([\d\.]+)\s*km\s*cooldown/i);
    const cooldownKm = cooldownMatch ? parseFloat(cooldownMatch[1]) : 1.5;
    splits.push({
      km: `Final ${cooldownKm.toFixed(1)} km`,
      phase: 'Phase 3: Cool-down Flush',
      pace: '7:50 – 8:15 min/km',
      desc: 'Easy recovery flush to clear lactate from calves and quads (RPE 2)',
      color: '#a855f7'
    });

    return splits;
  }

  // B. Continuous Tempo / Threshold / Marathon Pace
  const hasContinuousKeyword = descLower.includes('continuous') || 
                               (typeLower.includes('tempo') && !/[0-9]+\s*[x×X]\s*/.test(desc)) ||
                               (typeLower.includes('threshold') && !/[0-9]+\s*[x×X]\s*/.test(desc)) ||
                               (typeLower.includes('mp') && !/[0-9]+\s*[x×X]\s*/.test(desc));

  if (hasContinuousKeyword) {
    const warmupMatch = desc.match(/([\d\.]+)\s*km\s*(?:warmup|warm-up|easy)/i);
    const cooldownMatch = desc.match(/([\d\.]+)\s*km\s*(?:cooldown|cool-down|flush|easy)/i);
    const warmupKm = warmupMatch ? parseFloat(warmupMatch[1]) : (dist >= 6 ? 2.0 : 1.5);
    const cooldownKm = cooldownMatch ? parseFloat(cooldownMatch[1]) : (dist >= 6 ? 2.0 : 1.5);
    
    const tempoDistMatch = desc.match(/([\d\.]+)\s*km\s*(?:continuous|@\s*tempo|tempo|@\s*marathon\s*pace|@\s*mp)/i);
    const tempoKm = tempoDistMatch ? parseFloat(tempoDistMatch[1]) : Math.max(1.0, dist - warmupKm - cooldownKm);
    const tempoEndKm = warmupKm + tempoKm;

    const tempoPaceMatch = desc.match(/\(([0-9]:[0-9]{2}(?:\s*-\s*[0-9]:[0-9]{2})?\s*min\/km)\)/i) ||
                           targetPace.match(/([0-9]:[0-9]{2}(?:\s*-\s*[0-9]:[0-9]{2})?)/);
    const tempoPaceStr = tempoPaceMatch ? (tempoPaceMatch[1].includes('min/km') ? tempoPaceMatch[1] : `${tempoPaceMatch[1]} min/km`) : targetPace;

    splits.push({
      km: `Km 0 – ${warmupKm.toFixed(1)}`,
      phase: 'Phase 1: Warm-up Float',
      pace: '7:45 – 8:00 min/km',
      desc: 'Easy aerobic warmup, activate glutes, loosen ankles & soleus (RPE 3)',
      color: '#10b981'
    });

    splits.push({
      km: `Km ${warmupKm.toFixed(1)} – ${tempoEndKm.toFixed(1)}`,
      phase: typeLower.includes('mp') || descLower.includes('marathon pace') ? 'Phase 2: Marathon Pace Block' : 'Phase 2: Continuous Tempo Block',
      pace: tempoPaceStr,
      desc: `${tempoKm.toFixed(1)} km continuous locked-in effort, 172+ SPM, 2:2 rhythmic breathing (RPE 6-7)`,
      color: '#ff7700'
    });

    splits.push({
      km: `Km ${tempoEndKm.toFixed(1)} – ${dist.toFixed(1)}`,
      phase: 'Phase 3: Cool-down Flush',
      pace: '7:50 – 8:15 min/km',
      desc: `${cooldownKm.toFixed(1)} km easy flush jog and walking transition to clear lactate (RPE 2)`,
      color: '#38bdf8'
    });

    return splits;
  }

  // C. Repetition & Speed Workouts
  const repMatchPattern = desc.match(/(\d+)\s*[x×X]\s*([0-9a-zA-Z\-\s]+?)(?:with|,|\.|\+|$)/i);
  if (repMatchPattern || /[0-9]+\s*[x×X]\s*/.test(desc) || descLower.includes('pickups') || descLower.includes('strides')) {
    const warmupMatch = desc.match(/([\d\.]+)\s*km\s*(?:warmup|easy|warm-up|shakeout)/i);
    const cooldownMatch = desc.match(/([\d\.]+)\s*km\s*(?:cooldown|flush|cool-down|easy|shakeout)/i);
    const warmupKm = warmupMatch ? parseFloat(warmupMatch[1]) : (dist >= 6 ? 2.0 : 1.5);
    const cooldownKm = cooldownMatch ? parseFloat(cooldownMatch[1]) : Math.max(1.0, dist - warmupKm - 0.5);

    splits.push({
      km: `Km 0 – ${warmupKm.toFixed(1)}`,
      phase: 'Phase 1: Warm-up Float',
      pace: '7:45 – 8:00 min/km',
      desc: 'Easy aerobic jog, loose shoulders, warm up Achilles & soleus (RPE 3)',
      color: '#10b981'
    });

    let repCount = 4;
    let repLabel = 'Interval';
    let repPace = targetPace !== 'N/A' ? targetPace : '5:50 min/km';
    let isHill = typeLower.includes('hill') || descLower.includes('uphill') || descLower.includes('hill repeat');

    const strideMatch = desc.match(/(\d+)\s*[x×X]\s*(\d+m|\d+sec|\d+s|\d+min|\d+km|[0-9\-]+s|[0-9\.]+\s*km)\s*([a-zA-Z\s\-@\(\):0-9\/]+?)(?:with|,|\.|\+|$)/i);
    if (strideMatch) {
      repCount = parseInt(strideMatch[1], 10) || 4;
      const unit = strideMatch[2].trim();
      const name = strideMatch[3].trim();
      if (name.includes('stride') || typeLower.includes('stride')) {
        repLabel = `${unit} Stride`;
      } else if (name.includes('hill') || isHill) {
        repLabel = `${unit} Hill Repeat`;
      } else if (name.includes('tempo') || typeLower.includes('tempo')) {
        repLabel = `${unit} Tempo Rep`;
      } else if (name.includes('pickup') || descLower.includes('pickup')) {
        repLabel = `${unit} Pickup`;
      } else {
        repLabel = `${unit} Rep`;
      }
    } else {
      const matchX = desc.match(/(\d+)\s*[x×X]\s*/i);
      if (matchX) {
        repCount = parseInt(matchX[1], 10) || 4;
      }
    }

    if (isHill) {
      repPace = 'Uphill Sprint (RPE 8)';
    } else if (descLower.includes('stride') || typeLower.includes('stride')) {
      const stridePaceMatch = targetPace.match(/~?([0-9]:[0-9]{2})\s*strides?/i);
      repPace = stridePaceMatch ? `${stridePaceMatch[1]} min/km` : '5:20 – 5:45 min/km';
    } else {
      const paceMatch = desc.match(/\(([0-9]:[0-9]{2}(?:\s*-\s*[0-9]:[0-9]{2})?\s*min\/km)\)/i) ||
                        targetPace.match(/~?([0-9]:[0-9]{2}(?:\s*-\s*[0-9]:[0-9]{2})?)/);
      if (paceMatch) repPace = paceMatch[1].includes('min/km') ? paceMatch[1] : `${paceMatch[1]} min/km`;
    }

    const restMatch = desc.match(/(\d+\s*s|\d+\s*sec|\d+\s*m|\d+\s*min)\s*(?:walk|jog|rest|recovery)/i);
    const restDuration = restMatch ? restMatch[1].trim() : (isHill ? 'Jog-Down' : (descLower.includes('stride') ? '90s' : '200m'));
    const restType = isHill ? 'Jog-Down Rest' : (descLower.includes('walk') ? 'Walk Rest' : 'Recovery Jog');

    let subSectionIdx = 1;
    for (let i = 1; i <= repCount; i++) {
      splits.push({
        km: `${subSectionIdx}. ${repLabel} ${i}`,
        phase: `Rep ${i}/${repCount}`,
        pace: repPace,
        desc: isHill ? `Rep ${i} of ${repCount}: Powerful glute drive, high knees, upright torso (RPE 8)` : `Rep ${i} of ${repCount}: High-quality target effort, tall posture, light foot strikes (RPE 7-8)`,
        color: '#ff3b00'
      });
      subSectionIdx++;

      splits.push({
        km: `${subSectionIdx}. ${restDuration} ${restType} ${i}`,
        phase: `Recovery ${i}/${repCount}`,
        pace: 'Walk / Easy Jog',
        desc: isHill ? `Rest ${i} of ${repCount}: Controlled jog down to hill base, reset heart rate (RPE 2)` : `Rest ${i} of ${repCount}: Full recovery, deep belly breaths, lower heart rate (RPE 1-2)`,
        color: '#38bdf8'
      });
      subSectionIdx++;
    }

    splits.push({
      km: `Final ${cooldownKm.toFixed(1)} km`,
      phase: 'Phase 3: Cool-down Flush',
      pace: '7:50 – 8:15 min/km',
      desc: 'Gentle aerobic flush + walking cool-down to clear lactate (RPE 2)',
      color: '#a855f7'
    });
    return splits;
  }

  // D. Races / Time Trials
  if (typeLower.includes('time trial') || typeLower.includes('simulation') || typeLower.includes('hm') || typeLower.includes('vdhm') || typeLower.includes('25k') || typeLower.includes('race') || dist >= 20) {
    const startKm = Math.min(2.0, Math.max(1.0, Math.round(dist * 0.15)));
    const finishKm = Math.min(3.0, Math.max(1.0, Math.round(dist * 0.15)));
    const cruiseKmStart = startKm + 1;
    const cruiseKmEnd = dist - finishKm;

    splits.push({
      km: `Km 1 – ${startKm}`,
      phase: 'Controlled Start',
      pace: '7:15 – 7:25 min/km',
      desc: 'Disciplined start, resist surging with adrenaline, settle heart rate',
      color: '#10b981'
    });
    splits.push({
      km: `Km ${cruiseKmStart} – ${cruiseKmEnd}`,
      phase: 'Target Pace Lock',
      pace: targetPace,
      desc: 'Locked-in goal cadence (170+ SPM), take sips of hydration every 2.5 km',
      color: '#00f5d4'
    });
    splits.push({
      km: `Km ${cruiseKmEnd + 1} – ${dist}`,
      phase: 'Negative Split Finish',
      pace: '7:00 – 7:06 min/km',
      desc: 'Strong finish, maintain tall posture, empty the tank over final km',
      color: '#ff3b00'
    });
    return splits;
  }

  // E. Long Runs
  if (typeLower.includes('long run') || dist >= 7) {
    const warmupKm = 1.0;
    const finishKm = 1.0;
    const cruiseKmEnd = dist - finishKm;

    splits.push({
      km: `Km 0 – ${warmupKm.toFixed(1)}`,
      phase: 'Phase 1: Conservative Float',
      pace: '7:45 – 8:00 min/km',
      desc: 'Ultra-conservative aerobic float, loosen up hips & calves, stay in Zone 2',
      color: '#10b981'
    });
    splits.push({
      km: `Km ${(warmupKm + 0.1).toFixed(1)} – ${cruiseKmEnd.toFixed(1)}`,
      phase: 'Phase 2: Marathon Cruise',
      pace: targetPace,
      desc: 'Rhythmic marathon aerobic base. Take Salt Capsule @ 45m with 150ml water to protect calves.',
      color: '#00f5d4'
    });
    splits.push({
      km: `Final ${finishKm.toFixed(1)} km`,
      phase: 'Phase 3: Finish & Prehab',
      pace: '7:06 – 7:35 min/km',
      desc: 'Controlled finish holding cadence under fatigue. Transition directly to calf armor protocol.',
      color: '#ff7700'
    });
    return splits;
  }

  // F. Recovery Runs
  const warmupKm = dist <= 4 ? 0.8 : 1.0;
  const cooldownKm = dist <= 4 ? 0.8 : 0.8;
  const cruiseKm = Math.max(1.0, dist - warmupKm - cooldownKm);
  const cruiseEnd = warmupKm + cruiseKm;

  splits.push({
    km: `0.0 – ${warmupKm.toFixed(1)} km`,
    phase: 'Phase 1: Warmup',
    pace: '8:00 – 8:15 min/km',
    desc: 'Gentle conversational warm-up jog (RPE 2). Lubricate joint capsules and ease calves into motion.',
    color: '#10b981'
  });
  splits.push({
    km: `${warmupKm.toFixed(1)} – ${cruiseEnd.toFixed(1)} km`,
    phase: 'Phase 2: Main Cruise (Majority)',
    pace: targetPace !== 'N/A' ? targetPace : '7:35 - 7:50 min/km',
    desc: `Main aerobic base cruise (RPE 3, ${cruiseKm.toFixed(1)} km). 168 SPM cadence lock for active vascular capillary flushing.`,
    color: '#00f5d4'
  });
  splits.push({
    km: `${cruiseEnd.toFixed(1)} – ${dist.toFixed(1)} km`,
    phase: 'Phase 3: Cooldown',
    pace: '8:15+ min/km / Brisk Walk',
    desc: 'Gradual deceleration to RPE 1–2 easing down to a brisk walk before post-run calf release.',
    color: '#38bdf8'
  });

  return splits;
}

function showDailyWorkoutStrategyModal(workoutDate, weekNum, dayName) {
  const modal = document.getElementById('daily-strategy-modal');
  const container = document.getElementById('daily-strategy-modal-content');
  if (!modal || !container) return;

  // Find workout details
  let targetWo = null;
  let targetWeekNum = weekNum;

  if (Array.isArray(rawWeeksData)) {
    for (const w of rawWeeksData) {
      if (Array.isArray(w.workouts)) {
        const found = w.workouts.find(x => x.date === workoutDate || (w.week_number === weekNum && x.day === dayName));
        if (found) {
          targetWo = found;
          targetWeekNum = w.week_number;
          break;
        }
      }
    }
  }

  if (!targetWo) {
    alert('Workout details not found for ' + workoutDate);
    return;
  }

  const dist = targetWo.distance_km || 0;
  const isRest = dist === 0;
  const targetPace = targetWo.target_pace || 'N/A';
  const rpe = targetWo.rpe || 2;
  const tagClass = getTagClass(targetWo.type);

  // Compute estimated workout duration
  let estDurationStr = '25 – 35 mins';
  if (dist > 0) {
    const minMins = Math.round(dist * 7.1);
    const maxMins = Math.round(dist * 7.8);
    estDurationStr = `${minMins} – ${maxMins} mins`;
  }

  // Generate Stage Pacing Progression Splits
  const splits = generateWorkoutSplits(targetWo);

  const gcalUrl = generateGoogleCalendarUrl(targetWo);

  container.innerHTML = `
    <!-- Header -->
    <div style="margin-bottom: 1rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
        <div>
          <span class="workout-tag ${tagClass}" style="margin-bottom: 0.3rem;">${targetWo.type}</span>
          <h2 style="font-size: 1.3rem; font-weight: 900; color: #fff; margin: 0; background: linear-gradient(135deg, #fff 30%, #ffcc00 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${dayName} Strategy Blueprint
          </h2>
          <div style="font-size: 0.78rem; color: #a8a29e; margin-top: 0.2rem;">
            Week ${targetWeekNum} • Date: ${workoutDate}
          </div>
        </div>
        <span style="font-size: 0.72rem; font-weight: 800; color: #ffcc00; background: rgba(255, 140, 0, 0.15); border: 1px solid rgba(255, 140, 0, 0.4); padding: 0.25rem 0.65rem; border-radius: 9999px;">
          TMM 2027 Micro-Plan
        </span>
      </div>
    </div>

    <!-- Hero Metrics Strip -->
    <div class="strategy-hero">
      <div class="strategy-metric-pill">
        <div class="strategy-metric-label">Target Distance</div>
        <div class="strategy-metric-val">${dist > 0 ? `${dist} km` : 'Rest Day'}</div>
      </div>
      <div class="strategy-metric-pill">
        <div class="strategy-metric-label">Prescribed Pace</div>
        <div class="strategy-metric-val" style="font-size: 0.88rem;">${targetPace}</div>
      </div>
      <div class="strategy-metric-pill">
        <div class="strategy-metric-label">Est. Duration</div>
        <div class="strategy-metric-val" style="font-size: 0.88rem;">${estDurationStr}</div>
      </div>
      <div class="strategy-metric-pill">
        <div class="strategy-metric-label">Effort Level</div>
        <div class="strategy-metric-val" style="color: var(--accent-orange);">RPE ${rpe}/10</div>
      </div>
    </div>

    <!-- Workout Description Overview -->
    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-sm); padding: 0.75rem 0.9rem; font-size: 0.82rem; color: var(--text-main); margin-bottom: 0.85rem; line-height: 1.45;">
      <strong>🎯 Session Goal:</strong> ${targetWo.description}
    </div>

    <!-- Stage Pacing Progression Table -->
    <div class="strategy-splits-box">
      <div style="font-size: 0.75rem; font-weight: 800; color: #ffcc00; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
        <span>⚡ ${isRest ? 'Prehab Protocol Structure' : 'Stage-by-Stage Pacing Blueprint'}</span>
        <span style="color: var(--text-dim); font-size: 0.7rem;">Target Ceiling: 7:06 min/km</span>
      </div>
      <div>
        ${splits.map(s => `
          <div class="strategy-split-row">
            <div class="strategy-split-km">
              <span class="strategy-split-phase" style="background: rgba(255,255,255,0.06); color: ${s.color}; border: 1px solid ${s.color}40;">
                ${s.phase}
              </span>
              <span>${s.km}</span>
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted); text-align: right; flex: 1; padding: 0 0.6rem;">
              ${s.desc}
            </div>
            <div class="strategy-split-pace">
              ${s.pace}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Calf & Achilles Armor Prehab Protocol -->
    <div class="strategy-prehab-box">
      <div class="strategy-prehab-title">
        <span>🦵 Calf &amp; Achilles Armor Protocol</span>
      </div>
      <div style="color: var(--text-main); line-height: 1.45;">
        ${targetWo.strength_prehab && targetWo.strength_prehab !== 'N/A' ? targetWo.strength_prehab : '• <strong>Pre-Run:</strong> 3-min Dynamic Ankle Mobility &amp; Calf Rockers (2x15)<br>• <strong>Post-Run:</strong> Eccentric Heel Drops on a Step (3x15 straight leg + 3x15 bent knee for Soleus) + Foam rolling.'}
      </div>
    </div>

    <!-- Hydration & Gear Checklist -->
    <div class="strategy-hydration-box">
      <div class="strategy-hydration-title">
        <span>💧 Hydration &amp; Gear Checklist</span>
      </div>
      <div style="color: var(--text-main); line-height: 1.45;">
        • <strong>Pre-Run Hydration:</strong> Drink 250ml water with a pinch of Himalayan pink salt 30 mins before heading out.<br>
        • <strong>Shoe Selection:</strong> Adidas Adizero Evo SL 2 (keep forefoot strike light &amp; relaxed).<br>
        • <strong>Fueling:</strong> ${targetWo.fueling && targetWo.fueling !== 'N/A' ? targetWo.fueling : 'Water / electrolytes only for runs under 60 minutes.'}
      </div>
    </div>

    <!-- Action Buttons Row -->
    <div class="strategy-actions-bar">
      <a href="${gcalUrl}" target="_blank" class="strategy-gcal-btn" title="Add this specific run to your Google Calendar">
        <span>📅 Add to Google Calendar</span>
        <span>↗</span>
      </a>

      <div style="display: flex; gap: 0.5rem;">
        <button class="btn-icon" onclick="closeDailyStrategyModal(); sendQuickPrompt('Can you explain the pacing strategy and calf prehab for ${dayName} (${targetWo.date})?'); toggleCoachDrawer();" style="border-color: rgba(255,140,0,0.5); color: #ffcc00; font-size: 0.8rem;">
          💬 Ask Vega
        </button>
        <button class="btn-icon" onclick="closeDailyStrategyModal()" style="background: rgba(255,255,255,0.08); font-size: 0.8rem;">
          ✕ Close
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

function closeDailyStrategyModal() {
  const modal = document.getElementById('daily-strategy-modal');
  if (modal) modal.classList.remove('open');
}

window.showDailyWorkoutStrategyModal = showDailyWorkoutStrategyModal;
window.closeDailyStrategyModal = closeDailyStrategyModal;
window.saveGCalPreferences = saveGCalPreferences;

// Render Single Day Workout Card (Grid Mode)
function renderDayCard(weekNum, wo) {
  const workoutKey = `${weekNum}_${wo.day}_${wo.date}`;
  const logData = completedWorkouts[workoutKey];
  const isDone = !!logData;
  const tagClass = getTagClass(wo.type);

  const rpeVal = (logData && logData.rpe) ? logData.rpe : (wo.rpe || 2);
  const rpeBars = Array.from({ length: 10 }, (_, i) => 
    `<div class="rpe-pill ${i < rpeVal ? 'fill' : ''}"></div>`
  ).join('');

  const actualsHtml = isDone ? renderActualsBox(logData, wo.distance_km, wo.target_pace, wo.date, workoutKey) : '';

  return `
    <div class="day-card ${isDone ? 'completed' : ''}" id="day-${workoutKey}">
      <div class="day-card-header">
        <div>
          <div class="day-name">${wo.day}</div>
          <div class="day-date">${wo.date.slice(5)}</div>
        </div>
        <input type="checkbox" class="checkbox-custom" title="Mark workout completed" ${isDone ? 'checked' : ''} onchange="toggleWorkoutDone('${workoutKey}', ${wo.distance_km}, this.checked, '${wo.date}', '${wo.target_pace}')">
      </div>
      
      <div>
        <span class="workout-tag ${tagClass}">${wo.type}</span>
        <div class="day-distance">${wo.distance_km > 0 ? `${wo.distance_km} <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">km</span>` : '<span style="font-size: 0.9rem; color: var(--text-dim);">No Running</span>'}</div>
        <div class="day-pace">${wo.target_pace !== 'N/A' ? wo.target_pace : 'Rest / Strength Day'}</div>
        <div class="day-rpe-bar" title="Effort: ${rpeVal}/10">
          <span style="font-weight: 600;">RPE ${rpeVal}</span>
          <div class="rpe-pills-wrap">${rpeBars}</div>
        </div>
      </div>

      <div class="day-desc">${wo.description}</div>

      ${actualsHtml}

      <div class="day-footer">
        <button class="workout-card-strategy-btn" onclick="showDailyWorkoutStrategyModal('${wo.date}', ${weekNum}, '${wo.day}')">
          🎯 Strategy
        </button>
        ${wo.strength_prehab && wo.strength_prehab !== 'N/A' ? `
          <button class="action-pill-btn" onclick="showStrengthModal('${escapeHtml(wo.strength_prehab)}')">
            💪 Prehab
          </button>
        ` : ''}
        ${wo.fueling && wo.fueling !== 'N/A' ? `
          <button class="action-pill-btn" onclick="showFuelingModal('${escapeHtml(wo.fueling)}')">
            ⚡ Fueling
          </button>
        ` : ''}
        ${!isDone && wo.distance_km > 0 ? `
          <button class="action-pill-btn" style="border-color: rgba(16, 185, 129, 0.4); color: var(--primary);" onclick="openManualLogForDate('${wo.date}', ${wo.distance_km})">
            ✏️ Log Run
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Toggle Collapse
function toggleWeekCollapse(weekNum) {
  const card = document.getElementById(`week-card-${weekNum}`);
  if (card) {
    card.classList.toggle('collapsed');
  }
}

// Workout Completion State
function toggleWorkoutDone(key, distKm, isChecked, workoutDate, targetPace) {
  if (isChecked) {
    completedWorkouts[key] = { 
      done: true, 
      dist: distKm, 
      plannedDist: distKm,
      actualPace: targetPace || 'N/A',
      targetPace: targetPace || 'N/A',
      distDelta: 0,
      paceDeltaSec: 0,
      scorePct: 100,
      source: 'manual_checkbox',
      completedAt: new Date().toISOString() 
    };
  } else {
    delete completedWorkouts[key];
  }
  localStorage.setItem('tmm_completed_workouts', JSON.stringify(completedWorkouts));
  
  const el = document.getElementById(`day-${key}`);
  if (el) el.classList.toggle('completed', isChecked);

  // Sync to Supabase if connected
  if (supabaseClient && workoutDate) {
    supabaseClient.from('daily_workouts').update({
      is_completed: isChecked,
      actual_distance_km: isChecked ? distKm : null,
      actual_pace: isChecked ? targetPace : null,
      compliance_score_pct: isChecked ? 100 : null
    }).eq('workout_date', workoutDate).then(({ error }) => {
      if (error) console.warn('Supabase checkbox sync warning:', error);
    });
  }

  updateProgressMetrics();
  renderWeeklyPlan();
}

// Update Hero Progress Bars
function updateProgressMetrics() {
  const totalPlannedKm = 880.2;
  let completedKm = 0;
  let completedRunsCount = 0;

  Object.values(completedWorkouts).forEach(item => {
    if (item && item.done) {
      completedKm += (item.dist || 0);
      if (item.dist > 0) completedRunsCount++;
    }
  });

  const percent = Math.min(100, Math.round((completedKm / totalPlannedKm) * 100));

  const compEl = document.getElementById('metric-completed-km');
  if (compEl) compEl.textContent = `${completedKm.toFixed(1)} km`;

  const progFill = document.getElementById('metric-progress-fill');
  if (progFill) progFill.style.width = `${percent}%`;

  const progPct = document.getElementById('metric-progress-pct');
  if (progPct) progPct.textContent = `${percent}% completed (${completedRunsCount} runs done)`;
}

// Modals
function showStrengthModal(details) {
  const modal = document.getElementById('global-modal');
  const body = document.getElementById('modal-body-content');
  const title = document.getElementById('modal-title');
  if (!modal || !body || !title) return;
  
  title.innerHTML = '💪 Strength & Prehab Protocol';
  body.innerHTML = `
    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1rem;">
      <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.6;">${details}</p>
    </div>
    <div style="margin-top: 1.5rem;">
      <h4 style="color: var(--primary); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem;">Calf & Achilles Tip:</h4>
      <p style="color: var(--text-muted); font-size: 0.8rem;">Perform eccentric heel drops with a 3-second descent. Do not bounce. This builds the muscle fiber resilience necessary to cross the 18 km cramp threshold.</p>
    </div>
  `;
  modal.classList.add('open');
}

function showFuelingModal(details) {
  const modal = document.getElementById('global-modal');
  const body = document.getElementById('modal-body-content');
  const title = document.getElementById('modal-title');
  if (!modal || !body || !title) return;
  
  title.innerHTML = '⚡ Hydration & Electrolyte Strategy';
  body.innerHTML = `
    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1rem;">
      <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.6;">${details}</p>
    </div>
    <div style="margin-top: 1.5rem;">
      <h4 style="color: var(--accent-orange); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem;">Anti-Cramp Sodium Protocol:</h4>
      <p style="color: var(--text-muted); font-size: 0.8rem;">Take your salt capsule with plain water 15–20 minutes <em>before</em> your historical cramping point (km 15–16). Drink 150ml water sips every 15 minutes.</p>
    </div>
  `;
  modal.classList.add('open');
}

function closeModal() {
  const modal = document.getElementById('global-modal');
  if (modal) modal.classList.remove('open');
}

// Interactive Pace Calculator
function setupPaceCalculator() {
  const hrsInput = document.getElementById('calc-hrs');
  const minsInput = document.getElementById('calc-mins');
  const resultPace = document.getElementById('calc-result-pace');
  const split10k = document.getElementById('calc-split-10k');
  const splitHm = document.getElementById('calc-split-hm');

  function calculate() {
    if (!hrsInput || !minsInput || !resultPace) return;
    const h = parseInt(hrsInput.value) || 0;
    const m = parseInt(minsInput.value) || 0;
    const totalSecs = (h * 3600) + (m * 60);
    const paceSecsPerKm = totalSecs / 42.195;

    const paceMins = Math.floor(paceSecsPerKm / 60);
    const paceSecs = Math.round(paceSecsPerKm % 60);
    resultPace.textContent = `${paceMins}:${String(paceSecs).padStart(2, '0')} /km`;

    if (split10k) {
      const sec10k = paceSecsPerKm * 10;
      const m10 = Math.floor(sec10k / 60);
      const s10 = Math.round(sec10k % 60);
      split10k.textContent = `${m10}:${String(s10).padStart(2, '0')}`;
    }

    if (splitHm) {
      const secHm = paceSecsPerKm * 21.0975;
      const hHm = Math.floor(secHm / 3600);
      const mHm = Math.floor((secHm % 3600) / 60);
      splitHm.textContent = `${hHm}h ${mHm}m`;
    }
  }

  if (hrsInput && minsInput) {
    hrsInput.addEventListener('input', calculate);
    minsInput.addEventListener('input', calculate);
    calculate();
  }
}

// Export Supabase SQL Download
function exportSupabaseSQL() {
  const link = document.createElement('a');
  link.href = 'supabase_schema.sql';
  link.download = 'supabase_schema.sql';
  link.click();
}

function exportTrainingDataJSON() {
  const link = document.createElement('a');
  link.href = 'training_data.json';
  link.download = 'training_data.json';
  link.click();
}

let currentProcamRace = 'tmm';

function selectProcamRace(raceKey) {
  currentProcamRace = raceKey;
  
  // Update active state on cards
  const cards = document.querySelectorAll('.procam-select-card');
  cards.forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-race') === raceKey);
  });

  renderProcamRaceDetails();
}

function renderProcamRaceDetails() {
  const container = document.getElementById('procam-race-details-container');
  if (!container) return;

  const race = APP_DATA.raceCourses[currentProcamRace];
  if (!race) return;

  container.innerHTML = `
    <div class="course-card" style="margin-top: 2rem; border-top: 3px solid var(--primary); animation: fadeIn 0.3s ease-out;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: var(--primary); font-size: 0.75rem;">${race.badge}</span>
          <h2 style="font-size: 1.75rem; font-weight: 800; margin-top: 0.4rem; color: var(--text-main);">${race.name}</h2>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">📍 ${race.venue} • 📅 ${race.date}</div>
        </div>
        <div style="background: rgba(0,0,0,0.35); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1.25rem; text-align: right;">
          <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Target Training Pace</div>
          <div class="mono" style="font-size: 1.2rem; font-weight: 800; color: var(--primary);">${race.target_pace}</div>
        </div>
      </div>

      <div style="font-size: 0.9rem; color: var(--text-muted); padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border-left: 3px solid var(--primary); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-bottom: 1.5rem;">
        <strong>Strategic Role in Master Plan:</strong> ${race.role}
      </div>

      <!-- Elevation Profile Diagram -->
      <div class="elevation-chart-container">
        <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 1rem; text-transform: uppercase;">Elevation & Course Gradient Profile</h3>
        ${race.svg_elevation}
      </div>

      <!-- Sector-by-Sector Pacing Blueprint Table -->
      <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 2rem; margin-bottom: 0.75rem;">🧭 Sector-by-Sector Pacing Blueprint</h3>
      <div class="week-table-container">
        <table class="course-split-table">
          <thead>
            <tr>
              <th style="width: 250px;">Sector / Landmark</th>
              <th style="width: 120px;">Distance</th>
              <th style="width: 160px;">Target Pace</th>
              <th>Tactical Strategy & Elevation Tactics</th>
            </tr>
          </thead>
          <tbody>
            ${race.sectors.map(s => `
              <tr>
                <td><strong style="color: var(--text-main); font-size: 0.9rem;">${s.name}</strong></td>
                <td><span class="badge" style="background: rgba(56, 189, 248, 0.15); color: var(--accent-blue);">${s.dist}</span></td>
                <td><span class="mono" style="font-size: 0.85rem; font-weight: 700; color: var(--primary);">${s.pace}</span></td>
                <td style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">${s.strategy}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Comprehensive On-Course Fueling & Hydration Table -->
      <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 2.5rem; margin-bottom: 0.75rem;">⚡ On-Course Fueling & Hydration Timeline</h3>
      <div class="week-table-container">
        <table class="course-split-table">
          <thead>
            <tr>
              <th style="width: 180px;">Timing / Distance</th>
              <th style="width: 200px;">Carbohydrate Fuel</th>
              <th style="width: 220px;">Electrolytes / Salt Protocol</th>
              <th>Hydration Guideline</th>
            </tr>
          </thead>
          <tbody>
            ${race.fueling.map(f => `
              <tr>
                <td><strong style="color: var(--text-main); font-size: 0.85rem;">${f.time}</strong></td>
                <td><span style="color: var(--primary); font-weight: 700; font-size: 0.85rem;">${f.fuel}</span></td>
                <td><span style="color: var(--accent-orange); font-weight: 600; font-size: 0.85rem;">${f.electrolytes}</span></td>
                <td style="font-size: 0.85rem; color: var(--text-muted);">${f.hydration}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==============================================================================
// SUPABASE CLOUD DATABASE CONNECTION ENGINE
// ==============================================================================

async function initSupabase(url, key) {
  if (!url || !key || !window.supabase) {
    updateSupabaseStatusUI(false);
    return;
  }

  try {
    supabaseClient = window.supabase.createClient(url, key);
    
    // 1. Fetch live Master Plan data from Supabase (Source of Truth)
    const { data: weeksRows, error: weeksErr } = await supabaseClient
      .from('training_weeks')
      .select('*')
      .order('week_number', { ascending: true });

    const { data: workoutRows, error: woErr } = await supabaseClient
      .from('daily_workouts')
      .select('*')
      .order('workout_date', { ascending: true });

    if (weeksErr || woErr) {
      const err = weeksErr || woErr;
      console.warn('Supabase plan query error:', err);
      updateSupabaseStatusUI(false, err.message);
      return;
    }

    // 2. Reconstruct dynamic rawWeeksData directly from Supabase
    if (weeksRows && weeksRows.length > 0 && workoutRows && workoutRows.length > 0) {
      const weeksMap = {};
      weeksRows.forEach(w => {
        weeksMap[w.week_number] = {
          week_number: w.week_number,
          phase: w.phase_name,
          start_date: w.start_date,
          end_date: w.end_date,
          total_planned_km: Number(w.total_planned_km),
          is_deload: !!w.is_deload,
          focus: w.focus,
          workouts: []
        };
      });

      workoutRows.forEach(row => {
        // Intercept dedicated Cloud App Config row (id = 9999) for cross-device synchronization
        if (row.id === 9999 || row.workout_type === 'AppSyncConfig') {
          try {
            const config = JSON.parse(row.description);
            if (config && config.gemini_api_key && (!geminiApiKey || geminiApiKey.length < 5)) {
              geminiApiKey = config.gemini_api_key;
              localStorage.setItem('tmm_gemini_api_key', geminiApiKey);
              console.log('☁️ Auto-synced Gemini API key from Supabase cloud');
              updateCoachStatusDot();
              const keyInput = document.getElementById('gemini-api-key-input');
              if (keyInput) keyInput.value = geminiApiKey;
            }
            if (config && config.model && !localStorage.getItem('tmm_gemini_model')) {
              geminiModel = config.model;
              localStorage.setItem('tmm_gemini_model', geminiModel);
            }
            if (config && config.vega_icon_id && !localStorage.getItem('tmm_vega_icon_id')) {
              localStorage.setItem('tmm_vega_icon_id', config.vega_icon_id.toString());
              updateVegaIconEverywhere();
            }
          } catch (e) {
            console.warn('Could not parse cloud sync config:', e);
          }
          return; // Do NOT process or display config row as a training workout
        }

        const wNum = row.week_number;
        if (weeksMap[wNum]) {
          weeksMap[wNum].workouts.push({
            day: row.day_of_week,
            date: row.workout_date,
            type: row.workout_type,
            distance_km: Number(row.distance_km),
            target_pace: row.target_pace,
            rpe: row.rpe_target || 3,
            description: row.description,
            strength_prehab: row.strength_prehab,
            fueling: row.fueling_hydration_strategy
          });
        }

        // Sync completion, actuals, and variance logs from cloud row
        if (row.is_completed || row.actual_distance_km > 0) {
          const key = `${wNum}_${row.day_of_week}_${row.workout_date}`;
          const plannedDist = Number(row.distance_km) || 0;
          const actualDist = Number(row.actual_distance_km) || plannedDist;
          const targetPace = row.target_pace || 'N/A';
          const actualPace = row.actual_pace || targetPace;

          let distDelta = Number(row.distance_variance_km);
          let paceDeltaSec = Number(row.pace_variance_sec);
          let scorePct = row.compliance_score_pct !== null && row.compliance_score_pct !== undefined ? Number(row.compliance_score_pct) : null;

          // If scorePct not in DB, calculate dynamic variance on the fly
          if (scorePct === null || (scorePct === 100 && paceDeltaSec === 0 && actualPace !== targetPace && targetPace !== 'N/A')) {
            const v = calculateVariance(plannedDist, actualDist, targetPace, actualPace);
            distDelta = v.distDelta;
            paceDeltaSec = v.paceDeltaSec;
            scorePct = v.scorePct;
          }

          completedWorkouts[key] = {
            done: true,
            dist: actualDist,
            plannedDist: plannedDist,
            actualPace: actualPace,
            targetPace: targetPace,
            distDelta: distDelta !== undefined ? distDelta : (actualDist - plannedDist),
            paceDeltaSec: paceDeltaSec || 0,
            scorePct: scorePct !== null ? scorePct : 100,
            rpe: row.actual_rpe || row.rpe_target || 3,
            notes: row.athlete_notes || '',
            source: row.ingestion_source || 'cloud_db',
            completedAt: new Date().toISOString()
          };
        }
      });

      rawWeeksData = Object.values(weeksMap).sort((a, b) => a.week_number - b.week_number);
      localStorage.setItem('tmm_completed_workouts', JSON.stringify(completedWorkouts));

      // Re-render UI with live cloud data
      renderPhases();
      renderWeekJumper();
      renderWeeklyPlan();
      updateProgressMetrics();
    }

    updateSupabaseStatusUI(true, `Connected (${workoutRows ? workoutRows.length : 0} workouts in cloud)`);

    // 3. Setup real-time listener for live database changes (e.g. from GitHub Actions or Supabase table edits)
    try {
      supabaseClient
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_workouts' }, (payload) => {
          console.log('⚡ Real-time Supabase update received:', payload);
          showToastNotification('⚡ Live Cloud Sync: Workout updated from Strava!', 'success', 5000);
          // Re-fetch and re-render seamlessly
          initSupabase(url, key);
        })
        .subscribe();
    } catch (subErr) {
      console.log('Realtime subscription not supported on current key:', subErr);
    }

  } catch (err) {
    console.error('Failed to init Supabase:', err);
    updateSupabaseStatusUI(false, err.message);
  }
}

function updateSupabaseStatusUI(isConnected, msg = '') {
  const ind = document.getElementById('supabase-status-indicator');
  const lbl = document.getElementById('supabase-status-label');
  const btn = document.getElementById('btn-supabase-status');

  if (ind && lbl && btn) {
    if (isConnected) {
      ind.textContent = '🟢';
      lbl.textContent = 'Cloud Connected';
      btn.style.borderColor = 'rgba(16, 185, 129, 0.8)';
      btn.style.background = 'rgba(16, 185, 129, 0.2)';
    } else {
      ind.textContent = '⚡';
      lbl.textContent = 'Connect Supabase';
      btn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      btn.style.background = 'rgba(16, 185, 129, 0.1)';
    }
  }
}

function openSupabaseModal() {
  const modal = document.getElementById('supabase-modal');
  const urlInput = document.getElementById('supabase-input-url');
  const keyInput = document.getElementById('supabase-input-key');
  const fb = document.getElementById('supabase-test-feedback');

  if (urlInput) urlInput.value = supabaseUrl || 'https://cqgxtymtxcugpuvsvece.supabase.co';
  if (keyInput) keyInput.value = supabaseAnonKey;
  if (fb) fb.style.display = 'none';

  if (modal) modal.classList.add('open');
}

function closeSupabaseModal() {
  const modal = document.getElementById('supabase-modal');
  if (modal) modal.classList.remove('open');
}

async function saveAndTestSupabaseConnection() {
  let url = (document.getElementById('supabase-input-url')?.value || '').trim();
  const key = (document.getElementById('supabase-input-key')?.value || '').trim();
  const fb = document.getElementById('supabase-test-feedback');
  const saveBtn = document.getElementById('btn-save-supabase');

  if (!url || !key) {
    if (fb) {
      fb.style.display = 'block';
      fb.style.background = 'rgba(239, 68, 68, 0.15)';
      fb.style.border = '1px solid var(--accent-red)';
      fb.style.color = 'var(--accent-red)';
      fb.innerHTML = '❌ Please provide both Project URL and Anon Public Key.';
    }
    return;
  }

  // Format URL if user pasted just ref ID
  if (!url.startsWith('http')) {
    url = `https://${url}.supabase.co`;
  }

  if (saveBtn) saveBtn.textContent = 'Testing connection...';

  try {
    const testClient = window.supabase.createClient(url, key);
    const { data, error } = await testClient.from('daily_workouts').select('id').limit(1);

    if (error) throw error;

    // Save and store
    supabaseUrl = url;
    supabaseAnonKey = key;
    supabaseClient = testClient;
    localStorage.setItem('tmm_supabase_url', url);
    localStorage.setItem('tmm_supabase_key', key);

    if (fb) {
      fb.style.display = 'block';
      fb.style.background = 'rgba(16, 185, 129, 0.15)';
      fb.style.border = '1px solid var(--primary)';
      fb.style.color = 'var(--primary)';
      fb.innerHTML = '✅ <strong>Connection Successful!</strong> Connected to your live PostgreSQL database.';
    }

    updateSupabaseStatusUI(true);
    initSupabase(url, key);

    setTimeout(() => {
      closeSupabaseModal();
    }, 1500);

  } catch (err) {
    if (fb) {
      fb.style.display = 'block';
      fb.style.background = 'rgba(239, 68, 68, 0.15)';
      fb.style.border = '1px solid var(--accent-red)';
      fb.style.color = 'var(--accent-red)';
      fb.innerHTML = `❌ <strong>Connection Failed:</strong> ${err.message || 'Invalid credentials or schema not executed yet. Make sure you ran supabase_schema.sql in the SQL editor.'}`;
    }
    updateSupabaseStatusUI(false);
  } finally {
    if (saveBtn) saveBtn.textContent = '⚡ Save & Connect Live';
  }
}

function disconnectSupabase() {
  localStorage.removeItem('tmm_supabase_url');
  localStorage.removeItem('tmm_supabase_key');
  supabaseUrl = '';
  supabaseAnonKey = '';
  supabaseClient = null;
  updateSupabaseStatusUI(false);
  closeSupabaseModal();
}

// ==============================================================================
// WORKOUT INGESTION & VARIANCE ANALYTICS ENGINE (ZERO API / FREE)
// ==============================================================================

function openRunUploadModal() {
  const modal = document.getElementById('run-upload-modal');
  const dateInput = document.getElementById('manual-run-date');
  if (dateInput && !dateInput.value) {
    // Default to today or start of plan
    const today = new Date().toISOString().slice(0, 10);
    dateInput.value = today;
  }
  if (modal) modal.classList.add('open');
}

function closeRunUploadModal() {
  const modal = document.getElementById('run-upload-modal');
  if (modal) modal.classList.remove('open');
}

function switchIngestTab(tabName) {
  document.querySelectorAll('.ingest-subtab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.ingest-panel').forEach(p => p.style.display = 'none');

  if (tabName === 'gpx') {
    document.querySelectorAll('.ingest-subtab-btn')[0]?.classList.add('active');
    const p = document.getElementById('ingest-panel-gpx');
    if (p) p.style.display = 'block';
  } else if (tabName === 'bookmarklet') {
    document.querySelectorAll('.ingest-subtab-btn')[1]?.classList.add('active');
    const p = document.getElementById('ingest-panel-bookmarklet');
    if (p) p.style.display = 'block';
  } else if (tabName === 'manual') {
    document.querySelectorAll('.ingest-subtab-btn')[2]?.classList.add('active');
    const p = document.getElementById('ingest-panel-manual');
    if (p) p.style.display = 'block';
  }
}

function openManualLogForDate(dateStr, plannedDist) {
  openRunUploadModal();
  switchIngestTab('manual');
  
  const d = document.getElementById('manual-run-date');
  const dist = document.getElementById('manual-run-distance');
  const mins = document.getElementById('manual-run-mins');
  const secs = document.getElementById('manual-run-secs');
  const rpe = document.getElementById('manual-run-rpe');
  const notes = document.getElementById('manual-run-notes');
  const clearBtn = document.getElementById('btn-manual-clear-log');

  if (d) d.value = dateStr;

  // Find workout info
  const match = findWorkoutInfoByDate(dateStr);
  updateManualWorkoutContext(match, dateStr, plannedDist);

  // Check if existing log exists
  const workoutKey = match ? `${match.weekNumber}_${match.workout.day}_${dateStr}` : `custom_${dateStr}`;
  const existingLog = completedWorkouts[workoutKey];

  if (existingLog && existingLog.done) {
    if (dist) dist.value = existingLog.dist !== undefined ? existingLog.dist : (plannedDist || '');
    if (rpe && existingLog.rpe) rpe.value = existingLog.rpe;
    if (notes) notes.value = existingLog.notes || '';
    
    // Parse duration
    let durSec = existingLog.durationSecs;
    if (!durSec && existingLog.actualPace && existingLog.actualPace !== 'N/A') {
      const paceSec = parsePaceToSeconds(existingLog.actualPace);
      durSec = Math.round(paceSec * (existingLog.dist || plannedDist || 1));
    }
    if (durSec) {
      if (mins) mins.value = Math.floor(durSec / 60);
      if (secs) secs.value = durSec % 60;
    } else {
      if (mins) mins.value = '';
      if (secs) secs.value = '';
    }

    if (clearBtn) clearBtn.style.display = 'inline-flex';
  } else {
    if (dist) dist.value = plannedDist > 0 ? plannedDist : '';
    if (mins) mins.value = '';
    if (secs) secs.value = '';
    if (notes) notes.value = '';
    if (rpe) rpe.value = (match && match.workout.rpe) ? match.workout.rpe : '3';
    if (clearBtn) clearBtn.style.display = 'none';
  }

  updateManualLivePacePreview();
}

function updateManualWorkoutContext(match, dateStr, plannedDist) {
  const titleEl = document.getElementById('manual-workout-context-title');
  const targetEl = document.getElementById('manual-workout-context-target');
  
  if (match) {
    if (titleEl) titleEl.textContent = `📅 Week ${match.weekNumber} ${match.workout.day} • ${match.workout.type} (${match.workout.distance_km} km)`;
    if (targetEl) targetEl.textContent = `🎯 Prescribed Target: ${match.workout.target_pace} • Planned: ${match.workout.distance_km} km`;
  } else {
    if (titleEl) titleEl.textContent = `📅 Workout on ${dateStr}`;
    if (targetEl) targetEl.textContent = `Planned Distance: ${plannedDist || '—'} km`;
  }
}

function onManualDateChanged() {
  const d = document.getElementById('manual-run-date')?.value;
  if (!d) return;
  const match = findWorkoutInfoByDate(d);
  const plannedDist = match ? match.workout.distance_km : 0;
  openManualLogForDate(d, plannedDist);
}

function updateManualLivePacePreview() {
  const dist = parseFloat(document.getElementById('manual-run-distance')?.value);
  const mins = parseInt(document.getElementById('manual-run-mins')?.value) || 0;
  const secs = parseInt(document.getElementById('manual-run-secs')?.value) || 0;
  const dateStr = document.getElementById('manual-run-date')?.value;

  const paceValEl = document.getElementById('manual-live-pace-val');
  const scoreBadgeEl = document.getElementById('manual-live-score-badge');
  if (!paceValEl || !scoreBadgeEl) return;

  const totalSecs = (mins * 60) + secs;

  if (isNaN(dist) || dist <= 0 || totalSecs <= 0) {
    paceValEl.textContent = '— /km';
    scoreBadgeEl.innerHTML = '<span class="variance-pill on-target">Enter duration to calculate pace</span>';
    return;
  }

  const paceSecsPerKm = totalSecs / dist;
  const pM = Math.floor(paceSecsPerKm / 60);
  const pS = Math.round(paceSecsPerKm % 60);
  const paceStr = `${pM}:${String(pS).padStart(2, '0')} /km`;
  paceValEl.textContent = paceStr;

  // Find target pace
  const match = findWorkoutInfoByDate(dateStr);
  const plannedDist = match ? match.workout.distance_km : dist;
  const targetPace = match ? match.workout.target_pace : 'N/A';

  const variance = calculateVariance(plannedDist, dist, targetPace, `${pM}:${String(pS).padStart(2, '0')} min/km`);

  let pillClass = 'on-target';
  let pillText = `🎯 ${variance.scorePct}% Accuracy (On Target)`;

  if (variance.paceDeltaSec < -15) {
    pillClass = 'too-fast';
    pillText = `⚡ ${variance.scorePct}% Acc (${Math.abs(variance.paceDeltaSec)}s Fast)`;
  } else if (variance.paceDeltaSec > 25) {
    pillClass = 'too-slow';
    pillText = `🐢 ${variance.scorePct}% Acc (${variance.paceDeltaSec}s Slower)`;
  } else if (variance.distDelta < -1) {
    pillClass = 'under-volume';
    pillText = `⚠️ ${variance.scorePct}% Acc (${variance.distDelta}k Under)`;
  }

  scoreBadgeEl.innerHTML = `<span class="variance-pill ${pillClass}">${pillText}</span>`;
}

function quickFillTargetPace() {
  const dateStr = document.getElementById('manual-run-date')?.value;
  const match = findWorkoutInfoByDate(dateStr);
  const distInput = document.getElementById('manual-run-distance');
  const minsInput = document.getElementById('manual-run-mins');
  const secsInput = document.getElementById('manual-run-secs');

  if (!match) return;

  const targetDist = match.workout.distance_km;
  if (distInput && (!distInput.value || parseFloat(distInput.value) <= 0)) {
    distInput.value = targetDist;
  }
  const dist = parseFloat(distInput.value) || targetDist;

  const targetRange = parseTargetPaceRange(match.workout.target_pace);
  if (targetRange && dist > 0) {
    const medianSecsPerKm = (targetRange.minSec + targetRange.maxSec) / 2;
    const totalDurationSecs = Math.round(medianSecsPerKm * dist);
    if (minsInput) minsInput.value = Math.floor(totalDurationSecs / 60);
    if (secsInput) secsInput.value = totalDurationSecs % 60;
    updateManualLivePacePreview();
  }
}

function clearWorkoutLogFromModal() {
  const dateStr = document.getElementById('manual-run-date')?.value;
  if (!dateStr) return;

  const match = findWorkoutInfoByDate(dateStr);
  const workoutKey = match ? `${match.weekNumber}_${match.workout.day}_${dateStr}` : `custom_${dateStr}`;

  delete completedWorkouts[workoutKey];
  localStorage.setItem('tmm_completed_workouts', JSON.stringify(completedWorkouts));

  // Clear in Supabase if connected
  if (supabaseClient) {
    supabaseClient.from('daily_workouts').update({
      is_completed: false,
      actual_distance_km: null,
      actual_pace: null,
      actual_rpe: null,
      athlete_notes: null,
      distance_variance_km: null,
      pace_variance_sec: null,
      compliance_score_pct: null,
      actual_duration_min: null
    }).eq('workout_date', dateStr).then(({ error }) => {
      if (error) console.warn('Supabase clear warning:', error);
    });
  }

  renderWeeklyPlan();
  updateProgressMetrics();
  closeRunUploadModal();
}

function findWorkoutInfoByDate(dateStr) {
  if (!dateStr || !rawWeeksData) return null;
  for (const week of rawWeeksData) {
    if (week.workouts) {
      for (const wo of week.workouts) {
        if (wo.date === dateStr) {
          return { weekNumber: week.week_number, workout: wo };
        }
      }
    }
  }
  return null;
}

function parsePaceToSeconds(paceStr) {
  if (!paceStr || paceStr === 'N/A') return 0;
  const m = paceStr.match(/(\d+):(\d+)/);
  if (m) {
    return parseInt(m[1]) * 60 + parseInt(m[2]);
  }
  return 0;
}

function parseTargetPaceRange(paceStr) {
  if (!paceStr || paceStr === 'N/A') return null;
  const matches = [...paceStr.matchAll(/(\d+):(\d+)/g)];
  if (matches.length >= 2) {
    const p1 = parseInt(matches[0][1]) * 60 + parseInt(matches[0][2]);
    const p2 = parseInt(matches[1][1]) * 60 + parseInt(matches[1][2]);
    return { minSec: Math.min(p1, p2), maxSec: Math.max(p1, p2) };
  } else if (matches.length === 1) {
    const p = parseInt(matches[0][1]) * 60 + parseInt(matches[0][2]);
    return { minSec: p - 10, maxSec: p + 10 };
  }
  return null;
}

function calculateVariance(plannedDist, actualDist, targetPace, actualPaceStr) {
  const distDelta = Number((actualDist - plannedDist).toFixed(2));
  const distErrPct = plannedDist > 0 ? (Math.abs(distDelta) / plannedDist) * 100 : 0;

  let paceDeltaSec = 0;
  let paceErrPct = 0;

  const actualPaceSecs = parsePaceToSeconds(actualPaceStr);
  const targetRange = parseTargetPaceRange(targetPace);

  if (actualPaceSecs > 0 && targetRange) {
    if (actualPaceSecs < targetRange.minSec) {
      paceDeltaSec = actualPaceSecs - targetRange.minSec;
      paceErrPct = (Math.abs(paceDeltaSec) / targetRange.minSec) * 100;
    } else if (actualPaceSecs > targetRange.maxSec) {
      paceDeltaSec = actualPaceSecs - targetRange.maxSec;
      paceErrPct = (paceDeltaSec / targetRange.maxSec) * 100;
    } else {
      paceDeltaSec = 0;
      paceErrPct = 0;
    }
  }

  const scorePct = Math.max(0, Math.min(100, Math.round(100 - (distErrPct * 0.6 + paceErrPct * 0.4))));
  return { distDelta, paceDeltaSec, scorePct };
}

// Manual Form Handler
function saveManualRunLog() {
  const dateStr = document.getElementById('manual-run-date')?.value;
  const dist = parseFloat(document.getElementById('manual-run-distance')?.value);
  const mins = parseInt(document.getElementById('manual-run-mins')?.value) || 0;
  const secs = parseInt(document.getElementById('manual-run-secs')?.value) || 0;
  const rpe = parseInt(document.getElementById('manual-run-rpe')?.value) || 3;
  const notes = document.getElementById('manual-run-notes')?.value || '';

  if (!dateStr || isNaN(dist) || dist <= 0) {
    alert('Please enter a valid workout date and distance.');
    return;
  }

  const durationSecs = (mins * 60) + secs;
  const paceSecs = durationSecs > 0 ? durationSecs / dist : 0;
  const paceM = Math.floor(paceSecs / 60);
  const paceS = Math.round(paceSecs % 60);
  const paceStr = `${paceM}:${String(paceS).padStart(2, '0')} min/km`;

  applyIngestedRun(dateStr, dist, durationSecs, paceStr, 'Manual Quick-Log', rpe, notes);
  closeRunUploadModal();
}

// 1-Click Strava Web Bookmarklet Initialization
function initBookmarklet() {
  const scriptCode = `javascript:(function(){
    var distEl = document.querySelector('.inline-stats .stat:nth-child(1) .stat-value') || document.querySelector('[data-testid="stat-distance"]');
    var timeEl = document.querySelector('.inline-stats .stat:nth-child(2) .stat-value') || document.querySelector('[data-testid="stat-moving_time"]');
    var dateEl = document.querySelector('time') || document.querySelector('.activity-date');
    var dist = distEl ? distEl.innerText.replace(/[^0-9.]/g,'') : prompt('Enter Distance in KM:');
    var time = timeEl ? timeEl.innerText.trim() : prompt('Enter Moving Time (e.g. 45:30):');
    var d = dateEl && dateEl.getAttribute('datetime') ? dateEl.getAttribute('datetime').slice(0,10) : new Date().toISOString().slice(0,10);
    var targetUrl = '${window.location.origin + window.location.pathname}';
    alert('Run extracted from Strava:\\nDate: ' + d + '\\nDistance: ' + dist + ' km\\nTime: ' + time + '\\n\\nCopying to clipboard for TMM 2027 plan!');
    navigator.clipboard.writeText(JSON.stringify({date: d, dist: parseFloat(dist), time: time}));
  })();`;

  const link = document.getElementById('strava-bookmarklet-link');
  const preview = document.getElementById('bookmarklet-code-preview');
  if (link) link.href = scriptCode;
  if (preview) preview.textContent = scriptCode;
}

// ==============================================================================
// COACH VEGA: ADAPTIVE MARATHON AI COACH & SPORTS PHYSIOTHERAPIST
// ==============================================================================

// VEGA SUNSET ATHLETE ICONS (6 DISTINCT CONCEPTS)
var VEGA_SUNSET_ICONS = {
  1: {
    id: 1,
    title: '1. Sunset Strider',
    subtitle: 'Kinetic Runner',
    desc: 'Elite female marathoner in aerodynamic forward stride with sun halo and velocity trails.',
    svg: (size = 20) => `<svg class="vega-athlete-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: ${size}px; height: ${size}px; filter: drop-shadow(0 0 5px rgba(255, 140, 0, 0.85));"><defs><linearGradient id="vGrad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff3b00"/><stop offset="50%" stop-color="#ff8800"/><stop offset="100%" stop-color="#ffcc00"/></linearGradient></defs><circle cx="15.5" cy="4.5" r="2.5" fill="url(#vGrad1)" /><path d="M12.5 7.5L9.5 11L5.5 9.5M13.5 9.5L16.5 13.5L13 17L15 21.5M10 14L7.5 17.5L3.5 16.5" stroke="url(#vGrad1)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 4.5L7.5 4.5M2 7L5.5 7M3 9.5L5 9.5" stroke="#ffcc00" stroke-width="1.8" stroke-linecap="round"/></svg>`
  },
  2: {
    id: 2,
    title: '2. Vega Starburst',
    subtitle: 'Endurance Compass',
    desc: '4-point stellar diamond with velocity rings, honoring the brightest star in the sky.',
    svg: (size = 20) => `<svg class="vega-athlete-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: ${size}px; height: ${size}px; filter: drop-shadow(0 0 5px rgba(255, 140, 0, 0.85));"><defs><linearGradient id="vGrad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff3b00"/><stop offset="50%" stop-color="#ff8800"/><stop offset="100%" stop-color="#ffcc00"/></linearGradient></defs><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#vGrad2)" stroke="#ffcc00" stroke-width="1.5"/><circle cx="12" cy="12" r="2.5" fill="#fff"/><path d="M4 18C7.5 21.5 16.5 21.5 20 18" stroke="#ff8800" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 3"/></svg>`
  },
  3: {
    id: 3,
    title: '3. Athlete Profile',
    subtitle: 'Visor & Ponytail',
    desc: 'Sharp athletic profile of a female runner with performance race shades and aerodynamic ponytail.',
    svg: (size = 20) => `<svg class="vega-athlete-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: ${size}px; height: ${size}px; filter: drop-shadow(0 0 5px rgba(255, 140, 0, 0.85));"><defs><linearGradient id="vGrad3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff3b00"/><stop offset="50%" stop-color="#ff8800"/><stop offset="100%" stop-color="#ffcc00"/></linearGradient></defs><path d="M11 5C14 5 16.5 7.5 16.5 10.5C16.5 12 15.5 13.5 14.5 14.5L13 18H9L8.5 14C6.5 13 5.5 11 6 8.5C6.5 6.5 8.5 5 11 5Z" stroke="url(#vGrad3)" stroke-width="2.2" stroke-linecap="round"/><path d="M6 8C3.5 8.5 1.5 11 2 14C2.5 16 4.5 17 6.5 16.5" stroke="#ff3b00" stroke-width="2.2" stroke-linecap="round"/><path d="M11 9.5H17L15 12H11.5L11 9.5Z" fill="#ffcc00"/></svg>`
  },
  4: {
    id: 4,
    title: '4. Kinetic Pulse',
    subtitle: 'Heartbeat Pace Wave',
    desc: 'Zone 2 aerobic rhythm ECG wave surging into a forward speed arrow.',
    svg: (size = 20) => `<svg class="vega-athlete-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: ${size}px; height: ${size}px; filter: drop-shadow(0 0 5px rgba(255, 140, 0, 0.85));"><defs><linearGradient id="vGrad4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff3b00"/><stop offset="50%" stop-color="#ff8800"/><stop offset="100%" stop-color="#ffcc00"/></linearGradient></defs><path d="M2 12H6L8.5 5.5L12.5 18.5L15.5 8.5L17.5 12H21" stroke="url(#vGrad4)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 7L22 12L17 17" stroke="#ffcc00" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  5: {
    id: 5,
    title: '5. Aero Wings',
    subtitle: 'Cadence Wings',
    desc: 'Dual aerodynamic wings cutting through wind at sub-5:00 marathon pace.',
    svg: (size = 20) => `<svg class="vega-athlete-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: ${size}px; height: ${size}px; filter: drop-shadow(0 0 5px rgba(255, 140, 0, 0.85));"><defs><linearGradient id="vGrad5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff3b00"/><stop offset="50%" stop-color="#ff8800"/><stop offset="100%" stop-color="#ffcc00"/></linearGradient></defs><path d="M3 13C7 13 14 10 21 4C18 11 14 15 7 17L3 13Z" fill="rgba(255,119,0,0.25)" stroke="url(#vGrad5)" stroke-width="2.2" stroke-linejoin="round"/><path d="M4 17C8 17 13 15 18 11C15 16 12 19 6 20L4 17Z" fill="rgba(255,204,0,0.3)" stroke="#ffcc00" stroke-width="1.8" stroke-linejoin="round"/></svg>`
  },
  6: {
    id: 6,
    title: '6. Marathon Flame',
    subtitle: 'Endurance Torch',
    desc: 'Olympic-style stamina flame symbolizing aerobic energy and unstoppable momentum.',
    svg: (size = 20) => `<svg class="vega-athlete-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: ${size}px; height: ${size}px; filter: drop-shadow(0 0 5px rgba(255, 140, 0, 0.85));"><defs><linearGradient id="vGrad6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff3b00"/><stop offset="50%" stop-color="#ff8800"/><stop offset="100%" stop-color="#ffcc00"/></linearGradient></defs><path d="M12 2C12 2 16.5 7 16.5 11C16.5 13.5 15 15.5 13 16.5C15 14.5 15 12 14 10C13.5 12 12 13.5 10.5 14.5C10 12.5 11 10 12 8C10 9.5 8.5 12 8.5 15C8.5 18.3 11.2 21 14.5 21C17.8 21 20.5 18.3 20.5 15C20.5 9.5 12 2 12 2Z" fill="url(#vGrad6)" stroke="#ffcc00" stroke-width="1.5"/></svg>`
  }
};

function getActiveVegaIconId() {
  try {
    const stored = localStorage.getItem('tmm_vega_icon_id');
    if (!stored) return 1;
    const parsed = parseInt(stored, 10);
    return (parsed && VEGA_SUNSET_ICONS[parsed]) ? parsed : 1;
  } catch (e) {
    return 1;
  }
}

function getVegaIconSvg(size = 20) {
  const id = getActiveVegaIconId();
  return VEGA_SUNSET_ICONS[id]?.svg(size) || VEGA_SUNSET_ICONS[1].svg(size);
}

function updateVegaIconEverywhere() {
  const id = getActiveVegaIconId();
  const iconObj = VEGA_SUNSET_ICONS[id] || VEGA_SUNSET_ICONS[1];

  // 1. Update Navbar Icon
  const navBtn = document.getElementById('btn-coach-nav');
  if (navBtn) {
    navBtn.innerHTML = `
      ${iconObj.svg(18)}
      <span style="font-weight: 800; letter-spacing: 0.03em;">Vega</span>
      <span class="coach-live-pulse"></span>
    `;
  }

  // 2. Update Floating FAB Icon
  document.querySelectorAll('.coach-fab-avatar').forEach(el => {
    el.innerHTML = iconObj.svg(22);
  });

  // 3. Update Drawer Avatar Badge
  document.querySelectorAll('.coach-avatar-badge').forEach(el => {
    el.innerHTML = iconObj.svg(24);
  });

  // 4. Update Settings Modal Avatar
  const modalAvatar = document.getElementById('coach-settings-avatar-icon');
  if (modalAvatar) {
    modalAvatar.innerHTML = iconObj.svg(22);
  }

  // 5. Update Chat Messages Avatar
  renderCoachMessages();
}

function openVegaIconStudioModal() {
  renderVegaIconStudioCards();
  const modal = document.getElementById('vega-icon-studio-modal');
  if (modal) modal.classList.add('open');
}

function closeVegaIconStudioModal() {
  const modal = document.getElementById('vega-icon-studio-modal');
  if (modal) modal.classList.remove('open');
}

function renderVegaIconStudioCards() {
  const container = document.getElementById('vega-icon-studio-grid');
  if (!container) return;

  const activeId = getActiveVegaIconId();
  let html = '';

  Object.values(VEGA_SUNSET_ICONS).forEach(icon => {
    const isSelected = icon.id === activeId;
    html += `
      <div class="vega-icon-card ${isSelected ? 'selected' : ''}" onclick="selectVegaSunsetIcon(${icon.id})">
        <span class="vega-icon-card-tag">ACTIVE</span>
        <div class="vega-icon-card-svg">
          ${icon.svg(28)}
        </div>
        <div class="vega-icon-card-title">${icon.title}</div>
        <div class="vega-icon-card-subtitle">${icon.subtitle}</div>
        <div style="font-size: 0.75rem; color: #a8a29e; margin-top: 0.35rem; line-height: 1.35;">${icon.desc}</div>
        <button type="button" onclick="event.stopPropagation(); selectVegaSunsetIcon(${icon.id});" style="margin-top: 0.65rem; width: 100%; font-size: 0.75rem; font-weight: 800; padding: 0.4rem; border-radius: 6px; border: none; background: ${isSelected ? '#ffcc00' : 'rgba(255,255,255,0.1)'}; color: ${isSelected ? '#000' : '#fff'}; cursor: pointer;">
          ${isSelected ? '✓ Active Icon' : 'Select This Icon'}
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function selectVegaSunsetIcon(iconId) {
  const numId = parseInt(iconId, 10);
  if (!VEGA_SUNSET_ICONS[numId]) return;
  try {
    localStorage.setItem('tmm_vega_icon_id', numId.toString());
  } catch (e) {
    console.warn('Could not save icon to localStorage', e);
  }
  updateVegaIconEverywhere();
  renderVegaIconStudioCards();
}

window.openVegaIconStudioModal = openVegaIconStudioModal;
window.closeVegaIconStudioModal = closeVegaIconStudioModal;
window.selectVegaSunsetIcon = selectVegaSunsetIcon;

function normalizeGeminiModel(m) {
  if (!m || m === 'gemini-2.0-flash' || m === 'gemini-2.5-flash' || m === 'gemini-2.5-pro' || m === 'gemini-1.5-flash' || m === 'gemini-1.5-pro' || m === 'gemini-3.7-pro') {
    return 'gemini-3.6-flash';
  }
  return m;
}

let geminiApiKey = localStorage.getItem('tmm_gemini_api_key') || '';
let geminiModel = normalizeGeminiModel(localStorage.getItem('tmm_gemini_model') || 'gemini-3.6-flash');
let coachChatHistory = [];

try {
  const savedHistory = localStorage.getItem('tmm_coach_history');
  if (savedHistory) coachChatHistory = JSON.parse(savedHistory);
} catch (e) {
  coachChatHistory = [];
}

// Open/Close Coach Drawer
function toggleCoachDrawer() {
  const drawer = document.getElementById('ai-coach-drawer');
  const fab = document.getElementById('coach-fab-container');
  if (!drawer) return;
  const isOpen = drawer.classList.toggle('open');
  if (fab) fab.style.display = isOpen ? 'none' : 'block';
  if (isOpen) {
    updateCoachStatusDot();
    updateVegaIconEverywhere();
    setTimeout(() => {
      const input = document.getElementById('coach-input');
      if (input && typeof input.focus === 'function') input.focus();
    }, 100);
  }
}

const VEGA_AVAILABLE_MODELS = [
  { value: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash (Antigravity Flagship • Ultra Fast & High Reasoning)' },
  { value: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash (Balanced Performance & Clinical Quality)' },
  { value: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash Lite (Instant Sub-Second Latency)' },
  { value: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite' },
  { value: 'gemini-flash-latest', label: 'Gemini Flash (Auto-Alias Latest)' },
  { value: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash (High Demand Tier)' },
  { value: 'custom', label: '⚙️ Custom Antigravity / Gemini Model ID...' }
];

function handleModelSelectChange() {
  const modelSelect = document.getElementById('gemini-model-select');
  let customContainer = document.getElementById('gemini-custom-model-container');
  let customInput = document.getElementById('gemini-custom-model-input');
  
  if (!modelSelect) return;
  
  if (!customContainer && modelSelect.parentElement) {
    customContainer = document.createElement('div');
    customContainer.id = 'gemini-custom-model-container';
    customContainer.style.marginTop = '0.5rem';
    customContainer.innerHTML = `
      <input type="text" id="gemini-custom-model-input" placeholder="e.g. gemini-3.6-flash or custom-model-id" class="search-input" style="width: 100%; font-family: monospace; font-size: 0.82rem;">
      <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 0.25rem;">
        Type any model identifier available in your Google AI Studio account.
      </div>
    `;
    modelSelect.parentElement.appendChild(customContainer);
    customInput = document.getElementById('gemini-custom-model-input');
  }

  if (modelSelect.value === 'custom') {
    if (customContainer) customContainer.style.display = 'block';
    if (customInput) customInput.focus();
  } else {
    if (customContainer) customContainer.style.display = 'none';
  }
}

function getActiveCoachModel() {
  const modelSelect = document.getElementById('gemini-model-select');
  const customInput = document.getElementById('gemini-custom-model-input');
  if (modelSelect && modelSelect.value === 'custom' && customInput && customInput.value.trim()) {
    return customInput.value.trim();
  }
  if (modelSelect && modelSelect.value !== 'custom') {
    return normalizeGeminiModel(modelSelect.value);
  }
  return normalizeGeminiModel(geminiModel || 'gemini-3.6-flash');
}

// Settings Modal
function openCoachSettingsModal() {
  const modal = document.getElementById('ai-coach-settings-modal');
  const keyInput = document.getElementById('gemini-api-key-input');
  const modelSelect = document.getElementById('gemini-model-select');
  const statusEl = document.getElementById('coach-api-test-status');

  if (keyInput) keyInput.value = geminiApiKey || '';
  
  if (modelSelect) {
    // Dynamically rebuild the select options to guarantee all latest models appear
    const currentVal = normalizeGeminiModel(geminiModel || 'gemini-3.6-flash');
    const isCustom = !VEGA_AVAILABLE_MODELS.slice(0, 6).some(m => m.value === currentVal);
    
    modelSelect.innerHTML = VEGA_AVAILABLE_MODELS.map(m => 
      `<option value="${m.value}" ${(!isCustom && m.value === currentVal) || (isCustom && m.value === 'custom') ? 'selected' : ''}>${m.label}</option>`
    ).join('');
    
    let customContainer = document.getElementById('gemini-custom-model-container');
    let customInput = document.getElementById('gemini-custom-model-input');
    
    if (!customContainer && modelSelect.parentElement) {
      customContainer = document.createElement('div');
      customContainer.id = 'gemini-custom-model-container';
      customContainer.style.marginTop = '0.5rem';
      customContainer.innerHTML = `
        <input type="text" id="gemini-custom-model-input" placeholder="e.g. gemini-3.7-flash or custom-model-id" class="search-input" style="width: 100%; font-family: monospace; font-size: 0.82rem;">
        <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 0.25rem;">
          Type any model identifier available in your Google AI Studio account.
        </div>
      `;
      modelSelect.parentElement.appendChild(customContainer);
      customInput = document.getElementById('gemini-custom-model-input');
    }

    if (isCustom) {
      if (customContainer) customContainer.style.display = 'block';
      if (customInput) customInput.value = currentVal;
    } else {
      if (customContainer) customContainer.style.display = 'none';
    }
  }

  if (statusEl) statusEl.style.display = 'none';
  if (modal) modal.classList.add('open');
}

function closeCoachSettingsModal() {
  const modal = document.getElementById('ai-coach-settings-modal');
  if (modal) modal.classList.remove('open');
}

async function syncCoachSettingsToCloud(apiKey, model, iconId) {
  if (!supabaseClient) return;
  try {
    const payload = {
      id: 9999,
      week_number: 22,
      day_of_week: 'SyncConfig',
      workout_date: '2099-12-31',
      workout_type: 'AppSyncConfig',
      distance_km: 0,
      description: JSON.stringify({
        gemini_api_key: apiKey || geminiApiKey,
        model: model || geminiModel,
        vega_icon_id: iconId || getActiveVegaIconId(),
        updated_at: new Date().toISOString()
      })
    };
    await supabaseClient.from('daily_workouts').upsert(payload);
    console.log('☁️ Synced Coach Vega settings to Supabase cloud');
  } catch (e) {
    console.warn('Could not sync coach settings to Supabase:', e);
  }
}

function getMobileSyncUrl() {
  const currentKey = (geminiApiKey || document.getElementById('gemini-api-key-input')?.value || '').trim();
  const baseUrl = 'https://vish9731-agentic.github.io/TMM2027/';
  if (!currentKey) return baseUrl;
  return `${baseUrl}#gk=${encodeURIComponent(currentKey)}`;
}

function copyMobileSyncLink() {
  const currentKey = (geminiApiKey || document.getElementById('gemini-api-key-input')?.value || '').trim();
  if (!currentKey) {
    alert('Please enter and save your Gemini API key first before copying your mobile sync link.');
    return;
  }
  const url = getMobileSyncUrl();
  navigator.clipboard.writeText(url).then(() => {
    alert('📋 Direct Mobile Sync Link copied to clipboard!\n\nPaste or send this link to your phone (via WhatsApp, Notes, Email, etc.) to immediately authenticate Vega with zero typing.');
  }).catch(() => {
    prompt('Copy this mobile sync link:', url);
  });
}

function generateMobileSyncQR() {
  const currentKey = (geminiApiKey || document.getElementById('gemini-api-key-input')?.value || '').trim();
  if (!currentKey) {
    alert('Please enter and save your Gemini API key first to generate a mobile sync QR code.');
    return;
  }
  const container = document.getElementById('mobile-sync-qr-container');
  const imgDiv = document.getElementById('mobile-sync-qr-img');
  if (!container || !imgDiv) return;
  
  const url = getMobileSyncUrl();
  container.style.display = 'block';
  imgDiv.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}&bgcolor=15-23-42&color=255-204-0" alt="Mobile Sync QR Code" style="width: 160px; height: 160px; border-radius: 8px; border: 2px solid rgba(255,204,0,0.4);">`;
}

async function saveInlineCoachApiKey() {
  const input = document.getElementById('inline-coach-key-input');
  if (!input || !input.value.trim()) {
    alert('Please paste your Gemini API key.');
    return;
  }
  const key = input.value.trim();
  geminiApiKey = key;
  localStorage.setItem('tmm_gemini_api_key', key);
  updateCoachStatusDot();
  await syncCoachSettingsToCloud(geminiApiKey, geminiModel, getActiveVegaIconId());
  
  if (currentPendingPrompt) {
    processCoachQuery(currentPendingPrompt, 1);
  } else {
    coachChatHistory.push({
      role: 'bot',
      content: `🎉 **Vega Activated Successfully!**\n\nYour API key is saved and synced across all your devices via cloud. How can I assist your marathon training today?`,
      timestamp: new Date().toISOString()
    });
    renderCoachMessages();
  }
}

async function fetchCoachKeyFromCloud() {
  if (!supabaseClient) {
    alert('Connecting to Supabase cloud... please wait 2 seconds and try again or paste your key below.');
    return;
  }
  const btn = event?.target;
  const origText = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = '⏳ Fetching from cloud...';
  try {
    const { data, error } = await supabaseClient.from('daily_workouts').select('description').eq('id', 9999).maybeSingle();
    if (data && data.description) {
      const cfg = JSON.parse(data.description);
      if (cfg && cfg.gemini_api_key) {
        geminiApiKey = cfg.gemini_api_key;
        localStorage.setItem('tmm_gemini_api_key', geminiApiKey);
        if (cfg.model) {
          geminiModel = cfg.model;
          localStorage.setItem('tmm_gemini_model', geminiModel);
        }
        updateCoachStatusDot();
        if (currentPendingPrompt) {
          processCoachQuery(currentPendingPrompt, 1);
        } else {
          coachChatHistory.push({
            role: 'bot',
            content: `☁️ **Cloud Key Found & Synced!**\n\nVega is now active with model **${geminiModel}**. Ask me anything about your training plan or injuries!`,
            timestamp: new Date().toISOString()
          });
          renderCoachMessages();
        }
        return;
      }
    }
    alert('No key was found in cloud sync yet. Please paste your key once on this screen (or save it on desktop) and it will automatically sync forever!');
  } catch (e) {
    alert('Cloud sync query: ' + e.message);
  } finally {
    if (btn) btn.innerHTML = origText || '☁️ Fetch from Desktop Cloud Sync';
  }
}

function saveCoachApiSettings() {
  const keyInput = document.getElementById('gemini-api-key-input');
  const modelSelect = document.getElementById('gemini-model-select');
  const customInput = document.getElementById('gemini-custom-model-input');
  
  if (keyInput) {
    geminiApiKey = keyInput.value.trim();
    localStorage.setItem('tmm_gemini_api_key', geminiApiKey);
  }
  
  if (modelSelect) {
    let chosenModel = modelSelect.value;
    if (chosenModel === 'custom') {
      chosenModel = (customInput?.value || '').trim() || 'gemini-3.7-flash';
    }
    geminiModel = chosenModel;
    localStorage.setItem('tmm_gemini_model', geminiModel);
  }

  updateCoachStatusDot();
  syncCoachSettingsToCloud(geminiApiKey, geminiModel, getActiveVegaIconId());
  closeCoachSettingsModal();
  alert(`Coach Vega settings saved successfully!\nModel: ${geminiModel}\nCloud Sync: Active across all your devices.`);
}

window.saveCoachApiSettings = saveCoachApiSettings;
window.syncCoachSettingsToCloud = syncCoachSettingsToCloud;
window.getMobileSyncUrl = getMobileSyncUrl;
window.copyMobileSyncLink = copyMobileSyncLink;
window.generateMobileSyncQR = generateMobileSyncQR;
window.saveInlineCoachApiKey = saveInlineCoachApiKey;
window.fetchCoachKeyFromCloud = fetchCoachKeyFromCloud;

// Clean & Prune Chat History older than 48 hours (2 days)
function pruneCoachChatHistory() {
  const now = Date.now();
  const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
  
  if (!Array.isArray(coachChatHistory)) {
    coachChatHistory = [];
    return;
  }

  // Filter messages strictly within last 48 hours
  coachChatHistory = coachChatHistory.filter(msg => {
    if (!msg.timestamp) return true;
    const msgTime = new Date(msg.timestamp).getTime();
    if (isNaN(msgTime)) return true;
    return (now - msgTime) <= FORTY_EIGHT_HOURS_MS;
  });

  // Keep at most 40 messages
  if (coachChatHistory.length > 40) {
    coachChatHistory = coachChatHistory.slice(-40);
  }

  try {
    localStorage.setItem('tmm_coach_history', JSON.stringify(coachChatHistory));
  } catch (e) {
    console.warn('Failed to save pruned history:', e);
  }
}

// Clear Memory function
function clearCoachChatHistory() {
  if (confirm('Clear Vega chat history and rolling 48-hour memory?')) {
    coachChatHistory = [];
    localStorage.removeItem('tmm_coach_history');
    localStorage.removeItem('tmm_coach_pending_query');
    hideCoachQueue();
    renderCoachMessages();
    alert('Chat memory cleared successfully!');
  }
}
window.clearCoachChatHistory = clearCoachChatHistory;

// Strict Gemini Execution (No fallback - answers strictly from selected model)
async function executeGeminiStrictRequest(model, key, contents) {
  const modelName = normalizeGeminiModel(model) || 'gemini-3.6-flash';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2500
      }
    })
  });

  if (res.ok) {
    const data = await res.json();
    return { ok: true, data };
  }

  const errData = await res.json().catch(() => ({}));
  return {
    ok: false,
    status: res.status,
    message: errData.error?.message || `HTTP ${res.status}`
  };
}

// Live Queue & Countdown Management
let coachCountdownInterval = null;
let currentPendingPrompt = null;
let currentPendingAttempt = 1;

function showCoachQueue(secondsLeft, attemptNum, promptText) {
  const queueBox = document.getElementById('coach-queue-box');
  const countEl = document.getElementById('coach-countdown-val');
  const msgEl = document.getElementById('coach-queue-msg');
  const typingIndicator = document.getElementById('coach-typing-indicator');

  if (typingIndicator) typingIndicator.style.display = 'none';

  if (queueBox && countEl && msgEl) {
    queueBox.style.display = 'flex';
    msgEl.innerHTML = `⏳ <strong>${geminiModel} high demand.</strong> Auto-retrying in <span id="coach-countdown-val" style="font-weight: 800; font-family: monospace; color: #fff; background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 4px; font-size: 0.85rem;">${secondsLeft}</span>s... (Attempt ${attemptNum}/10)`;
  }

  if (coachCountdownInterval) clearInterval(coachCountdownInterval);

  let remaining = secondsLeft;
  coachCountdownInterval = setInterval(() => {
    remaining--;
    const countElNow = document.getElementById('coach-countdown-val');
    if (countElNow) countElNow.textContent = Math.max(0, remaining);

    if (remaining <= 0) {
      clearInterval(coachCountdownInterval);
      coachCountdownInterval = null;
      hideCoachQueue();
      processCoachQuery(promptText, attemptNum + 1);
    }
  }, 1000);
}

function hideCoachQueue() {
  if (coachCountdownInterval) {
    clearInterval(coachCountdownInterval);
    coachCountdownInterval = null;
  }
  const queueBox = document.getElementById('coach-queue-box');
  if (queueBox) queueBox.style.display = 'none';
}

function triggerImmediateRetry() {
  hideCoachQueue();
  const pending = getStoredPendingCoachQuery();
  if (pending && pending.prompt) {
    processCoachQuery(pending.prompt, (pending.attempt || 1) + 1);
  } else if (currentPendingPrompt) {
    processCoachQuery(currentPendingPrompt, currentPendingAttempt + 1);
  }
}
window.triggerImmediateRetry = triggerImmediateRetry;

function getStoredPendingCoachQuery() {
  try {
    const raw = localStorage.getItem('tmm_coach_pending_query');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function updateCoachStatusDot() {
  const dot = document.getElementById('coach-fab-status-dot');
  const navPulse = document.querySelector('.coach-live-pulse');
  const isOnline = Boolean(geminiApiKey && geminiApiKey.length > 5);
  if (dot) {
    dot.style.background = isOnline ? '#10b981' : '#f59e0b';
    dot.title = isOnline ? 'Vega AI Online' : 'Vega Key Needed';
  }
  if (navPulse) {
    navPulse.style.background = isOnline ? '#10b981' : '#f59e0b';
  }
}
window.updateCoachStatusDot = updateCoachStatusDot;

function getEffectiveApiKey() {
  if (geminiApiKey && geminiApiKey.length > 5) return geminiApiKey;
  const inputVal = document.getElementById('gemini-api-key-input')?.value?.trim();
  if (inputVal && inputVal.length > 5) {
    geminiApiKey = inputVal;
    localStorage.setItem('tmm_gemini_api_key', inputVal);
    updateCoachStatusDot();
    return geminiApiKey;
  }
  const inlineVal = document.getElementById('inline-coach-key-input')?.value?.trim();
  if (inlineVal && inlineVal.length > 5) {
    geminiApiKey = inlineVal;
    localStorage.setItem('tmm_gemini_api_key', inlineVal);
    updateCoachStatusDot();
    return geminiApiKey;
  }
  const stored = localStorage.getItem('tmm_gemini_api_key')?.trim();
  if (stored && stored.length > 5) {
    geminiApiKey = stored;
    updateCoachStatusDot();
    return geminiApiKey;
  }
  return '';
}

function handleCoachApiKeyInput(val) {
  const cleanVal = (val || '').trim();
  if (cleanVal.length > 5) {
    geminiApiKey = cleanVal;
    localStorage.setItem('tmm_gemini_api_key', cleanVal);
    updateCoachStatusDot();
    syncCoachSettingsToCloud(geminiApiKey, geminiModel, getActiveVegaIconId());
  }
}
window.handleCoachApiKeyInput = handleCoachApiKeyInput;

function closeCoachSettingsModal() {
  const keyInput = document.getElementById('gemini-api-key-input');
  if (keyInput && keyInput.value.trim().length > 5) {
    geminiApiKey = keyInput.value.trim();
    localStorage.setItem('tmm_gemini_api_key', geminiApiKey);
    updateCoachStatusDot();
    syncCoachSettingsToCloud(geminiApiKey, geminiModel, getActiveVegaIconId());
  }
  const modal = document.getElementById('ai-coach-settings-modal');
  if (modal) modal.classList.remove('open');
}

// Test Connection strictly with chosen model
async function testCoachApiConnection() {
  const keyInput = document.getElementById('gemini-api-key-input');
  const key = keyInput?.value?.trim() || geminiApiKey;
  const model = getActiveCoachModel();
  const statusEl = document.getElementById('coach-api-test-status');

  if (!key || key.length < 5) {
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.style.background = 'rgba(239, 68, 68, 0.15)';
      statusEl.style.color = 'var(--accent-red)';
      statusEl.textContent = '❌ Please enter a valid Gemini API key first.';
    }
    return;
  }

  // AUTO-SAVE IMMEDIATELY on test so the key is never lost when closing the modal
  geminiApiKey = key;
  geminiModel = model;
  localStorage.setItem('tmm_gemini_api_key', geminiApiKey);
  localStorage.setItem('tmm_gemini_model', geminiModel);
  updateCoachStatusDot();
  syncCoachSettingsToCloud(geminiApiKey, geminiModel, getActiveVegaIconId());

  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.style.background = 'rgba(99, 102, 241, 0.15)';
    statusEl.style.color = '#818cf8';
    statusEl.textContent = `🔄 Testing connection strictly with ${model}...`;
  }

  const result = await executeGeminiStrictRequest(
    model,
    key,
    [{ role: 'user', parts: [{ text: 'Respond with the single word READY.' }] }]
  );

  if (result.ok) {
    if (statusEl) {
      statusEl.style.background = 'rgba(16, 185, 129, 0.15)';
      statusEl.style.color = 'var(--primary)';
      statusEl.textContent = `✅ Connection successful! Key auto-saved & Coach Vega is active strictly on ${model}.`;
    }
  } else {
    if (statusEl) {
      statusEl.style.background = 'rgba(239, 68, 68, 0.15)';
      statusEl.style.color = 'var(--accent-red)';
      if (result.status === 503 || result.status === 429) {
        statusEl.innerHTML = `⚠️ <strong>Google Server 503 (High Demand on ${model}):</strong><br>Google servers are temporarily busy on this model. When you ask questions in the chat, Vega will automatically queue them with a live countdown timer and retry until answered.`;
      } else {
        statusEl.textContent = `❌ API Error (${result.status}): ${result.message}`;
      }
    }
  }
}

// Main Send Message Function
async function sendCoachMessage() {
  const input = document.getElementById('coach-input');
  const userText = input?.value.trim();
  if (!userText) return;

  if (input) input.value = '';

  coachChatHistory.push({ role: 'user', content: userText, timestamp: new Date().toISOString() });
  pruneCoachChatHistory();
  renderCoachMessages();

  processCoachQuery(userText, 1);
}

function buildCoachContext() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const upcomingWeeks = (rawWeeksData || []).slice(0, 4).map(w => ({
    week_number: w.week_number,
    phase: w.phase,
    focus: w.focus,
    total_km: w.total_planned_km,
    workouts: (w.workouts || []).map(wo => ({
      day: wo.day,
      date: wo.date,
      type: wo.type,
      distance_km: wo.distance_km,
      target_pace: wo.target_pace,
      rpe: wo.rpe,
      description: wo.description,
      strength_prehab: wo.strength_prehab
    }))
  }));

  const completedLog = [];
  try {
    for (const [key, val] of Object.entries(completedWorkouts || {})) {
      if (val && val.done) {
        completedLog.push({
          key,
          actualDistanceKm: val.dist,
          plannedDistanceKm: val.plannedDist,
          actualPace: val.actualPace,
          targetPace: val.targetPace,
          scorePct: val.scorePct,
          notes: val.notes
        });
      }
    }
  } catch (e) {}

  return {
    athlete: {
      name: "TMM 2027 Runner",
      target_race: "Tata Mumbai Marathon 2027 (Jan 17, 2027)",
      goal: "Sub-5:00:00 (7:06 min/km pace)",
      interim_milestone: "Vedanta Delhi Half Marathon (VDHM) Oct 18, 2026",
      current_gear: "Adidas Adizero Evo SL 2",
      tracking_hardware: "Galaxy Watch / Strava Sync"
    },
    today_date: todayStr,
    current_mesocycle_weeks: upcomingWeeks,
    recent_workout_history: completedLog.slice(-10)
  };
}

// Core Async Processing Engine with Persistence
async function processCoachQuery(userText, attempt = 1) {
  currentPendingPrompt = userText;
  currentPendingAttempt = attempt;

  let effectiveKey = getEffectiveApiKey();

  if (!effectiveKey) {
    // Try auto-fetching from Supabase cloud just-in-time
    if (supabaseClient) {
      try {
        const { data: configData } = await supabaseClient.from('daily_workouts').select('description').eq('id', 9999).maybeSingle();
        if (configData && configData.description) {
          const cfg = JSON.parse(configData.description);
          if (cfg && cfg.gemini_api_key) {
            geminiApiKey = cfg.gemini_api_key;
            localStorage.setItem('tmm_gemini_api_key', geminiApiKey);
            updateCoachStatusDot();
            effectiveKey = geminiApiKey;
            console.log('⚡ Retrieved API key from Supabase cloud just-in-time');
          }
        }
      } catch (e) {}
    }
  }

  if (!effectiveKey) {
    localStorage.removeItem('tmm_coach_pending_query');
    hideCoachQueue();
    coachChatHistory.push({
      role: 'bot',
      content: `👋 **Welcome! I'm Coach Vega.** 🏃‍♀️\n\nTo activate real-time marathon coaching & workout adjustments on this device, click **☁️ Fetch from Desktop Cloud Sync** below (or paste your free Google Gemini API key):`,
      showKeyInput: true,
      timestamp: new Date().toISOString()
    });
    pruneCoachChatHistory();
    renderCoachMessages();
    return;
  }

  // Persist pending query to localStorage so it resumes across reloads / log-offs
  localStorage.setItem('tmm_coach_pending_query', JSON.stringify({
    prompt: userText,
    attempt: attempt,
    timestamp: Date.now()
  }));

  const typingIndicator = document.getElementById('coach-typing-indicator');
  const typingText = document.getElementById('coach-typing-text');
  if (typingIndicator) {
    typingIndicator.style.display = 'flex';
    if (typingText) typingText.textContent = `Coach Vega (${geminiModel}) is analyzing${attempt > 1 ? ` (Attempt ${attempt})...` : '...'}`;
  }
  hideCoachQueue();

  try {
    const context = buildCoachContext();
    
    const systemPrompt = `You are Coach Vega — an elite marathon coach, exercise physiologist, and sports physical therapist specialized in coaching an athlete for the Tata Mumbai Marathon 2027 (Target: Sub-5:00:00 finish at 7:06 min/km pace).
The athlete is training in Adidas Adizero Evo SL 2 shoes and tracking with Galaxy Watch / Strava.

ATHLETE TELEMETRY & 4-WEEK MESOCYCLE SCHEDULE CONTEXT:
${JSON.stringify(context, null, 2)}

YOUR CORE COACHING & DIAGNOSTIC DIRECTIVES:
1. **Heartful, Empathetic & Clinical Interviewing:** You care deeply about the athlete's long-term health, longevity, and race-day success. When the athlete mentions pain, calf tightness, strain, unusual fatigue, or a missed workout, DO NOT immediately prescribe major changes without understanding context. First ask 1–2 sharp, empathetic diagnostic questions (e.g. pain location/nature, when it began, pace on recent runs, shoe feel in Evo SL 2, stretching/foam rolling, hydration/cramps).
2. **Root Cause Analysis:** Once you have gathered the context (or if enough context is already provided in the message and Strava telemetry), explain clearly WHY this occurred (e.g., pace variance on Wednesday exceeding Zone 2 aerobic ceiling causing excessive soleus/Achilles loading, insufficient eccentric heel drops, or dehydration).
3. **Targeted Prehab/Rehab:** Prescribe immediate physical therapy relief (e.g. eccentric single-leg heel drops on a step 3x15, soleus foam rolling, hydration/electrolytes).
4. **Comprehensive Schedule Adjustment Authority (Single-Day, Full-Week, or Entire Month):**
   - You have FULL authority to adjust:
     a) A single day (e.g. swap today with rest/cross-training).
     b) An entire 7-day week (e.g. deloading Week 1 or Week 2, reducing mileage by 25-40% with extra recovery shakeouts and eccentric prehab).
     c) An entire month (e.g. restructuring the next 4 weeks into a gentle ramp rebuild to allow calf tissues to heal while preserving aerobic base for VDHM and TMM 2027).
   - When modifying workouts:
     - Provide your analysis and reasoning in conversational text.
     - AND output a structured plan change proposal in a dedicated JSON code block tagged with \`\`\`plan_change_proposal ... \`\`\`.
   The JSON format MUST be:
   \`\`\`plan_change_proposal
   {
     "summary": "Clear summary of the changes (e.g. 'Deload Week 1 & 2 to reduce calf stress while maintaining aerobic consistency')",
     "changes": [
       {
         "workout_date": "YYYY-MM-DD",
         "day_of_week": "Friday",
         "workout_type": "Recovery Shakeout + Calf Prehab",
         "distance_km": 3.5,
         "target_pace": "8:00 - 8:15 min/km",
         "rpe": 2,
         "description": "Very easy gentle recovery run. Focus on soft foot strikes.",
         "strength_prehab": "Eccentric heel drops (3x15/leg), gentle calf massage"
       }
     ]
   }
   \`\`\`

Tone: Warm, empathetic, inspiring, analytical, and authoritative. Speak like an elite Olympic coach who genuinely cares about the athlete.`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt + '\n\nPlease acknowledge with readiness.' }] },
      { role: 'model', parts: [{ text: "Understood. I am Coach Vega, your marathon coach and sports physiotherapist for TMM 2027. I am ready to analyze your telemetry, diagnose your setbacks, and optimize your master plan across days, weeks, or full months." }] }
    ];

    // Sanitize conversation history to guarantee strictly alternating user/model turns
    const sanitizedHistory = [];
    coachChatHistory.slice(-14).forEach(msg => {
      if (msg.showKeyInput) return; // Ignore activation UI bubble in prompt
      const role = msg.role === 'user' ? 'user' : 'model';
      const text = (msg.content || '').trim();
      if (!text) return;

      if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === role) {
        sanitizedHistory[sanitizedHistory.length - 1].parts[0].text += '\n\n' + text;
      } else {
        sanitizedHistory.push({ role, parts: [{ text }] });
      }
    });

    sanitizedHistory.forEach(turn => contents.push(turn));

    const modelToUse = normalizeGeminiModel(geminiModel) || 'gemini-3.6-flash';
    const result = await executeGeminiStrictRequest(modelToUse, effectiveKey, contents);

    if (result.ok) {
      localStorage.removeItem('tmm_coach_pending_query');
      currentPendingPrompt = null;
      hideCoachQueue();

      const botResponseText = result.data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm reviewing your training schedule. How are your legs feeling today?";
      coachChatHistory.push({
        role: 'bot',
        content: botResponseText,
        timestamp: new Date().toISOString()
      });
      pruneCoachChatHistory();
      renderCoachMessages();
    } else {
      if ((result.status === 503 || result.status === 429) && attempt <= 5) {
        const waitSec = Math.min(8 + (attempt - 1) * 4, 25);
        showCoachQueue(waitSec, attempt, userText);
      } else {
        localStorage.removeItem('tmm_coach_pending_query');
        hideCoachQueue();
        coachChatHistory.push({
          role: 'bot',
          content: `⚠️ **API Error (${result.status || 'Request Failed'}):** ${result.message || 'Unable to connect to model.'}`,
          timestamp: new Date().toISOString()
        });
        pruneCoachChatHistory();
        renderCoachMessages();
      }
    }
  } catch (err) {
    console.error('Vega query execution error:', err);
    localStorage.removeItem('tmm_coach_pending_query');
    hideCoachQueue();
    coachChatHistory.push({
      role: 'bot',
      content: `⚠️ **Processing Error:** ${err.message || 'An unexpected error occurred.'}`,
      timestamp: new Date().toISOString()
    });
    pruneCoachChatHistory();
    renderCoachMessages();
  } finally {
    if (typingIndicator && !coachCountdownInterval) {
      typingIndicator.style.display = 'none';
    }
  }
}

// Trigger Live Sunday 6:00 PM Weekly Debrief Demo
async function triggerWeeklyDebriefDemo(weekNumber = 1) {
  // 1. Open Vega Drawer
  const drawer = document.getElementById('ai-coach-drawer');
  if (drawer && !drawer.classList.contains('open')) {
    toggleCoachDrawer();
  }

  // 2. Simulate native phone/browser notification
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(`🏃 Coach Vega • Sunday 6:00 PM Debrief (Week ${weekNumber})`, {
          body: `Week ${weekNumber} telemetry analysis complete. Tap to view your performance brief & diagnostic check-in.`,
          icon: 'icons/icon.svg'
        });
      } catch (e) {}
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          try {
            new Notification(`🏃 Coach Vega • Sunday 6:00 PM Debrief (Week ${weekNumber})`, {
              body: `Week ${weekNumber} telemetry analysis complete. Tap to view your performance brief & diagnostic check-in.`,
              icon: 'icons/icon.svg'
            });
          } catch (e) {}
        }
      });
    }
  }

  // 3. Assemble Week Telemetry Data
  const targetWeek = (rawWeeksData || []).find(w => w.week_number === weekNumber) || (rawWeeksData || [])[0];
  const nextWeek = (rawWeeksData || []).find(w => w.week_number === weekNumber + 1) || (rawWeeksData || [])[1];

  if (!targetWeek) {
    alert('No training data found for Week ' + weekNumber);
    return;
  }

  const weeklyWorkouts = (targetWeek.workouts || []).map(wo => {
    const logKey = `${targetWeek.week_number}_${wo.day}_${wo.date}`;
    const log = (typeof completedWorkouts !== 'undefined' && completedWorkouts[logKey]) ? completedWorkouts[logKey] : null;
    return {
      day: wo.day,
      date: wo.date,
      type: wo.type,
      planned_distance_km: wo.distance_km,
      actual_distance_km: log && log.done ? (log.dist || wo.distance_km) : 0,
      target_pace: wo.target_pace,
      actual_pace: log && log.done ? (log.actualPace || wo.target_pace) : (log ? 'Missed' : 'Pending'),
      completed: log ? !!log.done : false,
      variance_score: log ? log.scorePct : null,
      notes: log ? log.notes : (wo.day === 'Friday' ? 'Marked left calf tightness on Friday' : null)
    };
  });

  const plannedTotalKm = targetWeek.total_planned_km || weeklyWorkouts.reduce((acc, w) => acc + w.planned_distance_km, 0);
  const actualTotalKm = weeklyWorkouts.reduce((acc, w) => acc + (w.actual_distance_km || 0), 0);
  const adherencePct = plannedTotalKm > 0 ? Math.round((actualTotalKm / plannedTotalKm) * 100) : 0;

  const telemetryPayload = {
    evaluated_week_number: targetWeek.week_number,
    phase: targetWeek.phase,
    focus: targetWeek.focus,
    total_planned_km: plannedTotalKm,
    total_completed_km: actualTotalKm,
    adherence_percentage: adherencePct + '%',
    workouts: weeklyWorkouts,
    next_week_scheduled_workouts: nextWeek ? nextWeek.workouts : []
  };

  const userPromptText = `[AUTOMATED SUNDAY 6:00 PM DEBRIEF TRIGGER]\nPlease evaluate my performance for Week ${weekNumber} using my exact telemetry. Give me a short, un-templated clinical brief on how this week went, and ask me 2–3 bespoke diagnostic questions tailored specifically to what occurred in my data.`;

  coachChatHistory.push({
    role: 'user',
    content: `📊 **Sunday 6:00 PM Weekly Debrief Trigger (Week ${weekNumber})**\n\n*Gathered 7-day GPS logs, pace adherence, and calf recovery events. Analyzing telemetry...*`,
    timestamp: new Date().toISOString()
  });
  renderCoachMessages();

  processCoachWeeklyDebrief(telemetryPayload, userPromptText);
}
window.triggerWeeklyDebriefDemo = triggerWeeklyDebriefDemo;

async function processCoachWeeklyDebrief(telemetryPayload, userPromptText) {
  const typingIndicator = document.getElementById('coach-typing-indicator');
  const typingText = document.getElementById('coach-typing-text');
  if (typingIndicator) {
    typingIndicator.style.display = 'flex';
    if (typingText) typingText.textContent = `Coach Vega is analyzing Week ${telemetryPayload.evaluated_week_number} telemetry...`;
  }

  const effectiveKey = getEffectiveApiKey();
  if (!effectiveKey) {
    hideCoachQueue();
    if (typingIndicator) typingIndicator.style.display = 'none';
    coachChatHistory.push({
      role: 'bot',
      content: `👋 **Welcome! I'm Coach Vega.** 🏃‍♀️\n\nPlease activate your Google Gemini API Key first to run your dynamic Sunday Debrief.`,
      showKeyInput: true,
      timestamp: new Date().toISOString()
    });
    renderCoachMessages();
    return;
  }

  const systemPrompt = `You are Coach Vega — elite Olympic marathon coach, exercise physiologist, and physical therapist for an athlete targeting Sub-5:00 (7:06 min/km pace) at the Tata Mumbai Marathon 2027.
The athlete is training in Adidas Adizero Evo SL 2 shoes.

WEEKLY TELEMETRY DATA (EXACT 7-DAY COMPLIANCE LOGS):
${JSON.stringify(telemetryPayload, null, 2)}

YOUR RESPONSE MUST STRICTLY FOLLOW THIS 3-SECTION ARCHITECTURE:

### 📋 Section 1: Weekly Performance Brief
- Provide a concise, clinical, punchy 3-4 sentence evaluation of how the week went based on the exact telemetry (volume adherence, pacing discipline, anomalies like pace spikes, and injury flags).

### ❓ Section 2: Dynamic Diagnostic Questions
- Ask 2–3 sharp, bespoke check-in questions based strictly on what happened in this week's data. Zero templates and zero generic filler. (e.g. asking about calf load after the Wednesday 6:38 pace spike, pain location for Friday's skipped strength, or fatigue on Sunday's final km).

### 🔄 Section 3: Adaptive Plan Next Steps
- Explain that once the runner replies to the questions above in this chat, you will analyze their answers, propose a concrete tailored plan adjustment for Week ${telemetryPayload.evaluated_week_number + 1} (with plan change diff preview), and ask for their approval before committing changes to the cloud master plan.

Tone: Warm, empathetic, analytical, inspiring, and authoritative.`;

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPromptText }] }
  ];

  const modelToUse = normalizeGeminiModel(geminiModel) || 'gemini-3.6-flash';
  const result = await executeGeminiStrictRequest(modelToUse, effectiveKey, contents);

  if (typingIndicator) typingIndicator.style.display = 'none';

  if (result.ok) {
    const botText = result.data.candidates?.[0]?.content?.parts?.[0]?.text || "Weekly telemetry analyzed. How did your legs feel on Sunday's long run?";
    coachChatHistory.push({
      role: 'bot',
      content: botText,
      timestamp: new Date().toISOString()
    });
    pruneCoachChatHistory();
    renderCoachMessages();
  } else {
    coachChatHistory.push({
      role: 'bot',
      content: `⚠️ **Debrief Error (${result.status || 'Failed'}):** ${result.message || 'Unable to analyze week.'}`,
      timestamp: new Date().toISOString()
    });
    pruneCoachChatHistory();
    renderCoachMessages();
  }
}
window.processCoachWeeklyDebrief = processCoachWeeklyDebrief;

// Auto-Resume Pending Coach Query on Page Load (even if user closed browser or reloaded)
function checkAndResumePendingCoachQuery() {
  pruneCoachChatHistory();
  const pending = getStoredPendingCoachQuery();
  if (pending && pending.prompt && geminiApiKey) {
    console.log('🔄 Resuming pending Gemini 3.7 coach query from previous session:', pending);
    setTimeout(() => {
      processCoachQuery(pending.prompt, (pending.attempt || 1));
    }, 800);
  }
}

// Render Messages & Interactive Plan Diff Cards
function renderCoachMessages() {
  const container = document.getElementById('coach-messages-container');
  if (!container) return;

  const currentIconSvg = getVegaIconSvg(18);

  const renderKeyActivatorSnippet = () => `
    <div class="coach-key-activator-box" style="margin-top: 0.85rem; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 183, 3, 0.35); border-radius: 10px; padding: 0.85rem;">
      <div style="font-size: 0.82rem; font-weight: 800; color: #ffb703; margin-bottom: 0.4rem; display: flex; align-items: center; justify-content: space-between;">
        <span>⚡ Instant Mobile Activation</span>
        <span style="font-size: 0.68rem; font-weight: 600; color: #94a3b8;">Zero-Typing Cloud Sync</span>
      </div>
      <div style="font-size: 0.76rem; color: #cbd5e1; line-height: 1.4; margin-bottom: 0.65rem;">
        Click below to auto-fetch your key from desktop cloud sync, or paste your free Google Gemini key:
      </div>
      <button type="button" onclick="fetchCoachKeyFromCloud()" style="width: 100%; margin-bottom: 0.6rem; background: rgba(99, 102, 241, 0.25); border: 1px solid rgba(99, 102, 241, 0.5); color: #a5b4fc; font-weight: 700; font-size: 0.76rem; padding: 0.5rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
        ☁️ Fetch from Desktop Cloud Sync
      </button>
      <div style="display: flex; gap: 0.4rem;">
        <input type="password" id="inline-coach-key-input" placeholder="Or paste AIzaSy... key here" style="flex: 1; font-size: 0.78rem; padding: 0.45rem 0.6rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.5); color: #fff; font-family: monospace;">
        <button type="button" onclick="saveInlineCoachApiKey()" style="background: #ffcc00; color: #000; font-weight: 800; font-size: 0.75rem; padding: 0.45rem 0.85rem; border: none; border-radius: 6px; cursor: pointer; white-space: nowrap;">
          Activate
        </button>
      </div>
      <div style="margin-top: 0.5rem; font-size: 0.7rem; color: var(--text-dim); text-align: right;">
        <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--primary); text-decoration: underline;">Get free Gemini API key ↗</a>
      </div>
    </div>
  `;

  if (coachChatHistory.length === 0) {
    const welcomeKeyBox = !geminiApiKey ? renderKeyActivatorSnippet() : '';
    container.innerHTML = `
      <div class="coach-msg bot">
        <div class="coach-msg-avatar">${currentIconSvg}</div>
        <div class="coach-msg-bubble">
          <p><strong>Hi! I'm Coach Vega.</strong> 👋</p>
          <p style="margin-top: 0.4rem;">
            I'm your personal marathon coach and recovery specialist for the <strong>Tata Mumbai Marathon 2027</strong>.
          </p>
          <p style="margin-top: 0.4rem;">
            I have full live visibility into your 22-week plan, your recent Strava runs, and your training variance. 
            If your calves feel tight, you miss a workout, or you want to deload an entire week or month, just tell me! I will investigate what happened and suggest tailored plan changes.
          </p>
          ${welcomeKeyBox}
        </div>
      </div>
    `;
    return;
  }

  let html = '';
  coachChatHistory.forEach((msg, idx) => {
    const isBot = (msg.role === 'bot' || msg.role === 'model' || msg.role === 'assistant');
    
    let parsedText = msg.content;
    let planProposalHtml = '';

    const proposalMatch = msg.content.match(/```plan_change_proposal([\s\S]*?)```/);
    if (proposalMatch) {
      try {
        const proposalJson = JSON.parse(proposalMatch[1].trim());
        parsedText = msg.content.replace(proposalMatch[0], '').trim();
        planProposalHtml = renderCoachPlanProposalWidget(proposalJson, idx);
      } catch (pe) {
        console.warn('Could not parse plan proposal JSON:', pe);
      }
    }

    let formattedText = escapeHtmlText(parsedText)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    const inlineKeyBox = (isBot && msg.showKeyInput && !geminiApiKey) ? renderKeyActivatorSnippet() : '';

    html += `
      <div class="coach-msg ${isBot ? 'bot' : 'user'}">
        <div class="coach-msg-avatar">${isBot ? currentIconSvg : '🏃'}</div>
        <div class="coach-msg-bubble">
          <p>${formattedText}</p>
          ${planProposalHtml}
          ${inlineKeyBox}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
}

function escapeHtmlText(text) {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Render Interactive Plan Diff Widget (Handles Single-Day, Multi-Day, Full-Week, and Full-Month Overhauls)
function renderCoachPlanProposalWidget(proposal, msgIdx) {
  const changes = proposal.changes || [];
  if (changes.length === 0) return '';

  // Group changes by Week Number
  const weekGroups = {};
  let totalBeforeKm = 0;
  let totalAfterKm = 0;

  changes.forEach(ch => {
    const existing = findWorkoutInfoByDate(ch.workout_date);
    const weekNum = existing ? existing.weekNumber : (ch.week_number || 1);
    
    if (!weekGroups[weekNum]) {
      weekGroups[weekNum] = {
        weekNumber: weekNum,
        items: [],
        beforeKm: 0,
        afterKm: 0
      };
    }

    const beforeDist = existing ? existing.workout.distance_km : 0;
    const afterDist = ch.distance_km !== undefined ? ch.distance_km : beforeDist;

    weekGroups[weekNum].beforeKm += beforeDist;
    weekGroups[weekNum].afterKm += afterDist;
    totalBeforeKm += beforeDist;
    totalAfterKm += afterDist;

    weekGroups[weekNum].items.push({
      change: ch,
      existing: existing
    });
  });

  let groupsHtml = '';
  Object.values(weekGroups).forEach(group => {
    const weekDelta = group.afterKm - group.beforeKm;
    const deltaColor = weekDelta <= 0 ? 'var(--primary)' : 'var(--accent-orange)';
    const deltaSign = weekDelta >= 0 ? '+' : '';

    let itemsHtml = '';
    group.items.forEach(({ change: ch, existing }) => {
      const beforeDist = existing ? `${existing.workout.distance_km} km` : '—';
      const beforeType = existing ? existing.workout.type : 'Rest';

      itemsHtml += `
        <div class="coach-diff-item">
          <div class="coach-diff-date">📅 ${ch.day_of_week} (${ch.workout_date})</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.25rem;">
            <div>
              <div style="font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase;">Current:</div>
              <div class="diff-tag-before">${beforeType} (${beforeDist})</div>
            </div>
            <div>
              <div style="font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase;">Adjusted:</div>
              <div class="diff-tag-after">${ch.workout_type} (${ch.distance_km} km)</div>
            </div>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem;">
            🎯 <strong>Pace:</strong> ${ch.target_pace} • <strong>Effort:</strong> RPE ${ch.rpe || 2}/10
          </div>
          ${ch.description ? `<div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 0.15rem; font-style: italic;">"${ch.description}"</div>` : ''}
          ${ch.strength_prehab ? `<div style="font-size: 0.7rem; color: #f472b6; margin-top: 0.15rem;">💪 <strong>Prehab:</strong> ${ch.strength_prehab}</div>` : ''}
        </div>
      `;
    });

    groupsHtml += `
      <div class="diff-week-group">
        <div class="diff-week-header">
          <span>📅 Week ${group.weekNumber} (${group.items.length} Workout${group.items.length > 1 ? 's' : ''})</span>
          <span class="diff-delta-badge" style="color: ${deltaColor};">
            ${group.beforeKm.toFixed(1)}k ➔ ${group.afterKm.toFixed(1)}k (${deltaSign}${weekDelta.toFixed(1)}k)
          </span>
        </div>
        <div class="diff-week-body">
          ${itemsHtml}
        </div>
      </div>
    `;
  });

  const totalDelta = totalAfterKm - totalBeforeKm;
  const totalDeltaSign = totalDelta >= 0 ? '+' : '';
  const changesEncoded = encodeURIComponent(JSON.stringify(changes));
  const isMultiWorkout = changes.length > 3;

  return `
    <div class="coach-plan-diff-card">
      <div class="coach-diff-header">
        <span>🔄 Proposed Schedule Modifications</span>
        <span style="font-size: 0.7rem; color: var(--text-main); font-weight: 700;">
          Total: ${totalBeforeKm.toFixed(1)}k ➔ ${totalAfterKm.toFixed(1)}k (${totalDeltaSign}${totalDelta.toFixed(1)}k)
        </span>
      </div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">
        ${proposal.summary || 'Adjustments calculated to protect muscles and optimize recovery:'}
      </div>
      <div class="${isMultiWorkout ? 'coach-diff-scrollable' : ''}">
        ${groupsHtml}
      </div>
      <button id="coach-approve-btn-${msgIdx}" class="coach-approve-btn" onclick="applyCoachPlanChanges('${changesEncoded}', 'coach-approve-btn-${msgIdx}')">
        ✅ Approve &amp; Apply ${changes.length} Workout Changes in Cloud
      </button>
    </div>
  `;
}

// Apply Plan Changes to Supabase and Local Dashboard (Single-Day, Full-Week, or Entire-Month Batch Update)
async function applyCoachPlanChanges(changesEncoded, btnId) {
  const btn = document.getElementById(btnId);
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '🔄 Updating Plan in Supabase...';
  }

  try {
    const changes = JSON.parse(decodeURIComponent(changesEncoded));

    for (const ch of changes) {
      // 1. Update in-memory rawWeeksData
      for (const week of rawWeeksData) {
        for (let i = 0; i < week.workouts.length; i++) {
          if (week.workouts[i].date === ch.workout_date) {
            week.workouts[i].type = ch.workout_type || week.workouts[i].type;
            week.workouts[i].distance_km = ch.distance_km !== undefined ? ch.distance_km : week.workouts[i].distance_km;
            week.workouts[i].target_pace = ch.target_pace || week.workouts[i].target_pace;
            week.workouts[i].rpe = ch.rpe !== undefined ? ch.rpe : week.workouts[i].rpe;
            week.workouts[i].description = ch.description || week.workouts[i].description;
            if (ch.strength_prehab) week.workouts[i].strength_prehab = ch.strength_prehab;
          }
        }
      }

      // 2. Update Supabase if connected
      if (supabaseClient) {
        await supabaseClient.from('daily_workouts').update({
          workout_type: ch.workout_type,
          distance_km: ch.distance_km,
          target_pace: ch.target_pace,
          rpe_target: ch.rpe,
          description: ch.description,
          strength_prehab: ch.strength_prehab
        }).eq('workout_date', ch.workout_date);
      }
    }

    // 3. Re-render UI
    renderWeeklyPlan();
    updateProgressMetrics();

    if (btn) {
      btn.classList.add('approved');
      btn.innerHTML = `✅ Successfully Updated ${changes.length} Workouts in Cloud!`;
    }

    coachChatHistory.push({
      role: 'bot',
      content: `🎉 **Plan Overhaul Applied!** I have updated all **${changes.length} workouts** in Supabase and your calendar. Your weekly mileage targets and recovery prescriptions are now active!`,
      timestamp: new Date().toISOString()
    });
    pruneCoachChatHistory();
    renderCoachMessages();

  } catch (err) {
    console.error('Failed to apply plan changes:', err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `❌ Error: ${err.message}. Try Again`;
    }
  }
}

// Check on startup
checkAndResumePendingCoachQuery();

// ==============================================================================
// 🎧 AUDIO COACH & 10% MUSIC DUCKING ENGINE (SIMULATOR & RUNNER)
// ==============================================================================

let webAudioCtx = null;
let musicOscillatorNode = null;
let musicGainNode = null;
let audioSimInterval = null;
let audioSimElapsed = 0;
let isAudioSimActive = false;
let isWebMetronomeActive = false;
let webMetronomeTimer = null;
let lastSpokenWebCue = "Starting speed intervals workout.";

function getWebAudioContext() {
  if (!webAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    webAudioCtx = new AudioContextClass();
  }
  if (webAudioCtx.state === 'suspended') {
    webAudioCtx.resume();
  }
  return webAudioCtx;
}

function openAudioCompanionModal() {
  const modal = document.getElementById('audio-companion-modal');
  if (modal) {
    modal.classList.add('open');
    loadAudioManifestIntoModal();
  }
}

function closeAudioCompanionModal() {
  const modal = document.getElementById('audio-companion-modal');
  if (modal) {
    modal.classList.remove('open');
    stopAudioSimulator();
  }
}

async function loadAudioManifestIntoModal() {
  try {
    const res = await fetch('audio_manifest.json?v=' + Date.now());
    if (res.ok) {
      const manifest = await res.json();
      const typeEl = document.getElementById('audio-modal-workout-type');
      const paceEl = document.getElementById('audio-modal-pace-target');
      const weatherEl = document.getElementById('audio-modal-weather-adv');

      if (typeEl) typeEl.textContent = `${manifest.workoutType} • ${manifest.distanceKm} km`;
      if (paceEl) paceEl.textContent = `🎯 Target Pace: ${manifest.targetPace} (RPE ${manifest.rpeTarget}/10)`;
      if (weatherEl && manifest.openingBriefing) {
        weatherEl.innerHTML = `🌤️ <strong>Weather & Hydration:</strong> ${manifest.openingBriefing.weatherAdvisory}`;
      }
    }
  } catch (e) {
    console.log('Using default audio manifest values.');
  }
}

function onWebWeekRunSelected(dateStr) {
  let selectedWorkout = null;
  if (trainingData && Array.isArray(trainingData.weeks)) {
    for (const w of trainingData.weeks) {
      for (const d of w.workouts) {
        if (d.date === dateStr) {
          selectedWorkout = d;
          break;
        }
      }
      if (selectedWorkout) break;
    }
  }

  if (!selectedWorkout && Array.isArray(rawWeeksData)) {
    for (const w of rawWeeksData) {
      for (const d of w.workouts) {
        if (d.date === dateStr) {
          selectedWorkout = d;
          break;
        }
      }
      if (selectedWorkout) break;
    }
  }

  if (!selectedWorkout) return;

  const typeEl = document.getElementById('audio-modal-workout-type');
  const paceEl = document.getElementById('audio-modal-pace-target');
  const weatherEl = document.getElementById('audio-modal-weather-adv');

  const distText = selectedWorkout.distance_km > 0 ? ` • ${selectedWorkout.distance_km} km` : '';
  if (typeEl) typeEl.textContent = `${selectedWorkout.type}${distText}`;
  if (paceEl) paceEl.textContent = `🎯 Target Pace: ${selectedWorkout.target_pace} (RPE ${selectedWorkout.rpe}/10)`;
  if (weatherEl) {
    const prehab = selectedWorkout.strength_prehab || "Post-run calf flush";
    weatherEl.innerHTML = `📅 <strong>${selectedWorkout.day}, ${dateStr}:</strong> ${selectedWorkout.description} • ${prehab}`;
  }

  // Dynamically update audio timeline track
  const timelineTrack = document.querySelector('#audio-companion-modal .audio-timeline-track');
  if (timelineTrack) {
    const splits = generateWorkoutSplits(selectedWorkout);
    timelineTrack.innerHTML = splits.map((s, idx) => `
      <div class="audio-timeline-node" style="position: relative; margin-bottom: 1rem;">
        <div style="position: absolute; left: -31px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: ${s.color}; box-shadow: 0 0 8px ${s.color};"></div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; font-weight: 700; color: #f8fafc;">${s.km} • ${s.phase}</span>
          <span style="font-size: 0.68rem; color: ${s.color}; font-weight: 700; background: ${s.color}20; padding: 0.1rem 0.4rem; border-radius: 4px;">${s.pace}</span>
        </div>
        <div style="font-size: 0.73rem; color: #94a3b8; margin-top: 0.15rem;">${s.desc}</div>
      </div>
    `).join('');
  }
}

// 1. Play Background Music Simulation (Smooth chords)
function startBackgroundMusic() {
  const ctx = getWebAudioContext();
  if (musicGainNode) return;

  musicGainNode = ctx.createGain();
  musicGainNode.gain.setValueAtTime(0.4, ctx.currentTime);
  musicGainNode.connect(ctx.destination);

  // Create ambient background synth
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc1.type = 'triangle';
  osc2.type = 'sine';
  osc1.frequency.setValueAtTime(220, ctx.currentTime); // A3
  osc2.frequency.setValueAtTime(330, ctx.currentTime); // E4

  osc1.connect(musicGainNode);
  osc2.connect(musicGainNode);
  osc1.start();
  osc2.start();

  musicOscillatorNode = [osc1, osc2];
  updateDuckingUi(100);
}

function stopBackgroundMusic() {
  if (musicOscillatorNode) {
    musicOscillatorNode.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (e) {}
    });
    musicOscillatorNode = null;
  }
  if (musicGainNode) {
    try { musicGainNode.disconnect(); } catch (e) {}
    musicGainNode = null;
  }
  updateDuckingUi(100);
}

// 2. Duck Background Music strictly to 10%
function setMusicVolumeDucking(duckToPercent = 10) {
  const ctx = getWebAudioContext();
  if (!musicGainNode) return;

  const targetGain = duckToPercent === 10 ? 0.04 : 0.4;
  musicGainNode.gain.cancelScheduledValues(ctx.currentTime);
  musicGainNode.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.15); // Fast smooth 150ms drop

  updateDuckingUi(duckToPercent);
}

function updateDuckingUi(percent) {
  const bar = document.getElementById('audio-volume-bar');
  const txt = document.getElementById('audio-volume-text');
  const badge = document.getElementById('audio-duck-badge');

  if (bar) bar.style.width = `${percent}%`;
  if (txt) txt.textContent = `${percent}% Volume`;
  if (badge) {
    if (percent <= 20) {
      badge.textContent = 'DUCKED TO 10% (COACH SPEAKING)';
      badge.style.background = 'rgba(245, 158, 11, 0.25)';
      badge.style.color = '#f59e0b';
      badge.style.borderColor = 'rgba(245, 158, 11, 0.5)';
    } else {
      badge.textContent = 'MUSIC AT 100%';
      badge.style.background = 'rgba(16, 185, 129, 0.2)';
      badge.style.color = '#10b981';
      badge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    }
  }
}

// 3. Play Zero-Latency Oscillator Countdown Beep (880Hz / 1760Hz)
function playOscillatorBeep(freq = 880, durationMs = 120) {
  const ctx = getWebAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.setValueAtTime(0.8, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (durationMs / 1000));

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + (durationMs / 1000));
}

// 4. Web Speech Voice Prompt
function speakWebVoice(text, onComplete) {
  lastSpokenWebCue = text;
  const sub = document.getElementById('audio-live-subtitle');
  if (sub) sub.textContent = `🎙️ "${text}"`;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => { if (onComplete) onComplete(); };
    utterance.onerror = () => { if (onComplete) onComplete(); };
    window.speechSynthesis.speak(utterance);
  } else {
    setTimeout(() => { if (onComplete) onComplete(); }, 2000);
  }
}

// 5. Cadence Metronome (170 BPM Tick)
function toggleWebMetronome() {
  const btn = document.getElementById('btn-web-metronome');
  isWebMetronomeActive = !isWebMetronomeActive;

  if (isWebMetronomeActive) {
    if (btn) {
      btn.textContent = 'ON (170 BPM)';
      btn.style.background = 'rgba(16, 185, 129, 0.2)';
      btn.style.color = '#10b981';
      btn.style.borderColor = '#10b981';
    }
    const intervalMs = (60 / 170) * 1000;
    webMetronomeTimer = setInterval(() => {
      playOscillatorBeep(1200, 30);
    }, intervalMs);
  } else {
    if (btn) {
      btn.textContent = 'OFF';
      btn.style.background = 'transparent';
      btn.style.color = 'inherit';
      btn.style.borderColor = 'rgba(255,255,255,0.2)';
    }
    if (webMetronomeTimer) clearInterval(webMetronomeTimer);
    webMetronomeTimer = null;
  }
}

// 6. Earbud Simulation Actions
function simulateEarbudDoubleTap() {
  const sub = document.getElementById('audio-live-subtitle');
  if (sub) sub.textContent = `🎧 Double Tap -> Replaying: "${lastSpokenWebCue}"`;
  setMusicVolumeDucking(10);
  speakWebVoice(`Replaying: ${lastSpokenWebCue}`, () => {
    setMusicVolumeDucking(100);
  });
}

function simulateEarbudTripleTap() {
  const sub = document.getElementById('audio-live-subtitle');
  if (sub) sub.textContent = `🎧 Triple Tap -> Skipping current interval...`;
  setMusicVolumeDucking(10);
  speakWebVoice(`Skipping to next interval.`, () => {
    setMusicVolumeDucking(100);
  });
}

// 7. Full 60-Second Simulator Engine
function start60SecondAudioSimulator() {
  if (isAudioSimActive) stopAudioSimulator();

  isAudioSimActive = true;
  audioSimElapsed = 0;

  const btnStart = document.getElementById('btn-audio-sim-start');
  const btnStop = document.getElementById('btn-audio-sim-stop');
  const countdownEl = document.getElementById('audio-live-countdown');
  const subEl = document.getElementById('audio-live-subtitle');

  if (btnStart) btnStart.style.display = 'none';
  if (btnStop) btnStop.style.display = 'block';

  // Start background music simulation
  startBackgroundMusic();
  if (subEl) subEl.textContent = '🎵 Background YouTube Music playing at 100% volume...';

  audioSimInterval = setInterval(() => {
    audioSimElapsed++;

    // T = 5s: Pre-Cue for Interval (Duck to 10% 1.5s prior)
    if (audioSimElapsed === 5) {
      setMusicVolumeDucking(10);
      speakWebVoice("Interval 1 of 6: 1 minute hard effort. Target pace 5:45, RPE 8.");
    }

    // T = 12s to 16s: 5-4-3-2-1 Countdown
    if (audioSimElapsed >= 12 && audioSimElapsed <= 16) {
      const count = 17 - audioSimElapsed;
      if (countdownEl) {
        countdownEl.style.display = 'block';
        countdownEl.textContent = count;
      }
      playOscillatorBeep(880, 100);
    }

    // T = 17s: GO! Transition Chime & Unduck
    if (audioSimElapsed === 17) {
      if (countdownEl) {
        countdownEl.textContent = 'GO!';
        setTimeout(() => { countdownEl.style.display = 'none'; }, 1000);
      }
      playOscillatorBeep(1760, 350);
      speakWebVoice("GO! Push to 5:45.", () => {
        setMusicVolumeDucking(100);
      });
    }

    // T = 30s: Fueling Alert
    if (audioSimElapsed === 30) {
      setMusicVolumeDucking(10);
      speakWebVoice("45 minutes elapsed. Take 1 Salt Capsule now with water to protect your calves.", () => {
        setMusicVolumeDucking(100);
      });
    }

    // T = 45s: Rest Pre-Cue
    if (audioSimElapsed === 45) {
      setMusicVolumeDucking(10);
      speakWebVoice("Rest in 5 seconds. 30 seconds easy walk or slow jog.");
    }

    // T = 50s to 54s: Rest Countdown
    if (audioSimElapsed >= 50 && audioSimElapsed <= 54) {
      const count = 55 - audioSimElapsed;
      if (countdownEl) {
        countdownEl.style.display = 'block';
        countdownEl.textContent = count;
      }
      playOscillatorBeep(700, 100);
    }

    // T = 55s: Rest chime & Unduck
    if (audioSimElapsed === 55) {
      if (countdownEl) {
        countdownEl.textContent = 'REST';
        setTimeout(() => { countdownEl.style.display = 'none'; }, 1000);
      }
      playOscillatorBeep(1200, 250);
      speakWebVoice("Catch your breath. RPE 2.", () => {
        setMusicVolumeDucking(100);
      });
    }

    // T = 60s: Complete
    if (audioSimElapsed >= 60) {
      stopAudioSimulator();
      if (subEl) subEl.textContent = "🏆 60-Second Simulator Test Complete! All ducking & countdowns verified.";
    }

  }, 1000);
}

function highlightActiveLyric(lyricId) {
  const container = document.getElementById('audio-lyrics-container');
  const allLines = document.querySelectorAll('.audio-lyric-line');
  allLines.forEach(line => {
    line.style.opacity = '0.4';
    line.style.transform = 'scale(0.98)';
    const text = line.querySelector('.lyric-text');
    if (text) {
      text.style.color = '#94a3b8';
      text.style.textShadow = 'none';
    }
  });

  const active = document.getElementById(lyricId);
  if (active) {
    active.style.opacity = '1';
    active.style.transform = 'scale(1.02)';
    const text = active.querySelector('.lyric-text');
    if (text) {
      text.style.color = '#ffffff';
      text.style.textShadow = '0 0 16px rgba(56, 189, 248, 0.6)';
    }
    if (container) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

function startSunday7kmAudioPreview() {
  if (isAudioSimActive) stopAudioSimulator();

  isAudioSimActive = true;
  audioSimElapsed = 0;

  const btnStart = document.getElementById('btn-audio-sim-start');
  const btnStop = document.getElementById('btn-audio-sim-stop');
  const subEl = document.getElementById('audio-live-subtitle');

  if (btnStart) btnStart.style.display = 'none';
  if (btnStop) btnStop.style.display = 'block';

  startBackgroundMusic();
  highlightActiveLyric('lyric-1');
  if (subEl) subEl.textContent = '🎵 YouTube Music playing at 100% volume... Previewing Sunday 7km Long Run Cues:';

  audioSimInterval = setInterval(() => {
    audioSimElapsed++;

    // T = 2s: Opening Briefing
    if (audioSimElapsed === 2) {
      highlightActiveLyric('lyric-1');
      setMusicVolumeDucking(10);
      speakWebVoice("Welcome to your Sunday Long Run! Today's session is 7 kilometers. Target pace is 7:35 to 7:45 min/km with an RPE of 3. Morning temperature is 20°C with 93% humidity.", () => {
        setMusicVolumeDucking(100);
      });
    }

    // T = 15s: Km 1 Split
    if (audioSimElapsed === 15) {
      highlightActiveLyric('lyric-2');
      setMusicVolumeDucking(10);
      speakWebVoice("Kilometer 1 reached. Gently float into your rhythm. Do not start too fast.", () => {
        setMusicVolumeDucking(100);
      });
    }

    // T = 25s: 45-Min Fueling Alert
    if (audioSimElapsed === 25) {
      highlightActiveLyric('lyric-3');
      setMusicVolumeDucking(10);
      speakWebVoice("45 minutes elapsed. Take 1 Salt Capsule now with 150 ml water to protect your calves from cramping.", () => {
        setMusicVolumeDucking(100);
      });
    }

    // T = 38s: Km 5 Posture & Cadence Check
    if (audioSimElapsed === 38) {
      highlightActiveLyric('lyric-4');
      setMusicVolumeDucking(10);
      speakWebVoice("Kilometer 5 reached. Check your posture, relax your shoulders, and keep your cadence smooth.", () => {
        setMusicVolumeDucking(100);
      });
    }

    // T = 50s: Km 7 Finish Congratulations
    if (audioSimElapsed === 50) {
      highlightActiveLyric('lyric-5');
      setMusicVolumeDucking(10);
      speakWebVoice("Workout complete! Fantastic work on completing today's 7km long run. Take 500 ml electrolyte water and perform your 10-minute calf and quad flush.", () => {
        setMusicVolumeDucking(100);
      });
    }

    // T = 62s: Complete
    if (audioSimElapsed >= 62) {
      stopAudioSimulator();
      if (subEl) subEl.textContent = "🏆 Sunday 7km Long Run Audio Preview Complete! All cues verified.";
    }

  }, 1000);
}

function stopAudioSimulator() {
  isAudioSimActive = false;
  if (audioSimInterval) clearInterval(audioSimInterval);
  audioSimInterval = null;

  stopBackgroundMusic();
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();

  const btnStart = document.getElementById('btn-audio-sim-start');
  const btnStop = document.getElementById('btn-audio-sim-stop');
  const countdownEl = document.getElementById('audio-live-countdown');

  if (btnStart) btnStart.style.display = 'block';
  if (btnStop) btnStop.style.display = 'none';
  if (countdownEl) countdownEl.style.display = 'none';

  // Automatically trigger instant Strava sync upon stopping run
  if (githubToken) {
    showToastNotification('🏁 Run stopped! Automatically triggering Strava cloud sync...', 'success');
    triggerStravaSyncWorkflow(true);
  } else {
    showToastNotification('🏁 Run stopped! Tap "⚡ Sync Strava" in the navbar to sync your Strava activity.', 'info');
  }
}

// ==============================================================================
// GITHUB ACTIONS: INSTANT STRAVA ACTIVITY SYNC ENGINE
// ==============================================================================
let githubToken = localStorage.getItem('tmm_github_pat') || '';

function showToastNotification(message, type = 'info', durationMs = 4000) {
  let container = document.getElementById('tmm-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'tmm-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `tmm-toast ${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';

  toast.innerHTML = `<span>${icon}</span><span style="flex:1;">${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 300);
  }, durationMs);
}

function openGitHubTokenModal() {
  const modal = document.getElementById('github-sync-modal');
  const input = document.getElementById('github-pat-input');
  const fb = document.getElementById('github-sync-feedback');
  if (input) input.value = githubToken;
  if (fb) fb.style.display = 'none';
  if (modal) modal.classList.add('open');
}

function closeGitHubTokenModal() {
  const modal = document.getElementById('github-sync-modal');
  if (modal) modal.classList.remove('open');
}

function disconnectGitHubToken() {
  localStorage.removeItem('tmm_github_pat');
  githubToken = '';
  const fb = document.getElementById('github-sync-feedback');
  if (fb) {
    fb.style.display = 'block';
    fb.style.background = 'rgba(239, 68, 68, 0.15)';
    fb.style.border = '1px solid var(--accent-red)';
    fb.style.color = 'var(--accent-red)';
    fb.innerHTML = '🗑️ GitHub Token removed.';
  }
  showToastNotification('GitHub Token removed.', 'info');
  setTimeout(() => closeGitHubTokenModal(), 1200);
}

async function saveAndTriggerStravaSync() {
  const input = document.getElementById('github-pat-input');
  const fb = document.getElementById('github-sync-feedback');
  const val = (input?.value || '').trim();

  if (!val) {
    if (fb) {
      fb.style.display = 'block';
      fb.style.background = 'rgba(239, 68, 68, 0.15)';
      fb.style.border = '1px solid var(--accent-red)';
      fb.style.color = 'var(--accent-red)';
      fb.innerHTML = '❌ Please enter your GitHub Personal Access Token.';
    }
    return;
  }

  githubToken = val;
  localStorage.setItem('tmm_github_pat', val);
  
  if (fb) {
    fb.style.display = 'block';
    fb.style.background = 'rgba(16, 185, 129, 0.15)';
    fb.style.border = '1px solid var(--primary)';
    fb.style.color = 'var(--primary)';
    fb.innerHTML = '✅ Token saved! Triggering workflow dispatch...';
  }

  setTimeout(() => {
    closeGitHubTokenModal();
    triggerStravaSyncWorkflow(false);
  }, 1000);
}

async function triggerStravaSyncWorkflow(isSilent = false) {
  const btn = document.getElementById('btn-strava-sync');
  const icon = document.getElementById('strava-sync-icon');
  const label = document.getElementById('strava-sync-label');

  if (!githubToken) {
    if (!isSilent) {
      openGitHubTokenModal();
    } else {
      showToastNotification('🏁 Run stopped! Tap "⚡ Sync Strava" in the navbar to connect GitHub token and auto-sync.', 'info');
    }
    return;
  }

  if (icon) icon.textContent = '🔄';
  if (label) label.textContent = 'Triggering...';
  if (btn) btn.disabled = true;

  try {
    const repo = 'vish9731-agentic/TMM2027';
    const workflowFile = 'strava_scraper_sync.yml';

    const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${workflowFile}/dispatches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${githubToken}`,
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({ ref: 'main' })
    });

    if (res.status === 204 || res.ok) {
      if (icon) icon.textContent = '⏳';
      if (label) label.textContent = 'Scraping Strava...';
      showToastNotification('🚀 Triggered "Sync Strava Activities" GitHub Action! Scraping Strava...', 'info', 6000);

      // Poll Supabase or re-fetch after 12s to catch synced run
      setTimeout(() => {
        if (icon) icon.textContent = '⚡';
        if (label) label.textContent = 'Sync Strava';
        if (btn) btn.disabled = false;
        if (supabaseUrl && supabaseAnonKey) initSupabase(supabaseUrl, supabaseAnonKey);
      }, 14000);
    } else {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `HTTP ${res.status}`);
    }
  } catch (err) {
    console.error('Strava sync trigger failed:', err);
    if (icon) icon.textContent = '❌';
    if (label) label.textContent = 'Sync Failed';
    if (btn) btn.disabled = false;
    showToastNotification(`❌ Strava sync trigger failed: ${err.message}. Please check your GitHub Token.`, 'error', 6000);
    setTimeout(() => {
      if (icon) icon.textContent = '⚡';
      if (label) label.textContent = 'Sync Strava';
    }, 4000);
  }
}

function generateDeviceSyncLink() {
  const payload = {
    githubToken: localStorage.getItem('tmm_github_pat') || '',
    geminiKey: localStorage.getItem('tmm_gemini_api_key') || '',
    vegaIcon: localStorage.getItem('tmm_vega_icon_concept') || 'sunset_runner',
    gcalTime: localStorage.getItem('tmm_gcal_run_time') || '06:00'
  };
  const b64 = btoa(encodeURIComponent(JSON.stringify(payload)));
  return `${window.location.origin}${window.location.pathname}?sync_payload=${b64}`;
}

function copyDeviceSyncLink() {
  const link = generateDeviceSyncLink();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(() => {
      showToastNotification('📋 1-Click Phone Sync Link copied to clipboard! Send to your phone via WhatsApp/Message.', 'success', 6000);
    }).catch(() => {
      prompt('Copy this 1-Click Phone Sync Link and open it on your phone:', link);
    });
  } else {
    prompt('Copy this 1-Click Phone Sync Link and open it on your phone:', link);
  }
}

window.openGitHubTokenModal = openGitHubTokenModal;
window.closeGitHubTokenModal = closeGitHubTokenModal;
window.saveAndTriggerStravaSync = saveAndTriggerStravaSync;
window.disconnectGitHubToken = disconnectGitHubToken;
window.triggerStravaSyncWorkflow = triggerStravaSyncWorkflow;
window.showToastNotification = showToastNotification;
window.generateDeviceSyncLink = generateDeviceSyncLink;
window.copyDeviceSyncLink = copyDeviceSyncLink;

