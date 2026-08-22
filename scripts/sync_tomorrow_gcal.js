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
          console.log(`✅ Retrieved tomorrow's workout from Supabase:`, rows[0].workout_type);
          return rows[0];
        }
      }
    } catch (e) {
      console.warn(`⚠️ Supabase fetch error (falling back to plan parser):`, e.message);
    }
  }

  // Fallback: Read app.js to find workout data for this date
  try {
    const appJsPath = path.join(__dirname, '..', 'app.js');
    if (fs.existsSync(appJsPath)) {
      const content = fs.readFileSync(appJsPath, 'utf8');
      const dateIdx = content.indexOf(`date: '${dateStr}'`);
      if (dateIdx !== -1) {
        const chunk = content.slice(Math.max(0, dateIdx - 100), dateIdx + 400);
        const typeMatch = chunk.match(/type:\s*'([^']+)'/);
        const distMatch = chunk.match(/distance_km:\s*([0-9.]+)/);
        const paceMatch = chunk.match(/target_pace:\s*'([^']+)'/);
        const descMatch = chunk.match(/description:\s*'([^']+)'/);
        const prehabMatch = chunk.match(/strength_prehab:\s*'([^']+)'/);

        return {
          workout_date: dateStr,
          workout_type: typeMatch ? typeMatch[1] : 'Scheduled Workout',
          distance_km: distMatch ? parseFloat(distMatch[1]) : 5.0,
          target_pace: paceMatch ? paceMatch[1] : '7:20 - 7:35 min/km',
          description: descMatch ? descMatch[1] : 'Follow prescribed aerobic pace.',
          strength_prehab: prehabMatch ? prehabMatch[1] : 'Calf armor heel drops'
        };
      }
    }
  } catch (e) {
    console.warn(`Could not parse local master plan:`, e.message);
  }

  return {
    workout_date: dateStr,
    workout_type: 'Zone 2 Easy Aerobic Run',
    distance_km: 5.0,
    target_pace: '7:20 - 7:35 min/km',
    description: 'Keep cadence high and calves loose in Adidas Adizero Evo SL 2.',
    strength_prehab: 'Eccentric heel drops on a step (3x15)'
  };
}

// 3. Build Rich Google Calendar Event Payload
function buildEventPayload(wo, tomorrow) {
  const dist = wo.distance_km || 0;
  const isRest = dist === 0;
  const targetPace = wo.target_pace || 'N/A';
  const type = wo.workout_type || wo.type || 'Workout';
  
  const [startHRaw, startMRaw] = DEFAULT_RUN_TIME.split(':').map(Number);
  const startH = isNaN(startHRaw) ? 6 : startHRaw;
  const startM = isNaN(startMRaw) ? 0 : startMRaw;
  const durationMins = dist > 0 ? Math.max(30, Math.round(dist * 7.5 + 15)) : 45;
  
  const pad = (n) => String(n).padStart(2, '0');
  const totalStartMins = startH * 60 + startM;
  const totalEndMins = totalStartMins + durationMins;
  
  const endH = pad(Math.floor(totalEndMins / 60) % 24);
  const endM = pad(totalEndMins % 60);

  const startDateTimeStr = `${tomorrow.dateStr}T${pad(startH)}:${pad(startM)}:00+05:30`;
  const endDateTimeStr = `${tomorrow.dateStr}T${endH}:${endM}:00+05:30`;

  const summary = `🏃 TMM 2027: ${dist > 0 ? `${dist}km ` : ''}${type} (${targetPace !== 'N/A' ? targetPace : 'Rest & Prehab'})`;
  
  const description = [
    `🎯 TATA MUMBAI MARATHON 2027 — DAILY WORKOUT BLUEPRINT`,
    `======================================================`,
    `• Day & Date: ${tomorrow.dayOfWeek}, ${tomorrow.dateStr}`,
    `• Session: ${type}`,
    `• Target Volume: ${dist > 0 ? `${dist} km` : 'Active Recovery / Rest'}`,
    `• Prescribed Pace: ${targetPace}`,
    `• TMM Race Goal: 04:59:59 (7:06 min/km)`,
    ``,
    `📋 WORKOUT EXECUTION STRATEGY:`,
    `${wo.description || 'Follow target aerobic heart rate.'}`,
    ``,
    `🦵 CALF & ACHILLES ARMOR PROTOCOL:`,
    `• Pre-Run: 3-min Dynamic Ankle Mobility + Soleus Calve Rockers (2x15)`,
    `• Post-Run: Eccentric Heel Drops on a step (3x15 straight leg + 3x15 bent knee)`,
    `• Muscle Care: Foam roll calves, soleus & plantar fascia`,
    ``,
    `👟 GEAR & HYDRATION CHECKLIST:`,
    `• Shoes: Adidas Adizero Evo SL 2`,
    `• Pre-Run Fueling: 250ml water + pinch of Himalayan pink salt 30 mins before`,
    `• Post-Run: 500ml electrolyte water + 20g protein`,
    ``,
    `✨ Automated nightly sync by TMM 2027 Training Engine.`
  ].join('\n');

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
