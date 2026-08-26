const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xtdfhxczdlgyhkqsltyq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZGZoeGN6ZGxneWhrcXNsdHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzg2OTUsImV4cCI6MjEwMjcxNDY5NX0.ARI4z_eWMhBQiF66xTXKDOrspfsBQjnG81qxaBhEuww';

async function main() {
  console.log('🔄 ========================================================');
  console.log('🔄 SWAPPING WEDNESDAY (AEROBIC) AND FRIDAY (SPEED) RUNS');
  console.log('🔄 ========================================================\n');

  // 1. Load training_data.json
  const trainingDataPath = path.join(__dirname, '..', 'training_data.json');
  const trainingData = JSON.parse(fs.readFileSync(trainingDataPath, 'utf8'));

  const swapPairs = []; // To track for Supabase updates

  trainingData.weeks.forEach(week => {
    const wedIndex = week.workouts.findIndex(w => w.day === 'Wednesday');
    const friIndex = week.workouts.findIndex(w => w.day === 'Friday');

    if (wedIndex === -1 || friIndex === -1) {
      console.error(`❌ Week ${week.week_number} missing Wed or Fri workout`);
      return;
    }

    const wedWo = week.workouts[wedIndex];
    const friWo = week.workouts[friIndex];

    // Store swap info
    swapPairs.push({
      week_number: week.week_number,
      wed_date: wedWo.date,
      fri_date: friWo.date,
      old_wed: { ...wedWo },
      old_fri: { ...friWo }
    });

    // Create swapped workouts
    // Wednesday gets Friday's workout details with Wednesday's day & date
    const newWedWo = {
      day: 'Wednesday',
      date: wedWo.date,
      type: friWo.type,
      distance_km: friWo.distance_km,
      target_pace: friWo.target_pace,
      rpe: friWo.rpe,
      description: friWo.description,
      strength_prehab: friWo.strength_prehab,
      fueling: friWo.fueling,
      strategy_splits: friWo.strategy_splits
    };

    // Friday gets Wednesday's workout details with Friday's day & date
    const newFriWo = {
      day: 'Friday',
      date: friWo.date,
      type: wedWo.type,
      distance_km: wedWo.distance_km,
      target_pace: wedWo.target_pace,
      rpe: wedWo.rpe,
      description: wedWo.description,
      strength_prehab: wedWo.strength_prehab,
      fueling: wedWo.fueling,
      strategy_splits: wedWo.strategy_splits
    };

    week.workouts[wedIndex] = newWedWo;
    week.workouts[friIndex] = newFriWo;
  });

  // Save training_data.json
  fs.writeFileSync(trainingDataPath, JSON.stringify(trainingData, null, 2), 'utf8');
  console.log('✅ 1. Updated training_data.json successfully.');

  // 2. Sync to Android Companion Assets
  const androidAssetPath = path.join(__dirname, '..', 'android_companion', 'app', 'src', 'main', 'assets', 'training_data.json');
  if (fs.existsSync(path.dirname(androidAssetPath))) {
    fs.writeFileSync(androidAssetPath, JSON.stringify(trainingData, null, 2), 'utf8');
    console.log('✅ 2. Updated android_companion/app/src/main/assets/training_data.json');
  }

  // 3. Update rawWeeksData in app.js
  const appJsPath = path.join(__dirname, '..', 'app.js');
  let appJs = fs.readFileSync(appJsPath, 'utf8');

  // Simplify trainingData weeks for rawWeeksData (without strategy_splits to keep app.js lean)
  const appWeeksData = trainingData.weeks.map(w => ({
    week_number: w.week_number,
    phase: w.phase || w.focus,
    start_date: w.start_date,
    end_date: w.end_date,
    total_planned_km: w.total_planned_km,
    is_deload: w.is_deload,
    focus: w.focus,
    workouts: w.workouts.map(wo => ({
      day: wo.day,
      date: wo.date,
      type: wo.type,
      distance_km: wo.distance_km,
      target_pace: wo.target_pace,
      rpe: wo.rpe,
      description: wo.description,
      strength_prehab: wo.strength_prehab,
      fueling: wo.fueling
    }))
  }));

  const startMarker = 'let rawWeeksData = [';
  const startIdx = appJs.indexOf(startMarker);
  if (startIdx !== -1) {
    // Find matching closing bracket for rawWeeksData
    let depth = 0;
    let endIdx = -1;
    for (let i = startIdx + 'let rawWeeksData = '.length; i < appJs.length; i++) {
      if (appJs[i] === '[') depth++;
      else if (appJs[i] === ']') {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }

    if (endIdx !== -1) {
      const newWeeksJson = JSON.stringify(appWeeksData, null, 2);
      appJs = appJs.slice(0, startIdx) + `let rawWeeksData = ${newWeeksJson}` + appJs.slice(endIdx + 1);
      fs.writeFileSync(appJsPath, appJs, 'utf8');
      console.log('✅ 3. Updated rawWeeksData in app.js');
    } else {
      console.warn('⚠️ Could not find closing bracket for rawWeeksData in app.js');
    }
  }

  // 4. Update Supabase Cloud Database
  console.log('\n☁️ 4. Updating Supabase Cloud Database (daily_workouts)...');
  
  // Fetch existing rows from Supabase
  const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/daily_workouts?select=*`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!sbRes.ok) {
    console.error('❌ Failed to fetch from Supabase:', await sbRes.text());
    return;
  }

  const sbRows = await sbRes.json();
  console.log(`📦 Loaded ${sbRows.length} rows from Supabase.`);

  let updatedCount = 0;
  for (const pair of swapPairs) {
    const wedRow = sbRows.find(r => r.week_number === pair.week_number && r.day_of_week === 'Wednesday');
    const friRow = sbRows.find(r => r.week_number === pair.week_number && r.day_of_week === 'Friday');

    if (wedRow && friRow) {
      // Wednesday gets old Friday's workout details
      const updateWed = {
        workout_type: pair.old_fri.type,
        distance_km: pair.old_fri.distance_km,
        target_pace: pair.old_fri.target_pace,
        rpe_target: pair.old_fri.rpe,
        description: pair.old_fri.description,
        strength_prehab: pair.old_fri.strength_prehab,
        fueling_hydration_strategy: pair.old_fri.fueling
      };

      // Friday gets old Wednesday's workout details
      const updateFri = {
        workout_type: pair.old_wed.type,
        distance_km: pair.old_wed.distance_km,
        target_pace: pair.old_wed.target_pace,
        rpe_target: pair.old_wed.rpe,
        description: pair.old_wed.description,
        strength_prehab: pair.old_wed.strength_prehab,
        fueling_hydration_strategy: pair.old_wed.fueling
      };

      // PATCH Wednesday row
      const patchWedRes = await fetch(`${SUPABASE_URL}/rest/v1/daily_workouts?id=eq.${wedRow.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(updateWed)
      });

      // PATCH Friday row
      const patchFriRes = await fetch(`${SUPABASE_URL}/rest/v1/daily_workouts?id=eq.${friRow.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(updateFri)
      });

      if (patchWedRes.ok && patchFriRes.ok) {
        updatedCount += 2;
        console.log(`  ✓ Week ${pair.week_number.toString().padStart(2)}: Wed [${pair.old_fri.type} ${pair.old_fri.distance_km}km] ↔ Fri [${pair.old_wed.type} ${pair.old_wed.distance_km}km]`);
      } else {
        console.error(`  ✗ Week ${pair.week_number} update failed:`, await patchWedRes.text(), await patchFriRes.text());
      }
    }
  }

  console.log(`\n🎉 Successfully updated ${updatedCount} daily_workouts rows in Supabase!`);

  // 5. Update supabase_schema.sql
  const schemaPath = path.join(__dirname, '..', 'supabase_schema.sql');
  if (fs.existsSync(schemaPath)) {
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    for (const pair of swapPairs) {
      const wedDate = pair.wed_date;
      const friDate = pair.fri_date;

      const escapeSql = (s) => (s || '').replace(/'/g, "''");

      const oldWedRegex = new RegExp(`VALUES\\s*\\(${pair.week_number},\\s*'Wednesday',\\s*'${wedDate}',[^\\)]+\\);`, 'g');
      const oldFriRegex = new RegExp(`VALUES\\s*\\(${pair.week_number},\\s*'Friday',\\s*'${friDate}',[^\\)]+\\);`, 'g');

      const newWedSql = `VALUES (${pair.week_number}, 'Wednesday', '${wedDate}', '${escapeSql(pair.old_fri.type)}', ${pair.old_fri.distance_km}, '${escapeSql(pair.old_fri.target_pace)}', ${pair.old_fri.rpe}, '${escapeSql(pair.old_fri.description)}', '${escapeSql(pair.old_fri.strength_prehab)}', '${escapeSql(pair.old_fri.fueling)}');`;
      const newFriSql = `VALUES (${pair.week_number}, 'Friday', '${friDate}', '${escapeSql(pair.old_wed.type)}', ${pair.old_wed.distance_km}, '${escapeSql(pair.old_wed.target_pace)}', ${pair.old_wed.rpe}, '${escapeSql(pair.old_wed.description)}', '${escapeSql(pair.old_wed.strength_prehab)}', '${escapeSql(pair.old_wed.fueling)}');`;

      schemaSql = schemaSql.replace(oldWedRegex, newWedSql);
      schemaSql = schemaSql.replace(oldFriRegex, newFriSql);
    }

    fs.writeFileSync(schemaPath, schemaSql, 'utf8');
    console.log('✅ 5. Updated supabase_schema.sql seed statements.');
  }

  console.log('\n========================================================');
  console.log('🏁 SWAP COMPLETE ACROSS ALL REPOSITORIES & DATABASE');
  console.log('========================================================\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
