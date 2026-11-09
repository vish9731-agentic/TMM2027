/**
 * TMM 2027 - Gemini 3.8 Flash Coach Script Engine (Zero-Failure Resilient)
 * 
 * Ingests workout blueprints from Supabase (including exact strategy_splits),
 * and generates a deeply curated, philosophical, athletic audio coaching script.
 * Primary: gemini-3.8-flash
 * Resilient Failover: gemini-3.6-flash (if Google returns 503 temporary overload)
 */

const fs = require("fs");
const path = require("path");

const SUPABASE_URL = "https://xtdfhxczdlgyhkqsltyq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZGZoeGN6ZGxneWhrcXNsdHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzg2OTUsImV4cCI6MjEwMjcxNDY5NX0.ARI4z_eWMhBQiF66xTXKDOrspfsBQjnG81qxaBhEuww";

async function getGeminiApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/daily_workouts?id=eq.9999`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    if (data && data.length > 0) {
      const cfg = JSON.parse(data[0].description);
      if (cfg.gemini_api_key) return cfg.gemini_api_key;
    }
  } catch (e) {
    console.warn("Could not fetch key from Supabase row 9999:", e.message);
  }
  return null;
}

async function fetchWorkoutFromSupabase(workoutDate) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/daily_workouts?workout_date=eq.${workoutDate}`, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch workout for date ${workoutDate}: ${res.statusText}`);
  const rows = await res.json();
  if (!rows || rows.length === 0) throw new Error(`No workout found in Supabase for date: ${workoutDate}`);
  return rows[0];
}

async function saveCoachScriptToSupabase(workoutDate, scriptObj) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/daily_workouts?workout_date=eq.${workoutDate}`, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify({ coach_script: scriptObj })
    });
    if (res.ok) {
      console.log(`✅ Successfully saved coach_script to Supabase for ${workoutDate}`);
      return true;
    } else {
      console.warn(`⚠️ Supabase PATCH coach_script returned ${res.status}: ${await res.text()}`);
      return false;
    }
  } catch (e) {
    console.warn("Supabase save error:", e.message);
    return false;
  }
}

/**
 * Calls Gemini with primary gemini-3.8-flash and resilient failover.
 */
async function callGeminiFlashWithResilience(promptText, apiKey) {
  const models = ["gemini-3.8-flash", "gemini-3.8-flash", "gemini-3.6-flash"];
  let lastError = null;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    console.log(`🤖 Invoking ${model} (attempt ${i + 1}/${models.length})...`);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        })
      });

      if (res.status === 503 || res.status === 429) {
        console.warn(`⚠️ ${model} returned ${res.status} (High demand spike on Google servers).`);
        await new Promise(r => setTimeout(r, 1500));
        continue;
      }

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`⚠️ ${model} error ${res.status}: ${errText}`);
        continue;
      }

      const json = await res.json();
      const rawOutput = json.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(rawOutput);
      parsed._generated_by_model = model;
      return parsed;

    } catch (err) {
      console.warn(`⚠️ ${model} error: ${err.message}`);
      lastError = err;
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  throw lastError || new Error("Failed to generate coach script with Gemini Flash.");
}

/**
 * Ingests Supabase workout and generates the complete philosophical audio script.
 */
async function generateCoachScriptForWorkout(workout) {
  const apiKey = await getGeminiApiKey();
  if (!apiKey) throw new Error("Gemini API key not found in Supabase row 9999 or environment!");

  const dist = workout.distance_km || 0;
  const type = workout.workout_type || workout.type || "Training Run";
  const date = workout.workout_date || workout.date;
  const targetPace = workout.target_pace || "N/A";
  const rpe = workout.rpe_target || workout.rpe || 3;
  const fueling = workout.fueling_hydration_strategy || workout.fueling || "Water sips as needed";
  const prehab = workout.strength_prehab || "Calf eccentrics";
  const splits = workout.strategy_splits || [];

  // Physiological Heart Rate Zone & Biometrics context
  const isSpeedOrHills = type.toLowerCase().includes('hill') || type.toLowerCase().includes('interval') || type.toLowerCase().includes('rep');
  const isTempo = type.toLowerCase().includes('tempo') || type.toLowerCase().includes('threshold') || type.toLowerCase().includes('mp');
  const isLong = type.toLowerCase().includes('long') || dist >= 10;
  
  let targetHrZoneName = "Zone 2 (Aerobic Base)";
  let targetHrRange = "130 – 145 bpm";
  let hrCeiling = "145 bpm (148 bpm max for late-run thermal drift)";
  if (isSpeedOrHills) {
    targetHrZoneName = "Zone 4 (Threshold & Hills) with Zone 1/2 Recovery";
    targetHrRange = "Work Reps: 159 – 172 bpm | Rest: < 135 bpm";
    hrCeiling = "175 bpm (Ceiling)";
  } else if (isTempo) {
    targetHrZoneName = "Zone 3 (Aerobic Tempo / Marathon Pace)";
    targetHrRange = "146 – 158 bpm";
    hrCeiling = "160 bpm (Ceiling)";
  } else if (isLong) {
    targetHrZoneName = "Zone 2 (Aerobic Base Endurance)";
    targetHrRange = "132 – 145 bpm";
    hrCeiling = "145 bpm (First half) / 148 bpm (Final 5K under heat)";
  } else if (dist <= 5) {
    targetHrZoneName = "Zone 1 / Lower Zone 2 (Active Recovery)";
    targetHrRange = "125 – 138 bpm";
    hrCeiling = "140 bpm (Ceiling)";
  }

  const prompt = `
You are the elite Master Coach and Running Philosopher for the Tata Mumbai Marathon 2027 (TMM 2027).
Your coaching style is a blend of Eliud Kipchoge (stoic discipline & joy), Coach Bennett (empathetic, grounded athletic encouragement), and Haruki Murakami (thoughtful reflection on running and life).

You are creating the audio coaching script for the runner today.

WORKOUT BLUEPRINT FROM DATABASE:
- Date: ${date}
- Workout Type: ${type}
- Planned Distance: ${dist} km
- Target Pace: ${targetPace}
- Target Heart Rate Zone: ${targetHrZoneName}
- Prescribed HR Range: ${targetHrRange} (Ceiling: ${hrCeiling})
- Hardware: Samsung Galaxy Watch4 Classic optical pulse tracking via Strava
- RPE Target: ${rpe} / 10
- Fueling Strategy: ${fueling}
- Post-run Prehab: ${prehab}
- Exact Strategy Splits: ${JSON.stringify(splits, null, 2)}

STRICT COACHING GUIDELINES:
1. THE GOLDEN RATIO OF SPEECH VS SILENCE:
   - You MUST NOT talk continuously. Each audio insight must be concise (20 to 35 seconds spoken length).
   - After each insight, specify "dwell_after_sec" between 180 to 360 seconds (3 to 6 minutes of uninterrupted running music / silence) so the runner can dwell, reflect, and lock into their stride.
2. RUN THEME:
   - Choose a unique philosophical theme suitable for this specific workout type (e.g. "The Art of Middle-Kilometer Solitude", "Economy of Motion: Finding Flow", "The Anatomy of Discipline vs Motivation", "Running in Adversity & Weather", "Minimalism: What Gear Actually Matters").
   - Include 2 to 3 thematic reflection drops interspersed during the run.
3. STRICT 1:1 STRATEGY ALIGNMENT & HEART RATE DISCIPLINE:
   - Every split in the provided Strategy Splits MUST have a matching cue.
   - For work intervals/reps: provide a 10s pre-cue with countdown alert, followed by an explosive GO cue. Remind athlete to push into Zone 4 (159–172 bpm).
   - For recovery rests: provide a 5s pre-cue and prompt a Galaxy Watch4 pulse check to confirm HR drops below 135 bpm before starting the next rep.
   - For continuous tempo blocks: cue the sustained threshold lock (Zone 3: 146–158 bpm) without artificial surges.
   - For warmup/cooldown: cue relaxed aerobic float (<130 bpm) and lactate flushing.
   - For long runs: emphasize strict Zone 2 adherence (130–145 bpm) to preserve calf muscle glycogen for the final 10K.
4. TMM 2027 MUMBAI MARATHON ROUTE INTELLIGENCE:
   - Relate today's training directly to a specific landmark or tactical challenge of the Tata Mumbai Marathon:
     * Bandra-Worli Sea Link crosswinds (holding 170+ SPM cadence without crowd shelter)
     * Pedder Road (Km 35 hill - shortening stride, pumping arms, pacing patience)
     * Marine Drive & Chowpatty (sea breeze rhythm vs midday return heat)
     * CSMT / Azad Maidan start (resisting the adrenaline surge).
5. DYNAMIC PACING ALERTS (ANTI-REPETITIVE):
   - Provide an array of 6 to 8 distinct, varied lines for "too_slow" (encouraging, tactical, posture/cadence focus).
   - Provide an array of 6 to 8 distinct, varied lines for "too_fast" (ego check, calf protection, pacing wisdom).
6. DYNAMIC HEART RATE ALERTS (GALAXY WATCH4 BIOMETRICS):
   - Provide 5 to 6 distinct lines for "too_high": alert runner when Galaxy Watch vibrates above the ceiling (${hrCeiling}), prompting relaxed jaw, lowered shoulders, belly breathing, and an immediate 15s/km pace reduction to prevent calf glycogen exhaustion.
   - Provide 4 to 5 distinct lines for "too_low": prompt runner during tempo/interval segments to pick up turnover if pulse hasn't reached target zone.
7. DYNAMIC FUELING & CARDIAC DRIFT ALERTS:
   - Provide contextual reminders for water, electrolytes, and salt capsules. If cardiac drift occurs (>5% HR rise at constant pace in 2nd half), prescribe salt capsule + water.
8. FOOTWEAR & BIOMECHANICAL CUEING (ADIDAS ADIZERO EVO SL):
   - The athlete runs in the newly acquired Adidas Adizero EVO SL (100% Lightstrike Pro foam, non-plated natural flex, 6.6mm drop).
   - In 1 to 2 cues (e.g. warmup or cruise split), integrate tactile form coaching: cue a quick, light cadence (~168–172 SPM), letting the Lightstrike Pro rocker carry momentum with a soft midfoot roll to spare the soleus and calves.

Respond STRICTLY with valid JSON matching this exact structure:
{
  "workout_date": "${date}",
  "workout_type": "${type}",
  "distance_km": ${dist},
  "target_hr_zone": "${targetHrZoneName}",
  "target_hr_range": "${targetHrRange}",
  "theme": {
    "title": "Short Theme Title",
    "philosophical_insight": "2-3 sentences explaining the theme",
    "quote": "Memorable stoic running quote"
  },
  "tmm_race_intelligence": {
    "course_landmark": "Name of TMM landmark",
    "tactical_simulation": "How today prepares you for this landmark",
    "mental_drill": "Mental technique for race day"
  },
  "cues": [
    {
      "id": "cue_id",
      "trigger_sec": 0,
      "type": "SESSION_START",
      "title": "Short Title",
      "text": "Spoken text (strictly 20-35 seconds spoken length)",
      "dwell_after_sec": 180,
      "has_countdown": false
    }
  ],
  "dynamic_pace_alerts": {
    "too_slow": [ "6-8 varied lines" ],
    "too_fast": [ "6-8 varied lines" ]
  },
  "dynamic_heart_rate_alerts": {
    "too_high": [ "5-6 varied lines: ease pace by 15s/km, drop shoulders, deep belly breaths, protect calf glycogen" ],
    "too_low": [ "4-5 varied lines: lift cadence, lean from ankles, engage glutes" ]
  },
  "dynamic_fueling_alerts": [ "2-3 lines" ]
}
`;

  const result = await callGeminiFlashWithResilience(prompt, apiKey);
  console.log(`✨ Successfully generated coach script for ${date} using ${result._generated_by_model}! Theme: "${result.theme?.title}"`);
  
  // Save to Supabase
  await saveCoachScriptToSupabase(date, result);

  return result;
}

module.exports = {
  generateCoachScriptForWorkout,
  fetchWorkoutFromSupabase,
  saveCoachScriptToSupabase
};

// CLI execution test
if (require.main === module) {
  (async () => {
    try {
      const dateArg = process.argv[2] || "2026-10-23";
      console.log(`Testing Gemini Flash script engine for: ${dateArg}`);
      
      let wo;
      try {
        wo = await fetchWorkoutFromSupabase(dateArg);
      } catch(e) {
        console.warn("Supabase fetch fallback to local training_data.json:", e.message);
        const td = JSON.parse(fs.readFileSync("training_data.json", "utf8"));
        const weeks = td.weeks || td.training_plan.weeks;
        for (const w of weeks) {
          const found = w.workouts.find(x => x.date === dateArg);
          if (found) { wo = found; break; }
        }
      }

      if (!wo) throw new Error(`Workout not found for ${dateArg}`);

      const script = await generateCoachScriptForWorkout(wo);
      fs.writeFileSync(`coach_script_${dateArg}.json`, JSON.stringify(script, null, 2), "utf8");
      console.log(`\n🎉 Saved verified output to coach_script_${dateArg}.json`);
      console.log("Model Used:", script._generated_by_model);
      console.log("Theme:", script.theme);
      console.log("TMM Landmark:", script.tmm_race_intelligence);
      console.log("Total Cues Generated:", script.cues?.length);
      console.log("Too Slow Pace Alert Options:", script.dynamic_pace_alerts?.too_slow?.length);
      console.log("Too Fast Pace Alert Options:", script.dynamic_pace_alerts?.too_fast?.length);
    } catch (err) {
      console.error("Test execution failed:", err);
      process.exit(1);
    }
  })();
}
