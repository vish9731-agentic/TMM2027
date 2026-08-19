with open('/Users/altcreative/Downloads/Procam afterthought/app.js', 'r') as f:
    code = f.read()

# Replace state variables
old_state = """// State Management
let currentFilter = 'all';
let currentPhaseFilter = null;
let searchQuery = '';
let completedWorkouts = JSON.parse(localStorage.getItem('tmm_completed_workouts') || '{}');
let rawWeeksData = [];"""

new_state = """// State Management
let currentFilter = 'all';
let currentPhaseFilter = null;
let currentViewMode = 'grid';
let searchQuery = '';
let allCollapsed = false;
let completedWorkouts = JSON.parse(localStorage.getItem('tmm_completed_workouts') || '{}');
let rawWeeksData = [];"""

code = code.replace(old_state, new_state, 1)

# In DOMContentLoaded, add renderWeekJumper
old_dom = """  // Load data from training_data.json or fallback
  await loadTrainingData();
  renderPhases();
  renderWeeklyPlan();
  updateProgressMetrics();"""

new_dom = """  // Load data from training_data.json or fallback
  await loadTrainingData();
  renderPhases();
  renderWeekJumper();
  renderWeeklyPlan();
  updateProgressMetrics();"""

code = code.replace(old_dom, new_dom, 1)

# Replace renderSingleWeek and renderDayCard
old_render_block = """// Render Single Week Card
function renderWeekCard(week) {
  const isDeload = week.is_deload;
  const isPeak = week.week_number === 18;
  const isRaceWeek = week.week_number === 22;
  const isMilestone = [8, 14].includes(week.week_number);

  let badgeHtml = '';
  if (isRaceWeek) {
    badgeHtml += `<span class="badge badge-peak">🏁 RACE WEEK</span>`;
  } else if (isPeak) {
    badgeHtml += `<span class="badge badge-peak">🔥 PEAK LONG RUN (32 KM)</span>`;
  } else if (isMilestone) {
    badgeHtml += `<span class="badge badge-milestone">${week.week_number === 8 ? '⏱️ 10K TIME TRIAL' : '🏅 HM SIMULATION'}</span>`;
  } else if (isDeload) {
    badgeHtml += `<span class="badge badge-deload">🔋 DELOAD RECOVERY</span>`;
  }

  return `
    <div class="week-card" id="week-card-${week.week_number}">
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
        <div class="days-grid">
          ${week.workouts.map(wo => renderDayCard(week.week_number, wo)).join('')}
        </div>
      </div>
    </div>
  `;
}

// Render Single Day Workout Card
function renderDayCard(weekNum, wo) {
  const workoutKey = `${weekNum}_${wo.day}_${wo.date}`;
  const isDone = !!completedWorkouts[workoutKey];

  let tagClass = 'tag-aerobic';
  const typeLower = (wo.type || '').toLowerCase();
  if (typeLower.includes('recovery') || typeLower.includes('shakeout')) tagClass = 'tag-recovery';
  else if (typeLower.includes('speed') || typeLower.includes('tempo') || typeLower.includes('interval') || typeLower.includes('hill')) tagClass = 'tag-speed';
  else if (typeLower.includes('long')) tagClass = 'tag-long';
  else if (typeLower.includes('strength') || typeLower.includes('mobility')) tagClass = 'tag-strength';
  else if (typeLower.includes('rest')) tagClass = 'tag-rest';
  else if (typeLower.includes('race') || typeLower.includes('trial') || typeLower.includes('simulation')) tagClass = 'tag-race';

  const rpeVal = wo.rpe || 2;
  const rpeBars = Array.from({ length: 10 }, (_, i) => 
    `<div class="rpe-pill ${i < rpeVal ? 'fill' : ''}"></div>`
  ).join('');

  return `
    <div class="day-card ${isDone ? 'completed' : ''}" id="day-${workoutKey}">
      <div class="day-card-header">
        <div>
          <div class="day-name">${wo.day}</div>
          <div class="day-date">${wo.date.slice(5)}</div>
        </div>
        <input type="checkbox" class="checkbox-custom" title="Mark workout completed" ${isDone ? 'checked' : ''} onchange="toggleWorkoutDone('${workoutKey}', ${wo.distance_km}, this.checked)">
      </div>
      
      <div>
        <span class="workout-tag ${tagClass}">${wo.type}</span>
        <div class="day-distance">${wo.distance_km > 0 ? `${wo.distance_km} <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-muted);">km</span>` : '<span style="font-size: 0.9rem; color: var(--text-dim);">No Running</span>'}</div>
        <div class="day-pace">${wo.target_pace !== 'N/A' ? wo.target_pace : 'Rest / Strength Focus'}</div>
        <div class="day-rpe-bar" title="Target RPE: ${rpeVal}/10">
          <span>RPE ${rpeVal}</span>
          ${rpeBars}
        </div>
      </div>

      <div class="day-desc">${wo.description}</div>

      <div class="day-footer">
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
      </div>
    </div>
  `;
}"""

new_render_block = """// Render Week Jumper Bar
function renderWeekJumper() {
  const container = document.getElementById('week-jumper-bar');
  if (!container) return;

  container.innerHTML = rawWeeksData.map(w => {
    const isDeload = w.is_deload;
    const isPeak = w.week_number === 18;
    const isMilestone = [8, 14, 22].includes(w.week_number);
    
    let extraClass = '';
    let label = `W${w.week_number}`;
    if (isPeak) { extraClass = 'peak-btn'; label = 'W18 (32K)'; }
    else if (w.week_number === 8) { extraClass = 'milestone-btn'; label = 'W8 (10K)'; }
    else if (w.week_number === 14) { extraClass = 'milestone-btn'; label = 'W14 (HM)'; }
    else if (w.week_number === 22) { extraClass = 'peak-btn'; label = 'W22 (RACE)'; }
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
  document.getElementById('btn-view-grid').classList.toggle('active', mode === 'grid');
  document.getElementById('btn-view-table').classList.toggle('active', mode === 'table');
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

// Render Single Week Card
function renderWeekCard(week) {
  const isDeload = week.is_deload;
  const isPeak = week.week_number === 18;
  const isRaceWeek = week.week_number === 22;
  const isMilestone = [8, 14].includes(week.week_number);

  let badgeHtml = '';
  if (isRaceWeek) {
    badgeHtml += `<span class="badge badge-peak">🏁 RACE WEEK</span>`;
  } else if (isPeak) {
    badgeHtml += `<span class="badge badge-peak">🔥 PEAK LONG RUN (32 KM)</span>`;
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

// Render Grid View
function renderWeekGridView(week) {
  return `
    <div class="days-grid">
      ${week.workouts.map(wo => renderDayCard(week.week_number, wo)).join('')}
    </div>
  `;
}

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
            const isDone = !!completedWorkouts[workoutKey];
            const tagClass = getTagClass(wo.type);
            return `
              <tr class="${isDone ? 'completed-row' : ''}">
                <td>
                  <input type="checkbox" class="checkbox-custom" ${isDone ? 'checked' : ''} onchange="toggleWorkoutDone('${workoutKey}', ${wo.distance_km}, this.checked)">
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
                  <div style="margin-top: 0.35rem; display: flex; gap: 0.5rem;">
                    ${wo.strength_prehab && wo.strength_prehab !== 'N/A' ? `<button class="action-pill-btn" onclick="showStrengthModal('${escapeHtml(wo.strength_prehab)}')">💪 Prehab</button>` : ''}
                    ${wo.fueling && wo.fueling !== 'N/A' ? `<button class="action-pill-btn" onclick="showFuelingModal('${escapeHtml(wo.fueling)}')">⚡ Fueling</button>` : ''}
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
  if (typeLower.includes('race') || typeLower.includes('trial') || typeLower.includes('simulation')) return 'tag-race';
  return 'tag-aerobic';
}

// Render Single Day Workout Card (Grid Mode)
function renderDayCard(weekNum, wo) {
  const workoutKey = `${weekNum}_${wo.day}_${wo.date}`;
  const isDone = !!completedWorkouts[workoutKey];
  const tagClass = getTagClass(wo.type);

  const rpeVal = wo.rpe || 2;
  const rpeBars = Array.from({ length: 10 }, (_, i) => 
    `<div class="rpe-pill ${i < rpeVal ? 'fill' : ''}"></div>`
  ).join('');

  return `
    <div class="day-card ${isDone ? 'completed' : ''}" id="day-${workoutKey}">
      <div class="day-card-header">
        <div>
          <div class="day-name">${wo.day}</div>
          <div class="day-date">${wo.date.slice(5)}</div>
        </div>
        <input type="checkbox" class="checkbox-custom" title="Mark workout completed" ${isDone ? 'checked' : ''} onchange="toggleWorkoutDone('${workoutKey}', ${wo.distance_km}, this.checked)">
      </div>
      
      <div>
        <span class="workout-tag ${tagClass}">${wo.type}</span>
        <div class="day-distance">${wo.distance_km > 0 ? `${wo.distance_km} <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">km</span>` : '<span style="font-size: 0.9rem; color: var(--text-dim);">No Running</span>'}</div>
        <div class="day-pace">${wo.target_pace !== 'N/A' ? wo.target_pace : 'Rest / Strength Day'}</div>
        <div class="day-rpe-bar" title="Target Effort: ${rpeVal}/10">
          <span style="font-weight: 600;">RPE ${rpeVal}</span>
          <div class="rpe-pills-wrap">${rpeBars}</div>
        </div>
      </div>

      <div class="day-desc">${wo.description}</div>

      <div class="day-footer">
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
      </div>
    </div>
  `;
}"""

code = code.replace(old_render_block, new_render_block, 1)

with open('/Users/altcreative/Downloads/Procam afterthought/app.js', 'w') as f:
    f.write(code)

print("Updated app.js with dual view mode, week jumper, and responsive RPE wrap")
