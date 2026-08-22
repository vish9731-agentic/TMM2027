/**
 * TMM 2027: Automated 8:00 PM Nightly Audio Manifest & Fueling Generator
 * 
 * Runs every evening at 8:00 PM IST alongside the Google Calendar sync engine.
 * 1. Fetches tomorrow's workout from Supabase (or local fallback master plan).
 * 2. Fetches real-time morning weather forecast (temperature & humidity) for Bangalore / Mumbai.
 * 3. Parses workout type, distance, intervals (warmup, repeats, rest, cooldown).
 * 4. Injects Compulsory Anti-Cramp Fueling alerts (Salt capsules, Gels, Hydration).
 * 5. Injects Cadence guidance (165–175 SPM metronome) & Course simulation strategy.
 * 6. Generates high-precision audio cue timeline with 1.5s ducking markers.
 * 7. Outputs `audio_manifest.json` ready for instant caching on the runner's phone.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_RUN_TIME = process.env.DEFAULT_RUN_TIME || '06:00';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cqgxtymtxcugpuvsvece.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || '';
const OUTPUT_FILE = path.join(__dirname, '..', 'audio_manifest.json');

// 1. Calculate Tomorrow's Date in IST (Asia/Kolkata)
function getTomorrowDateIST() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
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
          console.log(`✅ [Audio Gen] Retrieved tomorrow's workout from Supabase:`, rows[0].workout_type);
          return {
            workout_date: dateStr,
            workout_type: rows[0].workout_type || rows[0].type,
            distance_km: parseFloat(rows[0].distance_km || 0),
            target_pace: rows[0].target_pace || '7:35 - 7:45 min/km',
            description: rows[0].description || 'Follow prescribed aerobic pace.',
            strength_prehab: rows[0].strength_prehab || 'Calf armor heel drops',
            rpe_target: parseFloat(rows[0].rpe_target || rows[0].rpe || 3),
            fueling_hydration_strategy: rows[0].fueling_hydration_strategy || rows[0].fueling
          };
        }
      }
    } catch (e) {
      console.warn(`⚠️ [Audio Gen] Supabase fetch error (falling back to plan parser):`, e.message);
    }
  }

  // Primary Local Source: training_data.json
  try {
    const trainingDataPath = path.join(__dirname, '..', 'training_data.json');
    if (fs.existsSync(trainingDataPath)) {
      const raw = JSON.parse(fs.readFileSync(trainingDataPath, 'utf8'));
      const weeks = raw.training_plan?.weeks || raw.weeks || [];
      for (const w of weeks) {
        for (const d of (w.days || [])) {
          if (d.date === dateStr) {
            console.log(`✅ [Audio Gen] Loaded from training_data.json for ${dateStr}: ${d.distance_km}km ${d.type}`);
            return {
              workout_date: dateStr,
              workout_type: d.type,
              distance_km: parseFloat(d.distance_km || 0),
              target_pace: d.target_pace || '7:35 - 7:45 min/km',
              description: d.description || 'Week 1 long run.',
              strength_prehab: d.strength_prehab || 'Post-run calf flush',
              rpe_target: parseFloat(d.rpe || 3),
              fueling_hydration_strategy: d.fueling
            };
          }
        }
      }
    }
  } catch (e) {
    console.warn(`⚠️ Could not parse training_data.json:`, e.message);
  }

  // Fallback: Read app.js
  try {
    const appJsPath = path.join(__dirname, '..', 'app.js');
    if (fs.existsSync(appJsPath)) {
      const content = fs.readFileSync(appJsPath, 'utf8');
      const dateMatch = content.match(new RegExp(`"date":\\s*"${dateStr}"[\\s\\S]*?"type":\\s*"([^"]+)"[\\s\\S]*?"distance_km":\\s*([0-9.]+)[\\s\\S]*?"target_pace":\\s*"([^"]+)"[\\s\\S]*?"rpe":\\s*([0-9.]+)[\\s\\S]*?"description":\\s*"([^"]+)"`));
      if (dateMatch) {
        return {
          workout_date: dateStr,
          workout_type: dateMatch[1],
          distance_km: parseFloat(dateMatch[2]),
          target_pace: dateMatch[3],
          rpe_target: parseFloat(dateMatch[4]),
          description: dateMatch[5],
          strength_prehab: 'Post-run calf flush'
        };
      }
    }
  } catch (e) {
    console.warn(`⚠️ Could not parse app.js:`, e.message);
  }

  throw new Error(`No workout found in training database for date: ${dateStr}`);
}

// 3. Fetch Tomorrow Morning Weather for Bangalore (or Mumbai)
async function fetchTomorrowWeather(lat = 12.9716, lon = 77.5946) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature&forecast_days=2&timezone=Asia%2FKolkata`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      // Find 6:00 AM index for tomorrow
      const tomorrowDate = getTomorrowDateIST().dateStr;
      const targetIso = `${tomorrowDate}T06:00`;
      const idx = data.hourly.time.findIndex(t => t.startsWith(targetIso));
      if (idx !== -1) {
        const temp = Math.round(data.hourly.temperature_2m[idx]);
        const humidity = Math.round(data.hourly.relative_humidity_2m[idx]);
        const feelsLike = Math.round(data.hourly.apparent_temperature[idx]);
        return {
          temp,
          humidity,
          feelsLike,
          advisory: humidity > 75 
            ? `Morning temperature is ${temp}°C with ${humidity}% humidity. High sweat rate expected—take your scheduled salt capsules on time.`
            : `Morning temperature is ${temp}°C with ${humidity}% humidity. Great conditions for a steady run.`
        };
      }
    }
  } catch (e) {
    console.warn(`⚠️ Weather API lookup skipped:`, e.message);
  }

  return {
    temp: 22,
    humidity: 70,
    feelsLike: 23,
    advisory: `Morning conditions: 22°C and 70% humidity. Stay hydrated and stick to target pace.`
  };
}

// 4. Parse Intervals from Workout Description or Type
function parseIntervalStructure(wo) {
  const desc = (wo.description || '').toLowerCase();
  const type = (wo.workout_type || '').toLowerCase();
  const dist = wo.distance_km || 0;

  const isInterval = type.includes('interval') || desc.includes('x (') || desc.includes('repeats') || desc.includes('min hard') || desc.includes('strides');
  const isTempo = type.includes('tempo') || type.includes('threshold') || desc.includes('tempo');
  const isLongRun = dist >= 14 || type.includes('long run');

  // Check for regex like: "6 x (1 min hard / 30s rest)" or "5 x (30s strides / 45s rest)"
  const intervalMatch = desc.match(/(\d+)\s*x\s*\(\s*(\d+)\s*(min|m|sec|s)\s*(?:hard|fast|effort)?\s*\/\s*(\d+)\s*(min|m|sec|s)\s*(?:rest|easy|jog)?\s*\)/i);
  
  if (intervalMatch) {
    const reps = parseInt(intervalMatch[1], 10);
    const workVal = parseInt(intervalMatch[2], 10);
    const workUnit = intervalMatch[3].toLowerCase();
    const restVal = parseInt(intervalMatch[4], 10);
    const restUnit = intervalMatch[5].toLowerCase();

    const workSeconds = (workUnit.startsWith('min') || workUnit === 'm') ? workVal * 60 : workVal;
    const restSeconds = (restUnit.startsWith('min') || restUnit === 'm') ? restVal * 60 : restVal;

    return {
      type: 'INTERVAL',
      reps,
      workSeconds,
      restSeconds,
      warmupSeconds: 600, // 10 mins default warmup
      cooldownSeconds: 600, // 10 mins default cooldown
      workPace: '5:45 - 6:00 min/km',
      workRpe: 8,
      restPace: 'Walking / Slow Jog',
      restRpe: 2,
      targetCadence: 172
    };
  }

  // Check for strides e.g. "4x30s strides" or "5 strides"
  if (desc.includes('stride')) {
    return {
      type: 'BASE_PLUS_STRIDES',
      baseDistanceKm: Math.max(1, dist - 1.0),
      strideReps: 5,
      strideWorkSeconds: 30,
      strideRestSeconds: 45,
      targetCadence: 175
    };
  }

  if (isTempo) {
    return {
      type: 'TEMPO',
      warmupKm: 2.0,
      tempoKm: Math.max(2.0, dist - 3.0),
      cooldownKm: 1.0,
      tempoPace: wo.target_pace || '6:15 - 6:35 min/km',
      targetCadence: 170
    };
  }

  return {
    type: isLongRun ? 'LONG_RUN' : 'STEADY_AEROBIC',
    targetDistanceKm: dist,
    targetPace: wo.target_pace || '7:20 - 7:35 min/km',
    rpe: wo.rpe_target || 3,
    targetCadence: 168
  };
}

// 5. Generate Compulsory Fueling Events
function generateFuelingSchedule(distKm, estDurationMins) {
  const fuelingCues = [];

  // Compulsory Salt & Water Schedule (Calf Cramp Armor)
  // At 45 mins: Salt capsule #1
  // At 90 mins: Gel #2 + Salt
  // At 105 mins: Salt capsule #2 (Pre-cramp defense)
  // At 125 mins: Gel #3

  if (distKm >= 6 || estDurationMins >= 40) {
    fuelingCues.push({
      id: 'fuel_45m',
      type: 'FUELING',
      triggerType: 'TIME',
      triggerSeconds: 45 * 60,
      triggerDistanceKm: 6.0,
      title: '💧 Fueling & Electrolyte Alert (45 Min Mark)',
      text: '45 minutes elapsed. Take 1 Salt Capsule now with 150 ml water to protect your calves from cramping.',
      duckMusicSeconds: 1.5,
      audioClip: 'fuel_salt_45m.mp3'
    });
  }

  if (distKm >= 12 || estDurationMins >= 80) {
    fuelingCues.push({
      id: 'fuel_90m',
      type: 'FUELING',
      triggerType: 'TIME',
      triggerSeconds: 90 * 60,
      triggerDistanceKm: 12.0,
      title: '⚡ Energy Gel #2 Alert (90 Min Mark)',
      text: '90 minutes completed. Take Gel number 2 with water. Keep your cadence high.',
      duckMusicSeconds: 1.5,
      audioClip: 'fuel_gel_90m.mp3'
    });
  }

  if (distKm >= 15 || estDurationMins >= 100) {
    fuelingCues.push({
      id: 'fuel_105m',
      type: 'FUELING',
      triggerType: 'TIME',
      triggerSeconds: 105 * 60,
      triggerDistanceKm: 15.0,
      title: '🛡️ Pre-Cramp Defense Salt Capsule (105 Min / 15km Mark)',
      text: '15 kilometer mark reached! Pre-cramp defense: take 1 Salt Capsule with water now.',
      duckMusicSeconds: 1.5,
      audioClip: 'fuel_salt_105m.mp3'
    });
  }

  if (distKm >= 18 || estDurationMins >= 120) {
    fuelingCues.push({
      id: 'fuel_125m',
      type: 'FUELING',
      triggerType: 'TIME',
      triggerSeconds: 125 * 60,
      triggerDistanceKm: 18.0,
      title: '⚡ Energy Gel #3 Alert (18km Mark)',
      text: '18 kilometers logged. Take Gel number 3. Relax your shoulders and hold steady rhythm.',
      duckMusicSeconds: 1.5,
      audioClip: 'fuel_gel_125m.mp3'
    });
  }

  return fuelingCues;
}

// 6. Build Master Audio Manifest
function buildAudioManifest(wo, tomorrow, weather) {
  const dist = wo.distance_km || 0;
  const targetPace = wo.target_pace || '7:20 - 7:35 min/km';
  const type = wo.workout_type || 'Workout';
  const rpe = wo.rpe_target || 3;
  const structure = parseIntervalStructure(wo);
  
  const estDurationMins = Math.max(30, Math.round(dist * 7.5 + 10));
  const estDurationSeconds = estDurationMins * 60;

  // Opening briefing
  const openingBriefing = {
    title: `Good Morning! Today's Workout: ${dist}km ${type}`,
    summaryText: `Welcome to your morning run! Today's session is ${dist} kilometers. Target pace is ${targetPace} with an RPE of ${rpe} out of 10. ${weather.advisory}`,
    weatherAdvisory: weather.advisory,
    targetCadence: structure.targetCadence || 170,
    fuelingPlanSummary: dist >= 10 ? 'Take 1 Salt capsule at 45m and 105m + Gel at 90m' : 'Water sips as needed'
  };

  const timeline = [];

  // START RUN CUE (T = 0s)
  timeline.push({
    id: 'start_run',
    type: 'SESSION_START',
    triggerType: 'TIME',
    triggerSeconds: 0,
    title: '🚀 Workout Started',
    text: `Starting workout. ${wo.description || `Target pace ${targetPace}.`} Settle into an easy rhythm.`,
    duckMusicSeconds: 1.5,
    hasCountdown: false
  });

  // STRUCTURED TIMELINE
  if (structure.type === 'INTERVAL') {
    // 1. Warmup
    timeline.push({
      id: 'warmup_phase',
      type: 'WARMUP',
      triggerType: 'TIME',
      triggerSeconds: 5,
      title: '🏃 Warmup Phase (10 Mins)',
      text: `Warmup: 10 minutes easy jogging at conversational pace. Target RPE 3.`,
      duckMusicSeconds: 1.5,
      hasCountdown: false
    });

    let currentTimestamp = structure.warmupSeconds;

    for (let rep = 1; rep <= structure.reps; rep++) {
      // PRE-CUE for Hard Interval (fires 10s before interval start)
      timeline.push({
        id: `interval_precue_${rep}`,
        type: 'INTERVAL_PRE_CUE',
        triggerType: 'TIME',
        triggerSeconds: currentTimestamp - 10,
        title: `🔥 Interval ${rep} of ${structure.reps} (Pre-Cue)`,
        text: `Get ready: Interval ${rep} of ${structure.reps}. ${Math.round(structure.workSeconds / 60)} minute hard effort. Target pace ${structure.workPace}, RPE ${structure.workRpe}.`,
        duckMusicSeconds: 1.5,
        hasCountdown: true, // Triggers 5-4-3-2-1 countdown beeps from T-5s to T-0s
        countdownStartSecond: currentTimestamp - 5
      });

      // INTERVAL START
      timeline.push({
        id: `interval_start_${rep}`,
        type: 'INTERVAL_START',
        triggerType: 'TIME',
        triggerSeconds: currentTimestamp,
        title: `⚡ Interval ${rep} Started!`,
        text: `GO! Push to ${structure.workPace}. Hold high cadence.`,
        duckMusicSeconds: 0.5,
        hasCountdown: false
      });

      currentTimestamp += structure.workSeconds;

      // PRE-CUE for Rest (fires 8s before rest starts)
      timeline.push({
        id: `rest_precue_${rep}`,
        type: 'REST_PRE_CUE',
        triggerType: 'TIME',
        triggerSeconds: currentTimestamp - 8,
        title: `🧘 Recovery ${rep} of ${structure.reps} (Pre-Cue)`,
        text: `Rest in 5 seconds. ${structure.restSeconds} seconds easy walk or slow jog.`,
        duckMusicSeconds: 1.5,
        hasCountdown: true,
        countdownStartSecond: currentTimestamp - 5
      });

      // REST START
      timeline.push({
        id: `rest_start_${rep}`,
        type: 'REST_START',
        triggerType: 'TIME',
        triggerSeconds: currentTimestamp,
        title: `🧘 Recovery ${rep} Started`,
        text: `Recover for ${structure.restSeconds} seconds. Catch your breath, RPE 2.`,
        duckMusicSeconds: 1.0,
        hasCountdown: false
      });

      currentTimestamp += structure.restSeconds;
    }

    // Cooldown
    timeline.push({
      id: 'cooldown_phase',
      type: 'COOLDOWN',
      triggerType: 'TIME',
      triggerSeconds: currentTimestamp,
      title: '🧘 Cooldown Phase (10 Mins)',
      text: `Intervals complete! 10 minutes easy cooldown jog and walking float.`,
      duckMusicSeconds: 1.5,
      hasCountdown: false
    });

  } else {
    // Distance / Steady Run Splits & Course Simulations
    for (let km = 1; km <= Math.floor(dist); km++) {
      let extraNote = '';
      if (km === 1) extraNote = ' Gently float into your rhythm. Do not start too fast.';
      if (km === 5) extraNote = ' 5k completed. Check your posture and relax your neck.';
      if (km === 10) extraNote = ' 10k halfway mark. Cadence steady at 170 steps per minute.';
      if (km === 15) extraNote = ' 15k mark. Simulated Pedder Road incline ahead: shorten stride, keep cadence high, do not surge.';
      if (km === 20) extraNote = ' 20k milestone! Excellent pacing discipline.';

      timeline.push({
        id: `km_split_${km}`,
        type: 'DISTANCE_SPLIT',
        triggerType: 'DISTANCE',
        triggerDistanceKm: km,
        title: `📍 Kilometer ${km} Split`,
        text: `Kilometer ${km} reached.${extraNote}`,
        duckMusicSeconds: 1.5,
        hasCountdown: false
      });
    }
  }

  // Inject Fueling Cues
  const fuelingCues = generateFuelingSchedule(dist, estDurationMins);
  timeline.push(...fuelingCues);

  // Sort timeline by trigger time / distance
  timeline.sort((a, b) => {
    const valA = a.triggerSeconds !== undefined ? a.triggerSeconds : (a.triggerDistanceKm * 450);
    const valB = b.triggerSeconds !== undefined ? b.triggerSeconds : (b.triggerDistanceKm * 450);
    return valA - valB;
  });

  // FINISH WORKOUT CUE
  timeline.push({
    id: 'workout_complete',
    type: 'SESSION_COMPLETE',
    triggerType: 'DISTANCE_OR_TIME',
    triggerDistanceKm: dist,
    triggerSeconds: estDurationSeconds,
    title: '🏆 Workout Complete!',
    text: `Workout complete! Fantastic work on today's ${dist}km session. Take 500ml electrolyte water and perform your calf armor heel drops.`,
    duckMusicSeconds: 1.5,
    hasCountdown: false
  });

  return {
    generatedAt: new Date().toISOString(),
    workoutDate: tomorrow.dateStr,
    dayOfWeek: tomorrow.dayOfWeek,
    workoutType: type,
    distanceKm: dist,
    targetPace: targetPace,
    rpeTarget: rpe,
    estDurationMins,
    openingBriefing,
    cadenceMetronome: {
      enabledByDefault: structure.type === 'INTERVAL',
      bpm: structure.targetCadence || 170
    },
    audioDucking: {
      preDuckLeadSeconds: 1.5,
      duckedVolumePercent: 10,
      releaseBufferSeconds: 0.5
    },
    earbudControls: {
      doubleTap: 'REPEAT_LAST_CUE',
      tripleTap: 'SKIP_CURRENT_INTERVAL'
    },
    timeline
  };
}

// 7. Execution Engine
async function run() {
  console.log(`🎙️ [TMM 2027] Running 8:00 PM Nightly Audio Manifest Generator...`);
  
  const tomorrow = getTomorrowDateIST();
  console.log(`📅 Target Date (IST): ${tomorrow.dateStr} (${tomorrow.dayOfWeek})`);

  const wo = await fetchTomorrowWorkout(tomorrow.dateStr);
  console.log(`🏃 Workout: ${wo.distance_km || 0}km - ${wo.workout_type || wo.type}`);

  const weather = await fetchTomorrowWeather();
  console.log(`🌤️ Weather Advisory: ${weather.advisory}`);

  const manifest = buildAudioManifest(wo, tomorrow, weather);
  console.log(`📊 Generated ${manifest.timeline.length} Audio Events (Intervals, Countdowns, Fueling, Splits).`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✅ Successfully wrote Audio Manifest to: ${OUTPUT_FILE}`);
}

// If invoked directly via node
if (require.main === module) {
  run().catch(err => {
    console.error(`❌ Audio Manifest Generation Failed:`, err);
    process.exit(1);
  });
}

module.exports = {
  getTomorrowDateIST,
  fetchTomorrowWorkout,
  fetchTomorrowWeather,
  parseIntervalStructure,
  buildAudioManifest,
  run
};
