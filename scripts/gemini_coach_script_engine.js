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

  const prompt = `
You are the elite Master Coach and Running Philosopher for the Tata Mumbai Marathon 2027 (TMM 2027).
Your coaching style is a blend of Eliud Kipchoge (stoic discipline & joy), Coach Bennett (empathetic, grounded athletic encouragement), and Haruki Murakami (thoughtful reflection on running and life).

You are creating the audio coaching script for the runner today.

WORKOUT BLUEPRINT FROM DATABASE:
- Date: ${date}
- Workout Type: ${type}
- Planned Distance: ${dist} km
- Target Pace: ${targetPace}
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
3. STRICT 1:1 STRATEGY ALIGNMENT:
   - Every split in the provided Strategy Splits MUST have a matching cue.
   - For work intervals/reps: provide a 10s pre-cue with countdown alert, followed by an explosive GO cue.
   - For recovery rests: provide a 5s pre-cue and a relaxed recovery breathing cue.
   - For continuous tempo blocks: cue the sustained threshold lock without artificial breaks.
   - For warmup/cooldown: cue relaxed aerobic float and lactate flushing.
4. TMM 2027 MUMBAI MARATHON ROUTE INTELLIGENCE:
   - Relate today's training directly to a specific landmark or tactical challenge of the Tata Mumbai Marathon:
     * Bandra-Worli Sea Link crosswinds (holding 170+ SPM cadence without crowd shelter)
     * Pedder Road (Km 35 hill - shortening stride, pumping arms, pacing patience)
     * Marine Drive & Chowpatty (sea breeze rhythm vs midday return heat)
     * CSMT / Azad Maidan start (resisting the adrenaline surge).
5. DYNAMIC PACING ALERTS (ANTI-REPETITIVE):
   - Provide an array of 6 to 8 distinct, varied lines for "too_slow" (encouraging, tactical, posture/cadence focus).
   - Provide an array of 6 to 8 distinct, varied lines for "too_fast" (ego check, calf protection, pacing wisdom).
6. DYNAMIC FUELING ALERTS:
   - Provide contextual reminders for water, electrolytes, and salt capsules derived from the fueling strategy.

Respond STRICTLY with valid JSON matching this exact structure:
{
  "workout_date": "${date}",
  "workout_type": "${type}",
  "distance_km": ${dist},
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
