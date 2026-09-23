/**
 * Interactive Audio Testing Harness
 * 
 * Synthesizes test cues locally on your Mac so you can preview both
 * Gemini Audio and ElevenLabs voices right now.
 */

const fs = require("fs");
const path = require("path");
const { synthesizeGeminiAudio, synthesizeElevenLabsAudio } = require("./voice_synthesizer");

async function runTest() {
  console.log("==================================================");
  console.log("🎧 TMM 2027 Audio Model Verification Harness");
  console.log("==================================================\n");

  const testSampleText = "Good morning runner. Settle into an easy rhythm. Keep your shoulders soft, your cadence light, and let the kilometers come to you.";

  // 1. Test Gemini Audio (Fenrir - Grounded Athletic Male)
  console.log("1️⃣ Testing Gemini 2.0 Flash Audio (Voice: Fenrir)...");
  try {
    const fenrirWav = await synthesizeGeminiAudio(testSampleText, "Fenrir");
    const fenrirPath = path.join(__dirname, "..", "test_gemini_fenrir.wav");
    fs.writeFileSync(fenrirPath, fenrirWav);
    console.log(`   ✅ Success! Saved to: ${fenrirPath} (${fenrirWav.length} bytes)`);
  } catch (err) {
    console.error(`   ❌ Gemini Fenrir Error:`, err.message);
  }

  // 2. Test Gemini Audio (Puck - Upbeat Athletic)
  console.log("\n2️⃣ Testing Gemini 2.0 Flash Audio (Voice: Puck)...");
  try {
    const puckWav = await synthesizeGeminiAudio(testSampleText, "Puck");
    const puckPath = path.join(__dirname, "..", "test_gemini_puck.wav");
    fs.writeFileSync(puckPath, puckWav);
    console.log(`   ✅ Success! Saved to: ${puckPath} (${puckWav.length} bytes)`);
  } catch (err) {
    console.error(`   ❌ Gemini Puck Error:`, err.message);
  }

  // 3. Test ElevenLabs if key available
  console.log("\n3️⃣ Testing ElevenLabs API...");
  try {
    const elevenMp3 = await synthesizeElevenLabsAudio(testSampleText);
    const elevenPath = path.join(__dirname, "..", "test_elevenlabs_adam.mp3");
    fs.writeFileSync(elevenPath, elevenMp3);
    console.log(`   ✅ Success! Saved to: ${elevenPath} (${elevenMp3.length} bytes)`);
  } catch (err) {
    console.log(`   ℹ️ ElevenLabs note: ${err.message} (Will be used automatically on Sundays when key is configured in settings).`);
  }

  console.log("\n==================================================");
  console.log("🎉 Test Complete! You can play test_gemini_fenrir.wav and test_gemini_puck.wav directly on your Mac.");
  console.log("==================================================");
}

runTest();
