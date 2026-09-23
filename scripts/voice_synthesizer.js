/**
 * TMM 2027 - Hybrid Studio Voice Synthesizer
 * 
 * Synthesizes audio cues into local studio-quality .wav / .mp3 audio clips:
 * - Sunday Long Runs -> ElevenLabs API (Voice: "Adam" or "Rachel")
 * - Weekday Runs -> Gemini 2.0 Flash Audio (Voice: "Fenrir" or "Puck")
 */

const fs = require("fs");
const path = require("path");

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

async function getElevenLabsApiKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
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

/**
 * Synthesizes speech with Gemini Audio (Aoede female or Fenrir) -> returns WAV buffer
 */
async function synthesizeGeminiAudio(text, voiceName = "Aoede") {
  const apiKey = await getGeminiApiKey();
  if (!apiKey) throw new Error("Gemini API key missing.");

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
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
    throw new Error(`Gemini Audio error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const rawBase64 = data.candidates[0].content.parts[0].inlineData.data;
  const pcmBuf = Buffer.from(rawBase64, "base64");
  return pcmToWav(pcmBuf, 24000);
}

/**
 * Synthesizes speech with ElevenLabs API -> returns MP3 buffer
 * Defaults to Coach Vega (Female Sarah: EXAVITQu4vr4xnSDxMaL)
 */
async function synthesizeElevenLabsAudio(text, voiceId = "EXAVITQu4vr4xnSDxMaL", apiKey = null) {
  const key = apiKey || await getElevenLabsApiKey();
  if (!key) throw new Error("ElevenLabs API key missing.");

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": key,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg"
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    })
  });

  if (!res.ok) {
    throw new Error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Pre-renders an entire Coach Script into cached audio files.
 */
async function preRenderScriptAudio(scriptObj, outputDir) {
  const date = scriptObj.workout_date;
  const isSunday = (scriptObj.workout_type || "").toLowerCase().includes("long") || new Date(date).getDay() === 0;

  const targetDir = outputDir || path.join(__dirname, "..", "audio_assets", date);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const elevenKey = await getElevenLabsApiKey();
  const useElevenLabs = isSunday && !!elevenKey;

  console.log(`🎙️ Pre-rendering audio for ${date} (${useElevenLabs ? "ElevenLabs - Coach Vega (Female)" : "Gemini Audio - Coach Vega (Aoede)"})...`);

  for (let i = 0; i < scriptObj.cues.length; i++) {
    const cue = scriptObj.cues[i];
    const fileName = `cue_${String(i + 1).padStart(2, "0")}_${cue.id}.${useElevenLabs ? "mp3" : "wav"}`;
    const filePath = path.join(targetDir, fileName);

    if (fs.existsSync(filePath)) {
      cue.audio_file = fileName;
      cue.audio_path = filePath;
      continue;
    }

    try {
      let audioBuffer;
      if (useElevenLabs) {
        audioBuffer = await synthesizeElevenLabsAudio(cue.text);
      } else {
        audioBuffer = await synthesizeGeminiAudio(cue.text, "Fenrir");
      }
      fs.writeFileSync(filePath, audioBuffer);
      cue.audio_file = fileName;
      cue.audio_path = filePath;
      console.log(`  ✅ [${i + 1}/${scriptObj.cues.length}] Rendered: ${fileName} (${audioBuffer.length} bytes)`);
    } catch (err) {
      console.warn(`  ⚠️ Could not synthesize cue ${cue.id}: ${err.message}`);
    }
  }

  console.log(`🎉 Audio pre-rendering complete for ${date}! Saved in: ${targetDir}`);
  return scriptObj;
}

module.exports = {
  synthesizeGeminiAudio,
  synthesizeElevenLabsAudio,
  preRenderScriptAudio,
  pcmToWav
};
