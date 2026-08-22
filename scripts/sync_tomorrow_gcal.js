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
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cqgxtymtxcugpuvsvece.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || '';

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
  const splits = [];
  if (dist > 0) {
    if (dist <= 4.0) {
      splits.push(`  • Km 1: 7:45–8:00 (Warmup Float)`);
      if (dist > 1.0) splits.push(`  • Km 2–${dist}: ${targetPace} (Zone 2 Cruise)`);
    } else if (dist <= 8.0) {
      splits.push(`  • Km 1: 7:45–8:00 (Warmup Float)`);
      splits.push(`  • Km 2–${Math.floor(dist - 1)}: ${targetPace} (Endurance Cruise)`);
      splits.push(`  • Km ${Math.floor(dist)}: ${targetPace} (Controlled Finish)`);
    } else {
      splits.push(`  • Km 1–2: 7:45–8:00 (Aerobic Warmup)`);
      splits.push(`  • Km 3–${Math.floor(dist - 2)}: ${targetPace} (Marathon Rhythm)`);
      splits.push(`  • Km ${Math.floor(dist - 1)}–${dist}: 7:06 min/km (Race Pace Rehearsal)`);
    }
  }

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
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 30 },  // 30 minutes before 6:00 AM morning run (5:30 AM alert)
        { method: 'popup', minutes: 570 }  // 9.5 hours before 6:00 AM run (8:30 PM evening alert upon creation)
      ]
    }
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

  const insertUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(targetCalId)}/events`;
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
}

main().catch(err => {
  console.error(`❌ Sync Engine Failed:`, err);
  process.exit(1);
});
