import json

# Read app.js
with open('/Users/altcreative/Downloads/Procam afterthought/app.js', 'r') as f:
    js = f.read()

# Add race course intelligence data to APP_DATA
race_details_json = """
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
        { "name": "Pedder Road #2 (\"The Wall\" Jaslok Hospital)", "dist": "35 – 37 km", "pace": "7:30 – 7:40 min/km", "strategy": "Crucial hill! Power-march if calves feel tight; do not redline heart rate. Take Gel #6 with water." },
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
"""

# Insert raceCourses into APP_DATA
js = js.replace('"strengthRoutines": {', race_details_json + '  "strengthRoutines": {', 1)

# Add currentProcamRace state and selectProcamRace function
procam_functions = """
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
"""

# Insert procam functions and update DOMContentLoaded in app.js
js = js.replace('renderWeeklyPlan();', 'renderWeeklyPlan();\n  renderProcamRaceDetails();', 1)
js += procam_functions

with open('/Users/altcreative/Downloads/Procam afterthought/app.js', 'w') as f:
    f.write(js)

print("Updated app.js with dynamic race selection and multi-race course details")
