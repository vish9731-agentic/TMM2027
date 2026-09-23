package com.tmm2027.runner

import android.content.Context
import android.util.Base64
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.security.MessageDigest
import java.util.concurrent.TimeUnit

/**
 * CloudVoiceSynthesizer - Fetches high-definition studio speech directly from
 * Google Gemini 2.5 Flash Audio API (Aoede female voice - 24kHz HD) and ElevenLabs API
 * (Sarah female voice for Sunday long runs), caching audio locally on the device.
 */
object CloudVoiceSynthesizer {

    private const val TAG = "CloudVoiceSynthesizer"
    private const val SUPABASE_URL = "https://xtdfhxczdlgyhkqsltyq.supabase.co"
    private const val SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZGZoeGN6ZGxneWhrcXNsdHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzg2OTUsImV4cCI6MjEwMjcxNDY5NX0.ARI4z_eWMhBQiF66xTXKDOrspfsBQjnG81qxaBhEuww"

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(25, TimeUnit.SECONDS)
        .build()

    private fun md5(input: String): String {
        val md = MessageDigest.getInstance("MD5")
        val digest = md.digest(input.toByteArray())
        return digest.joinToString("") { "%02x".format(it) }
    }

    private fun pcmToWav(pcmData: ByteArray, sampleRate: Int = 24000, numChannels: Int = 1, bitsPerSample: Int = 16): ByteArray {
        val byteRate = sampleRate * numChannels * (bitsPerSample / 8)
        val blockAlign = numChannels * (bitsPerSample / 8)
        val dataSize = pcmData.size
        val totalDataLen = 36 + dataSize
        val header = ByteArray(44)

        val bb = ByteBuffer.wrap(header)
        bb.order(ByteOrder.BIG_ENDIAN).putInt(0x52494646) // RIFF
        bb.order(ByteOrder.LITTLE_ENDIAN).putInt(totalDataLen)
        bb.order(ByteOrder.BIG_ENDIAN).putInt(0x57415645) // WAVE
        bb.order(ByteOrder.BIG_ENDIAN).putInt(0x666d7420) // fmt 
        bb.order(ByteOrder.LITTLE_ENDIAN).putInt(16) // Subchunk1Size (16 for PCM)
        bb.order(ByteOrder.LITTLE_ENDIAN).putShort(1.toShort()) // PCM format = 1
        bb.order(ByteOrder.LITTLE_ENDIAN).putShort(numChannels.toShort())
        bb.order(ByteOrder.LITTLE_ENDIAN).putInt(sampleRate)
        bb.order(ByteOrder.LITTLE_ENDIAN).putInt(byteRate)
        bb.order(ByteOrder.LITTLE_ENDIAN).putShort(blockAlign.toShort())
        bb.order(ByteOrder.LITTLE_ENDIAN).putShort(bitsPerSample.toShort())
        bb.order(ByteOrder.BIG_ENDIAN).putInt(0x64617461) // data
        bb.order(ByteOrder.LITTLE_ENDIAN).putInt(dataSize)

        return header + pcmData
    }

    /**
     * Resolves API keys from local SharedPreferences or cloud row 9999.
     */
    suspend fun resolveKeys(context: Context): Pair<String, String> = withContext(Dispatchers.IO) {
        val prefs = context.getSharedPreferences("tmm_prefs", Context.MODE_PRIVATE)
        var geminiKey = prefs.getString("gemini_api_key", "") ?: ""
        var elevenKey = prefs.getString("elevenlabs_api_key", "") ?: ""

        if (geminiKey.isNotEmpty() && elevenKey.isNotEmpty()) {
            return@withContext Pair(geminiKey, elevenKey)
        }

        try {
            val req = Request.Builder()
                .url("$SUPABASE_URL/rest/v1/daily_workouts?id=eq.9999")
                .addHeader("apikey", SUPABASE_ANON_KEY)
                .addHeader("Authorization", "Bearer $SUPABASE_ANON_KEY")
                .build()

            val res = httpClient.newCall(req).execute()
            val body = res.body?.string() ?: ""
            val arr = JSONArray(body)
            if (arr.length() > 0) {
                val row = arr.getJSONObject(0)
                val desc = row.optString("description", "")
                if (desc.isNotEmpty()) {
                    val cfg = JSONObject(desc)
                    if (geminiKey.isEmpty()) {
                        geminiKey = cfg.optString("gemini_api_key", "")
                        if (geminiKey.isNotEmpty()) {
                            prefs.edit().putString("gemini_api_key", geminiKey).apply()
                        }
                    }
                    if (elevenKey.isEmpty()) {
                        elevenKey = cfg.optString("elevenlabs_api_key", "")
                        if (elevenKey.isNotEmpty()) {
                            prefs.edit().putString("elevenlabs_api_key", elevenKey).apply()
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Log.w(TAG, "Could not fetch cloud keys: ${e.message}")
        }

        Pair(geminiKey, elevenKey)
    }

    /**
     * Synthesizes audio or returns cached audio file.
     */
    suspend fun getOrSynthesizeAudio(
        context: Context,
        promptText: String,
        isSunday: Boolean = false,
        voiceName: String = "Aoede"
    ): File? = withContext(Dispatchers.IO) {
        if (promptText.isBlank()) return@withContext null

        val cacheDir = File(context.cacheDir, "coach_voices").apply { mkdirs() }
        val ext = if (isSunday) "mp3" else "wav"
        val hash = md5("${promptText}_${voiceName}_$isSunday")
        val cacheFile = File(cacheDir, "vega_${hash}.$ext")

        if (cacheFile.exists() && cacheFile.length() > 1000) {
            return@withContext cacheFile
        }

        val (geminiKey, elevenKey) = resolveKeys(context)

        // 1. Sunday: Try ElevenLabs Sarah (Coach Vega)
        if (isSunday && elevenKey.isNotEmpty()) {
            try {
                Log.d(TAG, "Synthesizing via ElevenLabs Coach Vega (Sarah)...")
                val voiceId = "EXAVITQu4vr4xnSDxMaL" // Coach Vega (Sarah)
                val json = JSONObject().apply {
                    put("text", promptText)
                    put("model_id", "eleven_multilingual_v2")
                    put("voice_settings", JSONObject().apply {
                        put("stability", 0.5)
                        put("similarity_boost", 0.75)
                    })
                }

                val req = Request.Builder()
                    .url("https://api.elevenlabs.io/v1/text-to-speech/$voiceId")
                    .addHeader("xi-api-key", elevenKey)
                    .addHeader("Accept", "audio/mpeg")
                    .post(json.toString().toRequestBody("application/json".toMediaType()))
                    .build()

                val res = httpClient.newCall(req).execute()
                if (res.isSuccessful) {
                    val bytes = res.body?.bytes()
                    if (bytes != null && bytes.isNotEmpty()) {
                        FileOutputStream(cacheFile).use { it.write(bytes) }
                        Log.d(TAG, "✅ ElevenLabs audio cached: ${cacheFile.length()} bytes")
                        return@withContext cacheFile
                    }
                } else {
                    Log.w(TAG, "ElevenLabs HTTP ${res.code}: ${res.body?.string()}")
                }
            } catch (e: Exception) {
                Log.w(TAG, "ElevenLabs error, falling back to Gemini Audio: ${e.message}")
            }
        }

        // 2. Weekday or ElevenLabs Fallback: Gemini 2.5 Flash Audio (Aoede Female)
        if (geminiKey.isNotEmpty()) {
            try {
                Log.d(TAG, "Synthesizing via Google Gemini Flash Audio ($voiceName)...")
                val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=$geminiKey"

                val json = JSONObject().apply {
                    put("contents", JSONArray().put(JSONObject().apply {
                        put("parts", JSONArray().put(JSONObject().apply {
                            put("text", promptText)
                        }))
                    }))
                    put("generationConfig", JSONObject().apply {
                        put("responseModalities", JSONArray().put("AUDIO"))
                        put("speechConfig", JSONObject().apply {
                            put("voiceConfig", JSONObject().apply {
                                put("prebuiltVoiceConfig", JSONObject().apply {
                                    put("voiceName", voiceName)
                                })
                            })
                        })
                    })
                }

                val req = Request.Builder()
                    .url(url)
                    .post(json.toString().toRequestBody("application/json".toMediaType()))
                    .build()

                val res = httpClient.newCall(req).execute()
                if (res.isSuccessful) {
                    val bodyStr = res.body?.string() ?: ""
                    val root = JSONObject(bodyStr)
                    val candidates = root.optJSONArray("candidates")
                    val candidate = candidates?.optJSONObject(0)
                    val content = candidate?.optJSONObject("content")
                    val parts = content?.optJSONArray("parts")

                    var base64Data: String? = null
                    if (parts != null) {
                        for (i in 0 until parts.length()) {
                            val part = parts.getJSONObject(i)
                            val inlineData = part.optJSONObject("inlineData")
                            if (inlineData != null && inlineData.optString("mimeType").startsWith("audio/")) {
                                base64Data = inlineData.optString("data")
                                break
                            }
                        }
                    }

                    if (!base64Data.isNullOrEmpty()) {
                        val pcmBytes = Base64.decode(base64Data, Base64.DEFAULT)
                        val wavBytes = pcmToWav(pcmBytes, sampleRate = 24000)
                        val wavFile = File(cacheDir, "vega_${hash}.wav")
                        FileOutputStream(wavFile).use { it.write(wavBytes) }
                        Log.d(TAG, "✅ Gemini Audio cached: ${wavFile.length()} bytes (24kHz HD)")
                        return@withContext wavFile
                    } else {
                        Log.w(TAG, "No audio inlineData found in Gemini response")
                    }
                } else {
                    Log.w(TAG, "Gemini Audio HTTP ${res.code}: ${res.body?.string()}")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Gemini Audio synthesis error: ${e.message}")
            }
        }

        return@withContext null
    }
}
