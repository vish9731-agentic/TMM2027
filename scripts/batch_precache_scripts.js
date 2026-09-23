/**
 * TMM 2027 - 7-Day Rolling Lookahead Pre-Cacher
 * 
 * Pre-generates and caches the AI coach scripts for the next 7 days in advance
 * so you are NEVER caught on run morning without your audio script loaded.
 */

const fs = require("fs");
const path = require("path");
const { generateCoachScriptForWorkout, fetchWorkoutFromSupabase } = require("./gemini_coach_script_engine");

function getNext7Dates(startDateStr) {
  const dates = [];
  const start = startDateStr ? new Date(startDateStr) : new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

async function precacheNext7Days(startDateStr) {
  const dates = getNext7Dates(startDateStr);
  console.log(`🚀 Pre-caching scripts for the next 7 days: ${dates.join(", ")}`);

  const cacheDir = path.join(__dirname, "..", "cache", "audio_scripts");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  const tdPath = path.join(__dirname, "..", "training_data.json");
  let td = null;
  if (fs.existsSync(tdPath)) {
    td = JSON.parse(fs.readFileSync(tdPath, "utf8"));
  }

  const results = [];

  for (const date of dates) {
    console.log(`\n-----------------------------------------`);
    console.log(`🔍 Checking script for ${date}...`);
    
    let wo = null;
    try {
      wo = await fetchWorkoutFromSupabase(date);
    } catch (e) {
      if (td) {
        const weeks = td.weeks || td.training_plan.weeks;
        for (const w of weeks) {
          const found = w.workouts.find(x => x.date === date);
          if (found) { wo = found; break; }
        }
      }
    }

    if (!wo) {
      console.log(`ℹ️ No workout found for ${date}. Skipping.`);
      continue;
    }

    const localCacheFile = path.join(cacheDir, `script_${date}.json`);

    if (wo.coach_script) {
      console.log(`✅ Coach script already exists in database for ${date} (Theme: "${wo.coach_script.theme?.title}")`);
      fs.writeFileSync(localCacheFile, JSON.stringify(wo.coach_script, null, 2), "utf8");
      results.push({ date, status: "cached_from_db" });
      continue;
    }

    if (fs.existsSync(localCacheFile)) {
      console.log(`✅ Coach script found in local cache for ${date}`);
      results.push({ date, status: "cached_local" });
      continue;
    }

    // Generate script using Gemini Flash
    console.log(`🤖 Generating new coach script with Gemini Flash for ${date}...`);
    try {
      const script = await generateCoachScriptForWorkout(wo);
      fs.writeFileSync(localCacheFile, JSON.stringify(script, null, 2), "utf8");

      // Also persist in local training_data.json
      if (td) {
        const weeks = td.weeks || td.training_plan.weeks;
        for (const w of weeks) {
          const found = w.workouts.find(x => x.date === date);
          if (found) { found.coach_script = script; break; }
        }
      }

      results.push({ date, status: "generated_fresh", theme: script.theme?.title });
    } catch (err) {
      console.error(`❌ Failed to pre-cache ${date}:`, err.message);
      results.push({ date, status: "failed", error: err.message });
    }
  }

  if (td) {
    fs.writeFileSync(tdPath, JSON.stringify(td, null, 2), "utf8");
    console.log(`\n💾 Saved updated scripts to training_data.json`);
    const androidAssetsPath = path.join(__dirname, "..", "android_companion", "app", "src", "main", "assets", "training_data.json");
    if (fs.existsSync(path.dirname(androidAssetsPath))) {
      fs.writeFileSync(androidAssetsPath, JSON.stringify(td, null, 2), "utf8");
      console.log(`📱 Synced updated scripts to Android Assets`);
    }
  }

  console.log(`\n=========================================`);
  console.log(`🎉 7-Day Pre-Cache Complete!`);
  console.table(results);
}

if (require.main === module) {
  const startArg = process.argv[2] || "2026-10-19"; // Week 10 Monday start
  precacheNext7Days(startArg);
}

module.exports = { precacheNext7Days };
