/**
 * ==============================================================================
 * TMM 2027 • Master Plan Cloud Synchronizer (CI/CD Automated Sync)
 * ==============================================================================
 * Automatically synchronizes training_data.json planned workouts and week specs
 * with the live Supabase PostgreSQL database.
 * 
 * Safety Guarantee:
 * - Updates ONLY planned columns (workout_type, distance_km, target_pace,
 *   rpe_target, description, strength_prehab, fueling_hydration_strategy).
 * - NEVER alters or overwrites athlete completed logs (is_completed, 
 *   actual_distance_km, actual_pace, athlete_notes, actual_splits, etc.).
 * ==============================================================================
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xtdfhxczdlgyhkqsltyq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZGZoeGN6ZGxneWhrcXNsdHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzg2OTUsImV4cCI6MjEwMjcxNDY5NX0.ARI4z_eWMhBQiF66xTXKDOrspfsBQjnG81qxaBhEuww';

const PLAN_FILE = path.resolve(__dirname, '../training_data.json');

async function patchRecord(endpoint, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const url = new URL(`${SUPABASE_URL}/rest/v1/${endpoint}`);
    const req = https.request(url, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  if (!fs.existsSync(PLAN_FILE)) {
    console.error('Plan file not found:', PLAN_FILE);
    process.exit(1);
  }

  const plan = JSON.parse(fs.readFileSync(PLAN_FILE, 'utf8'));
  console.log(`🚀 Starting Cloud Master Plan Sync (${plan.weeks.length} weeks)...`);

  // 1. Sync Training Weeks
  console.log('📦 Synchronizing training_weeks metadata...');
  for (const w of plan.weeks) {
    const payload = {
      total_planned_km: w.total_planned_km,
      is_deload: w.is_deload,
      phase_name: w.phase,
      focus: w.focus
    };
    const res = await patchRecord(`training_weeks?week_number=eq.${w.week_number}`, payload);
    if (res.status >= 300) {
      console.warn(`⚠️ Week ${w.week_number} sync warning (${res.status}): ${res.body}`);
    }
  }

  // 2. Sync Workouts (Concurrent Batches of 15)
  console.log('🏃 Synchronizing daily_workouts planned targets...');
  const tasks = [];
  for (const w of plan.weeks) {
    for (const wo of w.workouts) {
      const payload = {
        workout_type: wo.type,
        distance_km: wo.distance_km,
        target_pace: wo.target_pace,
        rpe_target: wo.rpe,
        description: wo.description,
        strength_prehab: wo.strength_prehab,
        fueling_hydration_strategy: wo.fueling
      };
      tasks.push(() => patchRecord(`daily_workouts?workout_date=eq.${wo.date}`, payload));
    }
  }

  const concurrency = 15;
  let successCount = 0;
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(fn => fn()));
    successCount += results.filter(r => r.status < 300).length;
    process.stdout.write(`•`);
  }

  console.log(`\n✅ Master Plan Cloud Sync Complete! Successfully synced ${successCount}/${tasks.length} workouts.`);
}

run().catch(err => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});
