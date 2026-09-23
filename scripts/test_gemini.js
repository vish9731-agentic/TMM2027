/**
 * TMM 2027 - Gemini 2.5 Flash Audio Standalone CLI Tester & Player
 * 
 * Usage:
 *   node scripts/test_gemini.js [voiceName]
 *   e.g.
 *   node scripts/test_gemini.js Fenrir
 *   node scripts/test_gemini.js Puck
 *   node scripts/test_gemini.js Aoede
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SUPABASE_URL = "https://xtdfhxczdlgyhkqsltyq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZGZoeGN6ZGxneWhrcXNsdHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzg2OTUsImV4cCI6MjEwMjcxNDY5NX0.ARI4z_eWMhBQiF66xTXKDOrspfsBQjnG81qxaBhEuww";

function pcmToWav(pcmBuffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

async function getApiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/daily_workouts?id=eq.9999`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    if (data && data.length > 0) {
      const cfg = JSON.parse(data[0].description);
      if (cfg.gemini_api_key) return cfg.gemini_api_key;
    }
  } catch (e) {}

  return null;
}

async function testGemini() {
  const voiceName = process.argv[2] && !process.argv[2].startsWith("AIza") && !process.argv[2].startsWith("AQ.") ? process.argv[2] : "Aoede";

  console.log("==================================================");
  console.log(`🔊 TMM 2027 Gemini Voice Tester (Voice: Coach Vega - ${voiceName} Female)`);
  console.log("==================================================\n");

  const apiKey = (process.argv[2] && (process.argv[2].startsWith("AIza") || process.argv[2].startsWith("AQ."))) 
    ? process.argv[2] 
    : await getApiKey();

  if (!apiKey) {
    console.log("⚠️ No Gemini API Key found.\n");
    console.log("👉 How to run:");
    console.log("   node scripts/test_gemini.js <YOUR_GEMINI_API_KEY>");
    console.log("   OR configure your key in the Web Dashboard settings modal.");
    process.exit(1);
  }

  const samplePrompt = "Good morning runner. Coach Vega here. Settle into an easy rhythm, keep your cadence light, and let the kilometers come to you.";

  console.log("🚀 Synthesizing 24kHz HD audio via Google Gemini Flash Audio API...");
  console.log(`🎙️ Voice: ${voiceName}`);
  console.log(`💬 Text: "${samplePrompt}"\n`);

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: samplePrompt }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName }
            }
          }
        }
      })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(p => p.inlineData && p.inlineData.mimeType?.startsWith("audio/"));

    if (!audioPart || !audioPart.inlineData?.data) {
      throw new Error("No inline audio data returned by Gemini");
    }

    const pcmBuf = Buffer.from(audioPart.inlineData.data, "base64");
    const wavBuf = pcmToWav(pcmBuf, 24000);

    const outPath = path.join(__dirname, "..", `test_gemini_${voiceName.toLowerCase()}.wav`);
    fs.writeFileSync(outPath, wavBuf);

    console.log(`✅ Success! Audio file written to:`);
    console.log(`   ${outPath} (${wavBuf.length} bytes, 24kHz 16-bit Mono)\n`);

    if (process.platform === "darwin") {
      console.log(`🔊 Playing audio through your Mac speakers via 'afplay'...`);
      try {
        execSync(`afplay "${outPath}"`);
        console.log("🎉 Playback finished!\n");
      } catch (e) {
        console.log(`(Playback ended: ${e.message})`);
      }
    } else {
      console.log("👉 You can now play this .wav file with any media player.");
    }
  } catch (err) {
    console.error("❌ Gemini Audio error:", err.message);
  }
}

testGemini();
