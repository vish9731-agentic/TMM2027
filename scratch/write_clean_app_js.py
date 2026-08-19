import json

with open('/Users/altcreative/Downloads/Procam afterthought/training_data.json', 'r') as f:
    data = json.load(f)

weeks_json = json.dumps(data['weeks'], indent=2)

js_content = f"""// ==============================================================================
// 22-WEEK MARATHON TRAINING APP LOGIC & EMBEDDED DATA
// ==============================================================================

const APP_DATA = {{
  "athlete": {{
    "name": "Marathon Runner",
    "target_race": "Tata Mumbai Marathon 2027",
    "race_date": "2027-01-17T05:00:00",
    "start_date": "2026-08-17",
    "goal_time": "04:59:59",
    "goal_pace": "7:06 min/km",
    "current_10k_time": "01:00:00",
    "baseline_easy_pace": "7:15 min/km",
    "shoe": "Adidas Adizero Evo SL 2"
  }},
  "phases": [
    {{ "id": 1, "name": "Phase 1: Prep & Foundation", "weeks": "Weeks 1–4", "dates": "Aug 17 – Sep 13", "description": "Establish 4-day weekly habit, build calf armor (eccentric drops) to avoid cramps, core stability for lower back." }},
    {{ "id": 2, "name": "Phase 2: Aerobic Base Building", "weeks": "Weeks 5–12", "dates": "Sep 14 – Nov 08", "description": "Expand mitochondrial density, break through 18-20k calf cramp barrier, VDHM 2026 milestone, 10K time trial." }},
    {{ "id": 3, "name": "Phase 3: Peak & Race Specificity", "weeks": "Weeks 13–19", "dates": "Nov 09 – Dec 27", "description": "Peak volume tolerance, 30 km Long Run, Kolkata 25K MP simulation, HM simulation race." }},
    {{ "id": 4, "name": "Phase 4: Taper & Race Execution", "weeks": "Weeks 20–22", "dates": "Dec 28 – Jan 17", "description": "Glycogen restoration, cellular repair, short sharp MP strides, race logistics and execution at Tata Mumbai Marathon." }}
  ],
  "strengthRoutines": {{
    "lower": {{
      "title": "Tuesday: Lower Body & Calf Armor (30–35 Mins)",
      "focus": "Calf Cramp Prevention & Achilles Resilience",
      "exercises": [
        {{ "name": "Single-Leg Eccentric Heel Drops (on a step)", "sets": "3 x 15 reps / leg", "desc": "Lower down slowly over 3 seconds; rise on both feet. Directly bolsters Achilles and gastrocnemius." }},
        {{ "name": "Seated Bent-Knee Calf Raises", "sets": "3 x 15 reps", "desc": "Sit with weight/backpack on knees. Isolates soleus muscle—the #1 protector against late-race calf cramps." }},
        {{ "name": "Tibialis Anterior Wall Raises", "sets": "3 x 20 reps", "desc": "Lean back against wall, lift toes high. Eliminates shin splints and anterior fatigue." }},
        {{ "name": "Bulgarian Split Squats / Reverse Lunges", "sets": "3 x 8-10 reps / leg", "desc": "Knee tracking and quad stability without spinal compression." }},
        {{ "name": "Single-Leg Glute Bridges", "sets": "3 x 12 reps / leg", "desc": "Hold top position for 2 seconds. Fires glutes to take stress off the lower back." }}
      ]
    }},
    "core": {{
      "title": "Thursday: Posterior Chain & Lumbar Core (30 Mins)",
      "focus": "Lower Back Pain Elimination & Dynamic Posture",
      "exercises": [
        {{ "name": "Dumbbell / Resistance Band RDLs", "sets": "3 x 10 reps", "desc": "Hinge at hips with flat back. Strengthens hamstrings and lumbar spinal erectors." }},
        {{ "name": "Bird-Dogs with 3-Second Hold", "sets": "3 x 10 reps / side", "desc": "Deep transverse abdominis and multifidus stabilization." }},
        {{ "name": "Side Planks (Quadratus Lumborum)", "sets": "3 x 35-45s / side", "desc": "Stabilizes pelvis and prevents side-to-side hip drop when tired." }},
        {{ "name": "Deadbugs", "sets": "3 x 12 alternating reps", "desc": "Anti-extension core strength to stop the lower back from hyperextending during long runs." }},
        {{ "name": "Supermans / Prone Cobras", "sets": "3 x 12 reps", "desc": "Upper and lower back muscular endurance for late marathon posture." }}
      ]
    }},
    "mobility": {{
      "title": "Monday Post-Run: 15-Minute Hip & Calf Flush",
      "focus": "Active Recovery & Soft Tissue Restoration",
      "exercises": [
        {{ "name": "Foam Roll Calves, Quads & ITB", "sets": "30 sec / muscle group", "desc": "Gentle sweeping strokes to flush metabolic byproducts." }},
        {{ "name": "Pigeon Pose / Figure-4 Stretch", "sets": "60 sec / side", "desc": "Opens piriformis and deep lateral glutes." }},
        {{ "name": "Couch Stretch (Hip Flexors & Quads)", "sets": "60 sec / side", "desc": "Unlocks tight hip flexors that pull on the lumbar spine." }},
        {{ "name": "Cat-Cow Breathing Drill", "sets": "10 slow breath cycles", "desc": "Restores thoracic and lumbar segmental mobility." }}
      ]
    }}
  }}
}};

// State Management
let currentFilter = 'all';
let currentPhaseFilter = null;
let currentViewMode = 'grid';
let searchQuery = '';
let allCollapsed = false;
let completedWorkouts = JSON.parse(localStorage.getItem('tmm_completed_workouts') || '{{}}');
let rawWeeksData = {weeks_json};

// Initialize App on DOM Load
document.addEventListener('DOMContentLoaded', () => {{
  setupCountdown();
  setupNavigation();
  setupFilters();
  setupSearch();
  setupPaceCalculator();
  renderPhases();
  renderWeekJumper();
  renderWeeklyPlan();
  updateProgressMetrics();
}});

// Countdown to Jan 17, 2027
function setupCountdown() {{
  const targetDate = new Date('2027-01-17T05:00:00+05:30').getTime();

  function update() {{
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {{
      const d = document.getElementById('cd-days');
      const h = document.getElementById('cd-hours');
      const m = document.getElementById('cd-mins');
      if (d) d.textContent = '00';
      if (h) h.textContent = '00';
      if (m) m.textContent = '00';
      return;
    }}

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const d = document.getElementById('cd-days');
    const h = document.getElementById('cd-hours');
    const m = document.getElementById('cd-mins');
    if (d) d.textContent = String(days).padStart(2, '0');
    if (h) h.textContent = String(hours).padStart(2, '0');
    if (m) m.textContent = String(mins).padStart(2, '0');
  }}

  update();
  setInterval(update, 60000);
}}

// Navigation Tabs
function setupNavigation() {{
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  tabBtns.forEach(btn => {{
    btn.addEventListener('click', () => {{
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-content-panel').forEach(panel => {{
        panel.classList.remove('active');
      }});

      const activePanel = document.getElementById(`tab-${{targetTab}}`);
      if (activePanel) activePanel.classList.add('active');
    }});
  }});
}}

// Filter Controls
function setupFilters() {{
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {{
    btn.addEventListener('click', () => {{
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderWeeklyPlan();
    }});
  }});
}}

// Search Input
function setupSearch() {{
  const searchInput = document.getElementById('search-workouts');
  if (searchInput) {{
    searchInput.addEventListener('input', (e) => {{
      searchQuery = e.target.value.toLowerCase().trim();
      renderWeeklyPlan();
    }});
  }}
}}

// Render Phase Timeline
function renderPhases() {{
  const container = document.getElementById('phase-timeline-container');
  if (!container) return;

  container.innerHTML = APP_DATA.phases.map(p => `
    <div class="phase-card ${{currentPhaseFilter === p.id ? 'active' : ''}}" onclick="togglePhaseFilter(${{p.id}})">
      <div class="phase-header">
        <span class="phase-tag">Phase ${{p.id}}</span>
        <span class="phase-weeks">${{p.weeks}}</span>
      </div>
      <div class="phase-name">${{p.name.split(': ')[1] || p.name}}</div>
      <div class="phase-desc">${{p.description}}</div>
    </div>
  `).join('');
}}

function togglePhaseFilter(phaseId) {{
  if (currentPhaseFilter === phaseId) {{
    currentPhaseFilter = null;
  }} else {{
    currentPhaseFilter = phaseId;
  }}
  renderPhases();
  renderWeeklyPlan();
}}

// Render Week Jumper Bar
function renderWeekJumper() {{
  const container = document.getElementById('week-jumper-bar');
  if (!container) return;

  container.innerHTML = rawWeeksData.map(w => {{
    const isDeload = w.is_deload;
    let extraClass = '';
    let label = `W${{w.week_number}}`;
    
    if (w.week_number === 9) {{ extraClass = 'milestone-btn'; label = 'W9 (VDHM 21K 🇮🇳)'; }}
    else if (w.week_number === 17) {{ extraClass = 'peak-btn'; label = 'W17 (30K Peak)'; }}
    else if (w.week_number === 18) {{ extraClass = 'peak-btn'; label = 'W18 (KOL 25K 🏃)'; }}
    else if (w.week_number === 22) {{ extraClass = 'peak-btn'; label = 'W22 (TMM 42K 🏆)'; }}
    else if (w.week_number === 8) {{ extraClass = 'milestone-btn'; label = 'W8 (10K TT)'; }}
    else if (w.week_number === 14) {{ extraClass = 'milestone-btn'; label = 'W14 (HM Sim)'; }}
    else if (isDeload) {{ extraClass = 'milestone-btn'; label = `W${{w.week_number}} 🔋`; }}

    return `<button class="week-jump-btn ${{extraClass}}" onclick="scrollToWeek(${{w.week_number}})">${{label}}</button>`;
  }}).join('');
}}

function scrollToWeek(weekNum) {{
  const card = document.getElementById(`week-card-${{weekNum}}`);
  if (card) {{
    if (card.classList.contains('collapsed')) card.classList.remove('collapsed');
    card.scrollIntoView({{ behavior: 'smooth', block: 'center' }});
    card.style.borderColor = 'var(--primary)';
    card.style.boxShadow = '0 0 24px var(--primary-glow)';
    setTimeout(() => {{
      card.style.borderColor = '';
      card.style.boxShadow = '';
    }}, 2000);
  }}
}}

// View Mode Switching
function setViewMode(mode) {{
  currentViewMode = mode;
  const btnGrid = document.getElementById('btn-view-grid');
  const btnTable = document.getElementById('btn-view-table');
  if (btnGrid) btnGrid.classList.toggle('active', mode === 'grid');
  if (btnTable) btnTable.classList.toggle('active', mode === 'table');
  renderWeeklyPlan();
}}

function toggleAllWeeks() {{
  allCollapsed = !allCollapsed;
  document.querySelectorAll('.week-card').forEach(card => {{
    card.classList.toggle('collapsed', allCollapsed);
  }});
  const label = document.getElementById('expand-toggle-label');
  if (label) label.textContent = allCollapsed ? '📁 Expand All' : '📂 Collapse All';
}}

// Render Weekly Plan
function renderWeeklyPlan() {{
  const container = document.getElementById('weeks-container');
  if (!container) return;

  let filteredWeeks = rawWeeksData;

  if (currentPhaseFilter !== null) {{
    const startW = currentPhaseFilter === 1 ? 1 : currentPhaseFilter === 2 ? 5 : currentPhaseFilter === 3 ? 13 : 20;
    const endW = currentPhaseFilter === 1 ? 4 : currentPhaseFilter === 2 ? 12 : currentPhaseFilter === 3 ? 19 : 22;
    filteredWeeks = filteredWeeks.filter(w => w.week_number >= startW && w.week_number <= endW);
  }}

  if (currentFilter === 'deload') {{
    filteredWeeks = filteredWeeks.filter(w => w.is_deload);
  }} else if (currentFilter === 'procam') {{
    filteredWeeks = filteredWeeks.filter(w => [9, 18, 22].includes(w.week_number));
  }} else if (currentFilter === 'milestone') {{
    filteredWeeks = filteredWeeks.filter(w => [8, 9, 14, 17, 18, 22].includes(w.week_number));
  }}

  if (searchQuery) {{
    filteredWeeks = filteredWeeks.filter(w => {{
      const matchFocus = w.focus && w.focus.toLowerCase().includes(searchQuery);
      const matchWorkouts = w.workouts.some(wo => 
        (wo.description && wo.description.toLowerCase().includes(searchQuery)) ||
        (wo.type && wo.type.toLowerCase().includes(searchQuery)) ||
        (wo.target_pace && wo.target_pace.toLowerCase().includes(searchQuery))
      );
      return matchFocus || matchWorkouts;
    }});
  }}

  if (filteredWeeks.length === 0) {{
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
        <p style="color: var(--text-muted); font-size: 1.1rem;">No workouts match your current filter or search criteria.</p>
        <button class="filter-btn active" style="margin-top: 1rem;" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }}

  container.innerHTML = filteredWeeks.map(week => renderWeekCard(week)).join('');
}}

function resetFilters() {{
  currentFilter = 'all';
  currentPhaseFilter = null;
  searchQuery = '';
  const searchInput = document.getElementById('search-workouts');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-btn').forEach(b => {{
    b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
  }});
  renderPhases();
  renderWeeklyPlan();
}}

// Render Single Week Card
function renderWeekCard(week) {{
  const isDeload = week.is_deload;
  const isVdhm = week.week_number === 9;
  const isKolkata = week.week_number === 18;
  const isTmm = week.week_number === 22;
  const is30kPeak = week.week_number === 17;
  const isMilestone = [8, 14].includes(week.week_number);

  let badgeHtml = '';
  if (isTmm) {{
    badgeHtml += `<span class="badge badge-peak">🏆 PROCAM SLAM #3: TMM FULL MARATHON</span>`;
  }} else if (isKolkata) {{
    badgeHtml += `<span class="badge badge-peak">🏃 PROCAM SLAM #2: TSW KOLKATA 25K</span>`;
  }} else if (isVdhm) {{
    badgeHtml += `<span class="badge badge-milestone">🇮🇳 PROCAM SLAM #1: VDHM (21.1 KM)</span>`;
  }} else if (is30kPeak) {{
    badgeHtml += `<span class="badge badge-peak">🔥 30 KM PEAK DISTANCE</span>`;
  }} else if (isMilestone) {{
    badgeHtml += `<span class="badge badge-milestone">${{week.week_number === 8 ? '⏱️ 10K TIME TRIAL' : '🏅 HM SIMULATION'}}</span>`;
  }} else if (isDeload) {{
    badgeHtml += `<span class="badge badge-deload">🔋 DELOAD RECOVERY</span>`;
  }}

  const contentHtml = currentViewMode === 'table' ? renderWeekTableView(week) : renderWeekGridView(week);

  return `
    <div class="week-card ${{allCollapsed ? 'collapsed' : ''}}" id="week-card-${{week.week_number}}">
      <div class="week-header" onclick="toggleWeekCollapse(${{week.week_number}})">
        <div class="week-title-area">
          <div class="week-num-badge">W${{week.week_number}}</div>
          <div class="week-info">
            <h3>Week ${{week.week_number}} <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">• ${{week.phase}}</span></h3>
            <span class="week-dates">${{week.start_date}} to ${{week.end_date}}</span>
          </div>
        </div>
        <div class="week-badges">
          <span class="badge badge-distance">${{week.total_planned_km}} KM TOTAL</span>
          ${{badgeHtml}}
          <span class="collapse-icon">▼</span>
        </div>
      </div>
      <div class="week-body">
        <div class="week-focus-text"><strong>Focus:</strong> ${{week.focus}}</div>
        ${{contentHtml}}
      </div>
    </div>
  `;
}}

// Render Grid View (7-Column Calendar Row)
function renderWeekGridView(week) {{
  return `
    <div class="days-grid">
      ${{week.workouts.map(wo => renderDayCard(week.week_number, wo)).join('')}}
    </div>
  `;
}}

// Render Agenda Table View
function renderWeekTableView(week) {{
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
          ${{week.workouts.map(wo => {{
            const workoutKey = `${{week.week_number}}_${{wo.day}}_${{wo.date}}`;
            const isDone = !!completedWorkouts[workoutKey];
            const tagClass = getTagClass(wo.type);
            return `
              <tr class="${{isDone ? 'completed-row' : ''}}">
                <td>
                  <input type="checkbox" class="checkbox-custom" ${{isDone ? 'checked' : ''}} onchange="toggleWorkoutDone('${{workoutKey}}', ${{wo.distance_km}}, this.checked)">
                </td>
                <td>
                  <strong style="color: var(--text-main); font-size: 0.85rem;">${{wo.day}}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-dim);">${{wo.date}}</div>
                </td>
                <td>
                  <span class="workout-tag ${{tagClass}}" style="margin: 0;">${{wo.type}}</span>
                </td>
                <td>
                  <strong style="font-size: 1.1rem; color: var(--text-main); font-family: 'Outfit';">${{wo.distance_km > 0 ? `${{wo.distance_km}} km` : '—'}}</strong>
                </td>
                <td>
                  <span class="mono" style="font-size: 0.8rem; color: var(--text-muted);">${{wo.target_pace}}</span>
                </td>
                <td>
                  <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-orange);">RPE ${{wo.rpe}}/10</span>
                </td>
                <td>
                  <div style="font-size: 0.85rem; line-height: 1.4; color: var(--text-muted);">${{wo.description}}</div>
                  <div style="margin-top: 0.35rem; display: flex; gap: 0.5rem;">
                    ${{wo.strength_prehab && wo.strength_prehab !== 'N/A' ? `<button class="action-pill-btn" onclick="showStrengthModal('${{escapeHtml(wo.strength_prehab)}}')">💪 Prehab</button>` : ''}}
                    ${{wo.fueling && wo.fueling !== 'N/A' ? `<button class="action-pill-btn" onclick="showFuelingModal('${{escapeHtml(wo.fueling)}}')">⚡ Fueling</button>` : ''}}
                  </div>
                </td>
              </tr>
            `;
          }}).join('')}}
        </tbody>
      </table>
    </div>
  `;
}}

function getTagClass(type) {{
  const typeLower = (type || '').toLowerCase();
  if (typeLower.includes('recovery') || typeLower.includes('shakeout')) return 'tag-recovery';
  if (typeLower.includes('speed') || typeLower.includes('tempo') || typeLower.includes('interval') || typeLower.includes('hill')) return 'tag-speed';
  if (typeLower.includes('long')) return 'tag-long';
  if (typeLower.includes('strength') || typeLower.includes('mobility')) return 'tag-strength';
  if (typeLower.includes('rest')) return 'tag-rest';
  if (typeLower.includes('race') || typeLower.includes('trial') || typeLower.includes('simulation') || typeLower.includes('vdhm') || typeLower.includes('kolkata')) return 'tag-race';
  return 'tag-aerobic';
}}

// Render Single Day Workout Card (Grid Mode)
function renderDayCard(weekNum, wo) {{
  const workoutKey = `${{weekNum}}_${{wo.day}}_${{wo.date}}`;
  const isDone = !!completedWorkouts[workoutKey];
  const tagClass = getTagClass(wo.type);

  const rpeVal = wo.rpe || 2;
  const rpeBars = Array.from({{ length: 10 }}, (_, i) => 
    `<div class="rpe-pill ${{i < rpeVal ? 'fill' : ''}}"></div>`
  ).join('');

  return `
    <div class="day-card ${{isDone ? 'completed' : ''}}" id="day-${{workoutKey}}">
      <div class="day-card-header">
        <div>
          <div class="day-name">${{wo.day}}</div>
          <div class="day-date">${{wo.date.slice(5)}}</div>
        </div>
        <input type="checkbox" class="checkbox-custom" title="Mark workout completed" ${{isDone ? 'checked' : ''}} onchange="toggleWorkoutDone('${{workoutKey}}', ${{wo.distance_km}}, this.checked)">
      </div>
      
      <div>
        <span class="workout-tag ${{tagClass}}">${{wo.type}}</span>
        <div class="day-distance">${{wo.distance_km > 0 ? `${{wo.distance_km}} <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">km</span>` : '<span style="font-size: 0.9rem; color: var(--text-dim);">No Running</span>'}}</div>
        <div class="day-pace">${{wo.target_pace !== 'N/A' ? wo.target_pace : 'Rest / Strength Day'}}</div>
        <div class="day-rpe-bar" title="Target Effort: ${{rpeVal}}/10">
          <span style="font-weight: 600;">RPE ${{rpeVal}}</span>
          <div class="rpe-pills-wrap">${{rpeBars}}</div>
        </div>
      </div>

      <div class="day-desc">${{wo.description}}</div>

      <div class="day-footer">
        ${{wo.strength_prehab && wo.strength_prehab !== 'N/A' ? `
          <button class="action-pill-btn" onclick="showStrengthModal('${{escapeHtml(wo.strength_prehab)}}')">
            💪 Prehab
          </button>
        ` : ''}}
        ${{wo.fueling && wo.fueling !== 'N/A' ? `
          <button class="action-pill-btn" onclick="showFuelingModal('${{escapeHtml(wo.fueling)}}')">
            ⚡ Fueling
          </button>
        ` : ''}}
      </div>
    </div>
  `;
}}

function escapeHtml(text) {{
  if (!text) return '';
  return text.replace(/'/g, "\\\\'").replace(/"/g, '&quot;');
}}

// Toggle Collapse
function toggleWeekCollapse(weekNum) {{
  const card = document.getElementById(`week-card-${{weekNum}}`);
  if (card) {{
    card.classList.toggle('collapsed');
  }}
}}

// Workout Completion State
function toggleWorkoutDone(key, distKm, isChecked) {{
  if (isChecked) {{
    completedWorkouts[key] = {{ done: true, dist: distKm, completedAt: new Date().toISOString() }};
  }} else {{
    delete completedWorkouts[key];
  }}
  localStorage.setItem('tmm_completed_workouts', JSON.stringify(completedWorkouts));
  
  const el = document.getElementById(`day-${{key}}`);
  if (el) el.classList.toggle('completed', isChecked);

  updateProgressMetrics();
}}

// Update Hero Progress Bars
function updateProgressMetrics() {{
  const totalPlannedKm = 880.2;
  let completedKm = 0;
  let completedRunsCount = 0;

  Object.values(completedWorkouts).forEach(item => {{
    if (item && item.done) {{
      completedKm += (item.dist || 0);
      if (item.dist > 0) completedRunsCount++;
    }}
  }});

  const percent = Math.min(100, Math.round((completedKm / totalPlannedKm) * 100));

  const compEl = document.getElementById('metric-completed-km');
  if (compEl) compEl.textContent = `${{completedKm.toFixed(1)}} km`;

  const progFill = document.getElementById('metric-progress-fill');
  if (progFill) progFill.style.width = `${{percent}}%`;

  const progPct = document.getElementById('metric-progress-pct');
  if (progPct) progPct.textContent = `${{percent}}% completed (${{completedRunsCount}} runs done)`;
}}

// Modals
function showStrengthModal(details) {{
  const modal = document.getElementById('global-modal');
  const body = document.getElementById('modal-body-content');
  const title = document.getElementById('modal-title');
  if (!modal || !body || !title) return;
  
  title.innerHTML = '💪 Strength & Prehab Protocol';
  body.innerHTML = `
    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1rem;">
      <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.6;">${{details}}</p>
    </div>
    <div style="margin-top: 1.5rem;">
      <h4 style="color: var(--primary); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem;">Calf & Achilles Tip:</h4>
      <p style="color: var(--text-muted); font-size: 0.8rem;">Perform eccentric heel drops with a 3-second descent. Do not bounce. This builds the muscle fiber resilience necessary to cross the 18 km cramp threshold.</p>
    </div>
  `;
  modal.classList.add('open');
}}

function showFuelingModal(details) {{
  const modal = document.getElementById('global-modal');
  const body = document.getElementById('modal-body-content');
  const title = document.getElementById('modal-title');
  if (!modal || !body || !title) return;
  
  title.innerHTML = '⚡ Hydration & Electrolyte Strategy';
  body.innerHTML = `
    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1rem;">
      <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.6;">${{details}}</p>
    </div>
    <div style="margin-top: 1.5rem;">
      <h4 style="color: var(--accent-orange); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem;">Anti-Cramp Sodium Protocol:</h4>
      <p style="color: var(--text-muted); font-size: 0.8rem;">Take your salt capsule with plain water 15–20 minutes <em>before</em> your historical cramping point (km 15–16). Drink 150ml water sips every 15 minutes.</p>
    </div>
  `;
  modal.classList.add('open');
}}

function closeModal() {{
  const modal = document.getElementById('global-modal');
  if (modal) modal.classList.remove('open');
}}

// Interactive Pace Calculator
function setupPaceCalculator() {{
  const hrsInput = document.getElementById('calc-hrs');
  const minsInput = document.getElementById('calc-mins');
  const resultPace = document.getElementById('calc-result-pace');
  const split10k = document.getElementById('calc-split-10k');
  const splitHm = document.getElementById('calc-split-hm');

  function calculate() {{
    if (!hrsInput || !minsInput || !resultPace) return;
    const h = parseInt(hrsInput.value) || 0;
    const m = parseInt(minsInput.value) || 0;
    const totalSecs = (h * 3600) + (m * 60);
    const paceSecsPerKm = totalSecs / 42.195;

    const paceMins = Math.floor(paceSecsPerKm / 60);
    const paceSecs = Math.round(paceSecsPerKm % 60);
    resultPace.textContent = `${{paceMins}}:${{String(paceSecs).padStart(2, '0')}} /km`;

    if (split10k) {{
      const sec10k = paceSecsPerKm * 10;
      const m10 = Math.floor(sec10k / 60);
      const s10 = Math.round(sec10k % 60);
      split10k.textContent = `${{m10}}:${{String(s10).padStart(2, '0')}}`;
    }}

    if (splitHm) {{
      const secHm = paceSecsPerKm * 21.0975;
      const hHm = Math.floor(secHm / 3600);
      const mHm = Math.floor((secHm % 3600) / 60);
      splitHm.textContent = `${{hHm}}h ${{mHm}}m`;
    }}
  }}

  if (hrsInput && minsInput) {{
    hrsInput.addEventListener('input', calculate);
    minsInput.addEventListener('input', calculate);
    calculate();
  }}
}}

// Export Supabase SQL Download
function exportSupabaseSQL() {{
  const link = document.createElement('a');
  link.href = 'supabase_schema.sql';
  link.download = 'supabase_schema.sql';
  link.click();
}}

function exportTrainingDataJSON() {{
  const link = document.createElement('a');
  link.href = 'training_data.json';
  link.download = 'training_data.json';
  link.click();
}}
"""

with open('/Users/altcreative/Downloads/Procam afterthought/app.js', 'w') as f:
    f.write(js_content)

print("Regenerated complete, bulletproof app.js")
