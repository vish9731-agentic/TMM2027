/**
 * TMM 2027 - ElevenLabs Standalone CLI Tester & Player
 * 
 * Usage:
 *   node scripts/test_elevenlabs.js <your_elevenlabs_api_key>
 *   or:
 *   ELEVENLABS_API_KEY=your_key node scripts/test_elevenlabs.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SUPABASE_URL = "https://xtdfhxczdlgyhkqsltyq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZGZoeGN6ZGxneWhrcXNsdHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzg2OTUsImV4cCI6MjEwMjcxNDY5NX0.ARI4z_eWMhBQiF66xTXKDOrspfsBQjnG81qxaBhEuww";

async function getApiKey() {
  if (process.argv[2] && process.argv[2].startsWith("sk_")) {
    return process.argv[2];
  }
  if (process.env.ELEVENLABS_API_KEY) {
    return process.env.ELEVENLABS_API_KEY;
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/daily_workouts?id=eq.9999`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    if (data && data.length > 0) {
      const cfg = JSON.parse(data[0].description);
      if (cfg.elevenlabs_api_key) return cfg.elevenlabs_api_key;
    }
  } catch (e) {}

  return null;
}

async function testElevenLabs() {
  console.log("==================================================");
  console.log("🎙️ TMM 2027 ElevenLabs Voice Tester (Voice: Coach Vega - Female)");
  console.log("==================================================\n");

  const apiKey = await getApiKey();

  if (!apiKey) {
    console.log("⚠️ No ElevenLabs API Key found.\n");
    console.log("👉 How to test right now:");
    console.log("   Run with your API key:");
    console.log("   node scripts/test_elevenlabs.js <YOUR_API_KEY>\n");
    console.log("   OR paste it into the Web Dashboard settings modal under 'ELEVENLABS API KEY'.");
    console.log("   (You can get a free key with 10,000 free chars/month at https://elevenlabs.io)\n");
    process.exit(1);
  }

  const samplePrompt = "Good morning runner. I am Coach Vega, your marathon companion for today. Keep your shoulders loose, settle into your aerobic zone, and let the cadence carry you through Mumbai.";

  console.log("🚀 Synthesizing audio via ElevenLabs API...");
  console.log(`💬 Text: "${samplePrompt}"\n`);

  try {
    const voiceId = "EXAVITQu4vr4xnSDxMaL"; // Coach Vega (Sarah female voice)
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      body: JSON.stringify({
        text: samplePrompt,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`ElevenLabs API returned ${res.status}: ${errText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const outputPath = path.join(__dirname, "..", "test_elevenlabs_vega.mp3");

    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Success! Audio file written to:`);
    console.log(`   ${outputPath} (${buffer.length} bytes)\n`);

    console.log("🔊 Playing audio through your Mac speakers via 'afplay'...");
    try {
      execSync(`afplay "${outputPath}"`);
      console.log("🎉 Playback finished!");
    } catch (playErr) {
      console.log(`(Could not auto-play via afplay: ${playErr.message})`);
    }

  } catch (err) {
    console.error("❌ ElevenLabs Synthesis Failed:", err.message);
  }
}

testElevenLabs();
