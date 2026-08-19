import json

with open('/Users/altcreative/Downloads/Procam afterthought/training_data.json', 'r') as f:
    data = json.load(f)

weeks_json = json.dumps(data['weeks'], indent=2)

with open('/Users/altcreative/Downloads/Procam afterthought/app.js', 'r') as f:
    code = f.read()

# Replace renderWeekJumper
old_jumper = """    if (isPeak) { extraClass = 'peak-btn'; label = 'W18 (32K)'; }
    else if (w.week_number === 8) { extraClass = 'milestone-btn'; label = 'W8 (10K)'; }
    else if (w.week_number === 14) { extraClass = 'milestone-btn'; label = 'W14 (HM)'; }
    else if (w.week_number === 22) { extraClass = 'peak-btn'; label = 'W22 (RACE)'; }
    else if (isDeload) { extraClass = 'milestone-btn'; label = `W${w.week_number} 🔋`; }"""

new_jumper = """    if (w.week_number === 9) { extraClass = 'milestone-btn'; label = 'W9 (VDHM 21K)'; }
    else if (w.week_number === 18) { extraClass = 'peak-btn'; label = 'W18 (KOL 25K)'; }
    else if (w.week_number === 22) { extraClass = 'peak-btn'; label = 'W22 (TMM 42K 🏆)'; }
    else if (w.week_number === 8) { extraClass = 'milestone-btn'; label = 'W8 (10K TT)'; }
    else if (w.week_number === 14) { extraClass = 'milestone-btn'; label = 'W14 (HM Sim)'; }
    else if (w.week_number === 17) { extraClass = 'peak-btn'; label = 'W17 (30K Peak)'; }
    else if (isDeload) { extraClass = 'milestone-btn'; label = `W${w.week_number} 🔋`; }"""

if old_jumper in code:
    code = code.replace(old_jumper, new_jumper, 1)

# Replace badges
old_badges = """  const isDeload = week.is_deload;
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
  }"""

new_badges = """  const isDeload = week.is_deload;
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
  }"""

if old_badges in code:
    code = code.replace(old_badges, new_badges, 1)

# Direct update of generateFallbackWeeks and rawWeeksData
start_idx = code.find('rawWeeksData = [')
end_idx = code.find('// Render Phase Timeline')
if start_idx != -1 and end_idx != -1:
    code = code[:start_idx] + f"rawWeeksData = {weeks_json};\n  }}\n\n" + code[end_idx:]

start_fn = code.find('function generateFallbackWeeks() {')
if start_fn != -1:
    code = code[:start_fn] + f"function generateFallbackWeeks() {{\n  return {weeks_json};\n}}\n"

with open('/Users/altcreative/Downloads/Procam afterthought/app.js', 'w') as f:
    f.write(code)

print("Successfully updated app.js")
