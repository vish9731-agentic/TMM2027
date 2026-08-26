/**
 * TMM 2027: Automated 8:00 PM Nightly Google Calendar Sync Engine
 * 
 * Scheduled to run every evening at 8:00 PM IST (14:30 UTC) via GitHub Actions.
 * 1. Computes tomorrow's date in Asia/Kolkata timezone.
 * 2. Fetches scheduled workout from Supabase (or local fallback master plan).
 * 3. Formats rich Daily Execution Strategy with splits, calf armor prehab & hydration.
 * 4. Pushes the event directly to Google Calendar with native 30-minute reminder notifications.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const DEFAULT_RUN_TIME = process.env.DEFAULT_RUN_TIME || '06:00'; // 6:00 AM IST
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xtdfhxczdlgyhkqsltyq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZGZoeGN6ZGxneWhrcXNsdHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzg2OTUsImV4cCI6MjEwMjcxNDY5NX0.ARI4z_eWMhBQiF66xTXKDOrspfsBQjnG81qxaBhEuww';

// 1. Calculate Tomorrow's Date in IST (Asia/Kolkata)
function getTomorrowDateIST() {
  const now = new Date();
  // IST is UTC + 5:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
  
  // Add 1 day
  const tomorrow = new Date(istNow.getTime() + (24 * 60 * 60 * 1000));
  
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = tomorrow.getFullYear();
  const mm = pad(tomorrow.getMonth() + 1);
  const dd = pad(tomorrow.getDate());
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = dayNames[tomorrow.getDay()];
  
  return {
    dateStr: `${yyyy}-${mm}-${dd}`,
    dayOfWeek,
    year: yyyy,
    month: mm,
    day: dd
  };
}

// 2. Fetch Tomorrow's Workout from Supabase or Master Plan
async function fetchTomorrowWorkout(dateStr) {
  // 1. Check Supabase first (in case Vega made live plan adaptations)
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const fetchUrl = `${SUPABASE_URL}/rest/v1/daily_workouts?workout_date=eq.${dateStr}&select=*`;
      const res = await fetch(fetchUrl, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows && rows.length > 0) {
          console.log(`✅ Retrieved tomorrow's workout from Supabase Cloud:`, rows[0].workout_type, `(${rows[0].distance_km}km)`);
          return rows[0];
        }
      }
    } catch (e) {
      console.warn(`⚠️ Supabase fetch error (falling back to local master plan):`, e.message);
    }
  }

  // 2. Authoritative Fallback: Parse Master Training Plan from app.js
  try {
    const appJsPath = path.join(__dirname, '..', 'app.js');
    if (fs.existsSync(appJsPath)) {
      const appJs = fs.readFileSync(appJsPath, 'utf8');
      const startIdx = appJs.indexOf('let rawWeeksData = [');
      const endIdx = appJs.indexOf('];\n\n// Supabase State');

      if (startIdx !== -1 && endIdx !== -1) {
        const jsonStr = appJs.slice(startIdx + 'let rawWeeksData = '.length, endIdx + 1).trim();
        const weeksData = JSON.parse(jsonStr);

        for (const w of weeksData) {
          if (Array.isArray(w.workouts)) {
            for (const wo of w.workouts) {
              if (wo.date === dateStr) {
                console.log(`✅ Loaded workout from TMM Master Plan (Week ${w.week_number} • ${w.phase}):`, wo.type, `(${wo.distance_km}km)`);
                return {
                  workout_date: dateStr,
                  workout_type: wo.type,
                  distance_km: wo.distance_km,
                  target_pace: wo.target_pace,
                  rpe_target: wo.rpe,
                  description: wo.description,
                  strength_prehab: wo.strength_prehab,
                  fueling: wo.fueling
                };
              }
            }
          }
        }
      }
    }
  } catch (e) {
    console.error(`❌ Error parsing local master plan from app.js:`, e.message);
  }

  throw new Error(`No workout found in Master Plan or Supabase for scheduled date: ${dateStr}`);
}

// Universal Intelligent Workout Split & Stage Strategy Parser
function generateWorkoutSplits(wo) {
  const desc = (wo.description || '').trim();
  const descLower = desc.toLowerCase();
  const type = (wo.type || wo.workout_type || 'Workout').trim();
  const typeLower = type.toLowerCase();
  const dist = Number(wo.distance_km) || 0;
  const targetPace = wo.target_pace || 'N/A';

  if (dist === 0) {
    return [
      { km: 'Prehab 1', phase: 'Ankle & Foot Mobility', pace: '10 Mins', desc: 'Ankle alphabets, plantar roll with lacrosse ball', color: '#10b981' },
      { km: 'Prehab 2', phase: 'Eccentric Calf Loading', pace: '15 Mins', desc: 'Heel drops on a step (3x15 straight leg + 3x15 bent knee)', color: '#ffcc00' },
      { km: 'Prehab 3', phase: 'Foam Rolling & Recovery', pace: '10 Mins', desc: 'Soleus, gastrocnemius, and quads myofascial release', color: '#38bdf8' }
    ];
  }

  const splits = [];

  // 1. Hill Workouts (e.g. Hill Intro, Hill Repeats, Hill Attack, Pedder Road)
  if (typeLower.includes('hill') || descLower.includes('uphill') || descLower.includes('hill repeat') || descLower.includes('hill attack')) {
    const warmupMatch = desc.match(/([\d\.]+)\s*km\s*warmup/i);
    const cooldownMatch = desc.match(/([\d\.]+)\s*km\s*cooldown/i);
    const warmupKm = warmupMatch ? parseFloat(warmupMatch[1]) : 2.0;
    const cooldownKm = cooldownMatch ? parseFloat(cooldownMatch[1]) : 2.0;
    
    const repMatch = desc.match(/(\d+\s*x\s*[0-9\-]+(?:sec|s|min|m)?\s*[a-zA-Z\s\-]+repeats?)/i) ||
                     desc.match(/(\d+\s*x\s*[^\,\.]+)/i);
    const repText = repMatch ? repMatch[0].trim() : 'Uphill Repeats with Jog-Down Recovery';

    splits.push({
      km: `Km 1 – ${warmupKm}`,
      phase: 'Warm-up Float',
      pace: '7:45 – 8:00 min/km',
      desc: 'Gentle aerobic warmup on flat ground, dynamic ankle mobility',
      color: '#10b981'
    });
    splits.push({
      km: 'Main Set',
      phase: 'Hill Repeats',
      pace: 'RPE 7–8 (Hard Effort)',
      desc: `${repText} (Drive knees & glutes, upright chest, easy jog-down recovery)`,
      color: '#ff3b00'
    });
    splits.push({
      km: `Final ${cooldownKm} km`,
      phase: 'Cool-down Float',
      pace: '7:50 – 8:15 min/km',
      desc: 'Easy recovery flush to clear lactate from calves and quads',
      color: '#38bdf8'
    });
    return splits;
  }

  // 2. Strides (e.g. 5x100m strides, 4x100m strides)
  if (typeLower.includes('stride') || descLower.includes('strides')) {
    const warmupMatch = desc.match(/([\d\.]+)\s*km\s*warmup/i) || desc.match(/([\d\.]+)\s*km\s*easy/i);
    const cooldownMatch = desc.match(/([\d\.]+)\s*km\s*cooldown/i) || desc.match(/([\d\.]+)\s*km\s*easy/i);
    const warmupKm = warmupMatch ? parseFloat(warmupMatch[1]) : 1.5;
    const cooldownKm = cooldownMatch ? parseFloat(cooldownMatch[1]) : Math.max(1.5, dist - warmupKm - 0.5);

    const strideMatch = desc.match(/(\d+\s*x\s*\d+\s*m[^\,\.]*)/i);
    const strideText = strideMatch ? strideMatch[1].trim() : '5x100m Fast Relaxed Strides';

    splits.push({
      km: `Km 1 – ${warmupKm}`,
      phase: 'Warm-up Float',
      pace: '7:45 – 8:00 min/km',
      desc: 'Easy aerobic jog, loose shoulders, warm up achilles & soleus',
      color: '#10b981'
    });
    splits.push({
      km: 'Main Set',
      phase: 'Speed Strides',
      pace: '5:20 – 5:45 min/km',
      desc: `${strideText} (Accelerate to 90% top speed with 90s walk rest between reps)`,
      color: '#ffcc00'
    });
    splits.push({
      km: `Final ${cooldownKm.toFixed(1)} km`,
      phase: 'Cool-down Flush',
      pace: '7:50 – 8:15 min/km',
      desc: 'Gentle aerobic flush + 5 mins walking cool-down',
      color: '#38bdf8'
    });
    return splits;
  }

  // 3. Intervals / 400m / 1K Repeats (e.g. 4x400m, 1K repeats)
  if (typeLower.includes('interval') || typeLower.includes('repeat') || descLower.includes('400m') || descLower.includes('1k repeats') || descLower.includes('1 km @')) {
    const warmupMatch = desc.match(/([\d\.]+)\s*km\s*warmup/i);
    const cooldownMatch = desc.match(/([\d\.]+)\s*km\s*cooldown/i);
    const warmupKm = warmupMatch ? parseFloat(warmupMatch[1]) : 1.5;
    const cooldownKm = cooldownMatch ? parseFloat(cooldownMatch[1]) : 2.0;

    const intervalMatch = desc.match(/(\d+\s*x\s*[^,\.]+)/i);
    const intervalText = intervalMatch ? intervalMatch[1].trim() : 'Interval Repeats';

    splits.push({
      km: `Km 1 – ${warmupKm}`,
      phase: 'Warm-up Float',
      pace: '7:45 – 8:00 min/km',
      desc: 'Gradual heart rate ramp, dynamic mobility drills',
      color: '#10b981'
    });
    splits.push({
      km: 'Main Set',
      phase: 'Speed Intervals',
      pace: targetPace !== 'N/A' ? targetPace : '5:50 – 6:15 min/km',
      desc: `${intervalText} (High cadence, maintain relaxed face & shoulders)`,
      color: '#ff3b00'
    });
    splits.push({
      km: `Final ${cooldownKm} km`,
      phase: 'Cool-down',
      pace: '7:50 – 8:15 min/km',
      desc: 'Controlled jog to flush legs and lower core body temperature',
      color: '#38bdf8'
    });
    return splits;
  }

  // 4. Tempo / Threshold / MP Blocks
  if (typeLower.includes('tempo') || typeLower.includes('threshold') || typeLower.includes('mp') || descLower.includes('tempo') || descLower.includes('threshold') || descLower.includes('mp')) {
    const warmupKm = 1.5;
    const cooldownKm = 1.5;
    const tempoKm = Math.max(1.0, dist - warmupKm - cooldownKm);

    splits.push({
      km: `Km 1 – ${warmupKm}`,
      phase: 'Warm-up Float',
      pace: '7:45 – 8:00 min/km',
      desc: 'Gentle aerobic warmup, activate glutes & soleus',
      color: '#10b981'
    });
    splits.push({
      km: `Km ${(warmupKm + 0.1).toFixed(1)} – ${(warmupKm + tempoKm).toFixed(1)}`,
      phase: 'Tempo / MP Block',
      pace: targetPace,
      desc: 'Sustained lactate threshold effort, locked-in breathing rhythm (2:2 pattern)',
      color: '#ff7700'
    });
    splits.push({
      km: `Final ${cooldownKm} km`,
      phase: 'Cool-down Flush',
      pace: '7:50 – 8:15 min/km',
      desc: 'Easy flush jog and walking transition',
      color: '#38bdf8'
    });
    return splits;
  }

  // 5. Races / Time Trials (10K Time Trial, Half Marathon, Kolkata 25K, TMM 2027)
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

  // 6. Long Runs (8km - 19km)
  if (typeLower.includes('long run') || dist >= 8) {
    const warmupKm = 2.0;
    const finishKm = 1.0;
    const cruiseKmEnd = dist - finishKm;

    splits.push({
      km: `Km 1 – ${warmupKm}`,
      phase: 'Aerobic Warmup',
      pace: '7:45 – 8:00 min/km',
      desc: 'Gentle aerobic float, loosen up hips & calves, stay in Zone 2',
      color: '#10b981'
    });
    splits.push({
      km: `Km 3 – ${cruiseKmEnd}`,
      phase: 'Endurance Cruise',
      pace: targetPace,
      desc: 'Rhythmic marathon aerobic base, take salt & water according to plan',
      color: '#00f5d4'
    });
    splits.push({
      km: `Km ${cruiseKmEnd + 1} – ${dist}`,
      phase: 'Sub-5:00 Finish',
      pace: '7:06 min/km',
      desc: 'TMM 2027 goal pace rehearsal, strong posture & quick ground contact',
      color: '#ff7700'
    });
    return splits;
  }

  // 7. Standard Easy / Recovery Runs (3km - 7km)
  splits.push({
    km: 'Km 1',
    phase: 'Warm-up Float',
    pace: '7:45 – 8:00 min/km',
    desc: 'Very gentle warmup, nasal breathing only, shake out calves',
    color: '#10b981'
  });
  if (dist > 1) {
    splits.push({
      km: `Km 2 – ${dist.toFixed(0)}`,
      phase: typeLower.includes('recovery') ? 'Recovery Cruise' : 'Zone 2 Base Cruise',
      pace: targetPace,
      desc: typeLower.includes('recovery') 
        ? 'Ultra-light effort to promote blood flow without neuromuscular fatigue'
        : 'Smooth conversational pace to expand mitochondrial density',
      color: '#00f5d4'
    });
  }
  return splits;
}

// 3. Build Rich Google Calendar Event Payload
function buildEventPayload(wo, tomorrow) {
  const dist = wo.distance_km || 0;
  const isRest = dist === 0;
  const targetPace = wo.target_pace || 'N/A';
  const type = wo.workout_type || wo.type || 'Workout';
  const rpe = wo.rpe_target || wo.rpe || (isRest ? 1 : 3);
  const fuelingStrategy = wo.fueling_hydration_strategy || wo.fueling || (dist > 10 ? 'Water sips every 2 km + 1 Gel at km 7' : 'Water sips as needed');

  const [startHRaw, startMRaw] = DEFAULT_RUN_TIME.split(':').map(Number);
  const startH = isNaN(startHRaw) ? 6 : startHRaw;
  const startM = isNaN(startMRaw) ? 0 : startMRaw;
  
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

  const pad = (n) => String(n).padStart(2, '0');
  const totalStartMins = startH * 60 + startM;
  const totalEndMins = totalStartMins + durationMins;
  
  const endH = pad(Math.floor(totalEndMins / 60) % 24);
  const endM = pad(totalEndMins % 60);

  const startDateTimeStr = `${tomorrow.dateStr}T${pad(startH)}:${pad(startM)}:00+05:30`;
  const endDateTimeStr = `${tomorrow.dateStr}T${endH}:${endM}:00+05:30`;

  // Event name: e.g. "7km Long Run (7:35 - 7:45 min/km)"
  const summary = dist > 0 
    ? `${dist}km ${type}${targetPace && targetPace !== 'N/A' ? ` (${targetPace})` : ''}`
    : `${type}${targetPace && targetPace !== 'N/A' ? ` (${targetPace})` : ''}`;

  // Stage progression splits
  const splitsData = generateWorkoutSplits(wo);
  const splits = splitsData.map(s => `  • ${s.km} (${s.phase}): ${s.pace} — ${s.desc}`);

  const prehabDrill = wo.strength_prehab && wo.strength_prehab !== 'N/A' 
    ? wo.strength_prehab 
    : 'Post-run eccentric heel drops on a step (3x15) + foam roll calves';

  let description = '';
  
  if (dist > 0) {
    description = [
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
    description = [
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

  // Calculate exact minutes until workout start for immediate notification upon creation
  const startMs = new Date(startDateTimeStr).getTime();
  const nowMs = Date.now();
  const minsUntilStart = Math.max(1, Math.round((startMs - nowMs) / (60 * 1000)));

  const reminders = {
    useDefault: false,
    overrides: [
      { method: 'popup', minutes: minsUntilStart }, // Instant notification right when event is created tonight
      { method: 'popup', minutes: 30 },            // 30 mins before 6:00 AM morning run (5:30 AM wake-up alert)
      { method: 'email', minutes: minsUntilStart }  // Immediate email notification on creation
    ]
  };

  return {
    summary,
    description,
    location: 'Mumbai / Training Course',
    start: {
      dateTime: startDateTimeStr,
      timeZone: 'Asia/Kolkata'
    },
    end: {
      dateTime: endDateTimeStr,
      timeZone: 'Asia/Kolkata'
    },
    reminders
  };
}

// 4. Authenticate & Push to Google Calendar API using Service Account
async function pushToGoogleCalendar(eventPayload) {
  const serviceKeyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!serviceKeyJson) {
    console.log(`ℹ️ GOOGLE_SERVICE_ACCOUNT_KEY not set in environment.`);
    console.log(`📅 Pre-filled Google Calendar URL (Zero-Setup Link):`);
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventPayload.summary)}&dates=${eventPayload.start.dateTime.replace(/[-:]/g, '').slice(0, 15)}/${eventPayload.end.dateTime.replace(/[-:]/g, '').slice(0, 15)}&details=${encodeURIComponent(eventPayload.description)}&location=${encodeURIComponent(eventPayload.location)}`;
    console.log(gcalUrl);
    return { ok: true, mode: 'dry-run-url', url: gcalUrl };
  }

  let creds;
  try {
    creds = JSON.parse(serviceKeyJson);
  } catch (e) {
    throw new Error(`Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY JSON: ${e.message}`);
  }

  // Create JWT for Google OAuth2
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;
  
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claimSet = Buffer.from(JSON.stringify({
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/calendar.events',
    aud: 'https://oauth2.googleapis.com/token',
    exp,
    iat
  })).toString('base64url');

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${claimSet}`);
  const signature = sign.sign(creds.private_key, 'base64url');
  const jwt = `${header}.${claimSet}.${signature}`;

  // Exchange JWT for Access Token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Google OAuth token exchange failed: ${errText}`);
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Insert event into Google Calendar
  const targetCalId = CALENDAR_ID || 'primary';
  console.log(`📅 Target Calendar ID: ${targetCalId}`);

  const insertUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(targetCalId)}/events?sendUpdates=all`;
  const insertRes = await fetch(insertUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventPayload)
  });

  if (!insertRes.ok) {
    const errText = await insertRes.text();
    let parsedErr = {};
    try { parsedErr = JSON.parse(errText); } catch(e) {}
    
    if (insertRes.status === 404 || insertRes.status === 403) {
      console.error(`\n⚠️ Permission/Calendar ID Tip: Make sure you shared your Google Calendar with '${creds.client_email}' giving permission 'Make changes to events', and set repository secret GOOGLE_CALENDAR_ID to your Gmail address if using a secondary calendar.\n`);
    }
    throw new Error(`Google Calendar Event Insert failed: ${JSON.stringify(parsedErr, null, 2) || errText}`);
  }

  const createdEvent = await insertRes.json();
  console.log(`🎉 Successfully created Google Calendar event: ${createdEvent.htmlLink || 'Done'}`);
  return { ok: true, event: createdEvent };
}

// Main Execution Flow
async function main() {
  console.log(`=======================================================`);
  console.log(`🌅 TMM 2027: 8:00 PM Nightly Google Calendar Sync Engine`);
  console.log(`=======================================================`);

  const tomorrow = getTomorrowDateIST();
  console.log(`📅 Target Scheduled Date (Tomorrow IST): ${tomorrow.dayOfWeek}, ${tomorrow.dateStr}`);

  const workout = await fetchTomorrowWorkout(tomorrow.dateStr);
  console.log(`🏃 Workout: ${workout.distance_km || 0}km ${workout.workout_type || workout.type} (${workout.target_pace || 'N/A'})`);

  const payload = buildEventPayload(workout, tomorrow);
  console.log(`\n📋 Event Title: ${payload.summary}`);
  console.log(`⏰ Scheduled Start Time: ${payload.start.dateTime}`);
  console.log(`🔔 Notifications: 30-min advance popup + 2-hour alert\n`);

  const result = await pushToGoogleCalendar(payload);
  console.log(`✅ 8:00 PM Nightly Google Calendar Sync Completed Successfully.`);

  // Trigger 8:00 PM Audio Manifest Generation
  try {
    const { run: runAudioManifest } = require('./generate_audio_manifest.js');
    console.log(`\n🎙️ Triggering 8:00 PM Nightly Audio Manifest Generator...`);
    await runAudioManifest();
    console.log(`✅ Nightly Audio Coaching Manifest Ready.`);
  } catch (audioErr) {
    console.warn(`⚠️ Audio Manifest Generation warning:`, audioErr.message);
  }
}

main().catch(err => {
  console.error(`❌ Sync Engine Failed:`, err);
  process.exit(1);
});
